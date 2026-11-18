import { ui } from './config.js';
import { config } from './config.js';
import { compact, matches } from './normalize.js';
import { haversine } from './geo.js';
export function initialState() {
  return {version:2, started:false, startedAt:null, gifts:Array.from({length:4},()=>({unlocked:false,solved:false,via:null,unlockedBy:null,solvedAt:null,delivered:false,photo:null,photoAt:null})),casa:{seen:false},map:{firstViewDone:false,lives:1,livesUsed:0,activeUntil:null,redeemedCodes:[]},finished:false,finishedAt:null,wrongAttempts:{}};
}
export function currentStep(s) {
  if (!s.gifts[0].solved) return 0;
  if (!s.gifts[1].solved) return 1;
  if (!s.casa.seen) return 2;
  if (!s.gifts[2].solved) return 3;
  return s.gifts[3].solved ? 5 : 4;
}
export const currentGift = s => [0,1,null,2,3,null][currentStep(s)];
export const remaining = (s, now) => Math.max(0,(s.map.activeUntil ?? 0)-now);
export const checkPin = value => compact(value) === compact(config.pin);
const integer = n => Number.isSafeInteger(n) && n >= 0;
const time = n => n === null || (Number.isFinite(n) && n >= 0);
const exact = (o, keys) => o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o).sort().join() === keys.split(' ').sort().join();
function validateState(s, legacy=false) {
  if (!exact(s,'version started startedAt gifts casa map finished finishedAt wrongAttempts') || s.version!==(legacy?1:2) || typeof s.started!=='boolean' || typeof s.finished!=='boolean' || !time(s.startedAt) || !time(s.finishedAt)) return false;
  if (s.started !== (s.startedAt!==null) || s.finished !== (s.finishedAt!==null)) return false;
  if (!Array.isArray(s.gifts) || s.gifts.length!==4 || !exact(s.casa,'seen') || typeof s.casa.seen!=='boolean') return false;
  for (let i=0;i<4;i++) {
    const g=s.gifts[i];
    if (!exact(g,'unlocked solved via unlockedBy solvedAt delivered'+(legacy?'':' photo photoAt')) || ['unlocked','solved','delivered'].some(k=>typeof g[k]!=='boolean') || ![null,'a','b'].includes(g.via) || ![null,'geo','key'].includes(g.unlockedBy) || !time(g.solvedAt)) return false;
    if (g.unlocked !== (g.unlockedBy!==null) || (g.unlocked && (!s.started || (i>0 && !s.gifts[i-1].solved))) || (i>0 && g.unlockedBy==='geo') || (g.solved && (!g.unlocked || !g.via)) || g.solved !== (g.solvedAt!==null) || (g.delivered && !g.solved) || (!g.unlocked && g.via!==null)) return false;
    if (!legacy && (![null,'taken','skipped'].includes(g.photo) || !time(g.photoAt) || (g.photo===null)!==(g.photoAt===null) || (g.photo!==null && !g.solved) || (i>0 && g.unlocked && s.gifts[i-1].photo===null))) return false;
    if (g.solvedAt!==null && (g.solvedAt<s.startedAt || (i>0 && g.solvedAt<s.gifts[i-1].solvedAt))) return false;
  }
  if (!legacy && ((s.casa.seen && s.gifts[1].photo===null) || (s.finished && s.gifts[3].photo===null))) return false;
  const m=s.map;
  if (!exact(m,'firstViewDone lives livesUsed activeUntil redeemedCodes') || typeof m.firstViewDone!=='boolean' || m.firstViewDone!==s.started || !integer(m.lives) || !integer(m.livesUsed) || !time(m.activeUntil) || !Array.isArray(m.redeemedCodes)) return false;
  if (m.redeemedCodes.some(c=>typeof c!=='string' || c!==compact(c) || !config.lifeCodes.map(compact).includes(c)) || new Set(m.redeemedCodes).size!==m.redeemedCodes.length || m.lives!==1+m.redeemedCodes.length-m.livesUsed) return false;
  if (m.activeUntil!==null && m.activeUntil<s.startedAt) return false;
  if (!s.started && (m.activeUntil!==null || m.livesUsed || m.redeemedCodes.length)) return false;
  if (s.casa.seen && !s.gifts[1].solved || s.gifts[2].unlocked && !s.casa.seen || s.finished && (!s.gifts[3].delivered || s.finishedAt<s.gifts[3].solvedAt)) return false;
  if (!s.wrongAttempts || typeof s.wrongAttempts!=='object' || Array.isArray(s.wrongAttempts)) return false;
  return Object.entries(s.wrongAttempts).every(([k,v])=>/^[0-3][ab]$/.test(k) && integer(v) && s.gifts[Number(k[0])].unlocked);
}
export const validState = s => validateState(s);
export function migrate(state) {
  if (validState(state)) return structuredClone(state);
  if (!validateState(state,true)) return null;
  const s=structuredClone(state);s.version=2;
  s.gifts.forEach((g,i)=>{
    const passed=g.solved && (s.gifts[i+1]?.unlocked || (i===1 && s.casa.seen) || (i===3 && s.finished));
    g.photo=passed?'skipped':null;g.photoAt=passed?g.solvedAt:null;
  });
  return validState(s)?s:null;
}
export const pendingPhoto = s => {const i=s.gifts.findIndex(g=>g.solved && g.photo===null);return i<0?null:i;};
export function validateBackup(value) {
  try { const b=typeof value==='string'?JSON.parse(value):value;
    if (!exact(b,'app format savedAt state') || b.app!=='sweet-aventura' || b.format!==1 || !Number.isFinite(b.savedAt) || b.savedAt<0 || !migrate(b.state)) return null;
    return migrate(b.state);
  } catch { return null; }
}
export const backup = (state, now) => ({app:'sweet-aventura',format:1,savedAt:now,state:structuredClone(state)});
export function reduce(state, action, now) {
  const s=structuredClone(state), effects=[];
  const fail=message=>({state,effects:[{type:'error',message}]});
  const i=currentGift(s), step=currentStep(s);
  if (action.type==='RESTORE') { const restored=validateBackup(action.backup); return restored?{state:restored,effects:[]} : fail(ui.eseRespaldoNoEsValido); }
  if (action.type==='RESET') return {state:initialState(),effects:[]};
  if (action.type==='START') {
    if(s.started) return fail(ui.laAventuraYaComenzo);
    s.started=true;s.startedAt=now;s.map.firstViewDone=true;s.map.activeUntil=now+config.map.firstMs;
  } else if (action.type==='MAP') {
    if(!s.started || remaining(s,now)>0) return fail(ui.ahoraNoSePuedeAbrirEl);
    if(s.finished && config.memoriesAfterEnd) effects.push({type:'memoryMap'});
    else {if(s.map.lives<1) return fail(ui.pideleAStivenUnaNuevaOportunidad);s.map.lives--;s.map.livesUsed++;s.map.activeUntil=now+config.map.extraMs;}
  } else if(action.type==='EXPIRE') {if(s.map.activeUntil!==null && !remaining(s,now)) s.map.activeUntil=null;
  } else if(action.type==='CODE') {
    if(!s.started) return fail(ui.primeroComienzaLaAventura);
    const code=compact(action.value);
    if(s.map.redeemedCodes.includes(code)) return fail(ui.eseCodigoYaSeUso);
    if(!config.lifeCodes.map(compact).includes(code)) return fail(ui.eseCodigoNoFunciona);
    s.map.redeemedCodes.push(code);s.map.lives++;
  } else if(action.type==='KEY' || action.type==='GEO') {
    if(pendingPhoto(s)!==null) return fail(config.photos.needPhoto);
    if(!s.started || step===5) return fail(ui.esaClaveNoEsParaEste);
    if(action.type==='GEO') {
      if(i!==0) return fail(ui.ahoraNoHaceFaltaComprobarLa);
      const p=action.position, l=config.location;
      if(!p || ![p.lat,p.lng,p.accuracy].every(Number.isFinite) || Math.abs(p.lat)>90 || Math.abs(p.lng)>180 || p.accuracy<0 || p.accuracy>l.radiusM+l.accuracyAllowanceM) return fail(ui.laUbicacionEsImprecisaPideleA);
      if(haversine(p,l)>l.radiusM+Math.min(p.accuracy,l.accuracyAllowanceM)) return fail(ui.todaviaNoEstamosEnElLugar);
      s.gifts[0].unlocked=true;s.gifts[0].unlockedBy='geo';
    } else {
      const key=compact(action.value);
      if(step===2 && key===compact(config.casa.key)) {s.casa.seen=true;effects.push({type:'casa'});}
      else { const target=step===2?2:i;
        if(key!==compact(config.keys[target])) return fail(ui.esaClaveNoEsParaEste);
        if(step===2) s.casa.seen=true;
        s.gifts[target].unlocked=true;s.gifts[target].unlockedBy='key';
      }
    }
  } else if(action.type==='VIA' || action.type==='ANSWER') {
    if(i===null || !s.gifts[i].unlocked || !['a','b'].includes(action.via)) return fail(ui.esteMomentoAunNoEstaDisponible);
    s.gifts[i].via=action.via;
    if(action.type==='ANSWER') {
      if(matches(action.value,config.gifts[i][action.via])) {s.gifts[i].solved=true;s.gifts[i].solvedAt=now;effects.push({type:'solved',index:i});}
      else {const k=`${i}${action.via}`;s.wrongAttempts[k]=(s.wrongAttempts[k]??0)+1;effects.push({type:'error',message:ui.casiIntentaloOtraVez});}
    }
  } else if(action.type==='PHOTO' || action.type==='PHOTO_SKIP') {
    const index=action.index,g=s.gifts[index];
    if(!Number.isInteger(index) || !g || !g.solved || g.photo!==null) return fail(ui.esteMomentoAunNoEstaDisponible);
    if(action.type==='PHOTO_SKIP' && compact(action.value)!==compact(config.photos.skipCode)) return fail('Esa clave no funciona');
    g.photo=action.type==='PHOTO'?'taken':'skipped';g.photoAt=now;
    if(index===3){g.delivered=true;s.finished=true;s.finishedAt=now;}
    effects.push({type:'photoSaved',index});
  } else if(action.type==='FINISH') {
    return fail('Primero tu foto');
  } else return fail(ui.noPudeRealizarEsaAccion);
  return {state:s,effects};
}
