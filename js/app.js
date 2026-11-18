import { ui } from './config.js';
import { config } from './config.js';
import { initialState, reduce, currentGift, currentStep, remaining, checkPin, validState, migrate, pendingPhoto, backup, validateBackup } from './game.js';
import { loadState, saveState, read, savePhoto, getPhoto, clearPhotos } from './storage.js';
import { locate } from './geo.js';
import { prepare } from './prepare.js';
import { processPhoto, persistPhoto, photoFile } from './photos.js';
import * as art from './art.js';
const app=document.querySelector('#app'), notice=document.querySelector('#notice');
const overlay=document.querySelector('#map-overlay'), mapImage=document.querySelector('#map-image'), countdown=document.querySelector('#countdown'), closeMap=document.querySelector('#close-map');
let skipOpenFor=null,state, screen='home', selected=0, busy=false, memoryMap=false, timer, registration, prepMessage='', panel=false, restoreCandidate=null, celebrate=false, sheetError=null;
function ask(text,yes='Sí',no='Cancelar') {return new Promise(resolve=>{const d=el('dialog',undefined,'ask');d.append(el('p',text));const row=el('div',undefined,'ask-row');const n=el('button',no,'secondary'),y=el('button',yes);n.type=y.type='button';const done=v=>{d.close();d.remove();resolve(v);};n.onclick=()=>done(false);y.onclick=()=>done(true);d.addEventListener('cancel',e=>{e.preventDefault();done(false);});row.append(n,y);d.append(row);document.body.append(d);d.showModal();});}
function el(tag,text,className) {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;}
function say(text) {if(sheetError){sheetError.textContent=text;return;}notice.textContent=text;notice.classList.remove('error');void notice.offsetWidth;notice.classList.add('error');}
function button(parent,text,fn,secondary=false) {const b=el('button',text,secondary?'secondary':'');b.type='button';b.addEventListener('click',()=>run(fn));parent.append(b);return b;}
async function run(fn) {if(busy)return;busy=true;app.setAttribute('aria-busy','true');app.querySelectorAll('button').forEach(b=>b.disabled=true);try{await fn();}catch(e){say(e.message||ui.noPudeCompletarEstePasoIntentalo);}finally{busy=false;app.setAttribute('aria-busy','false');app.querySelectorAll('button').forEach(b=>b.disabled=false);}}
function paragraphs(parent,text) {
 for(const textPart of text.split('\n\n')) {
  const p=el('p',textPart);
  if(textPart===ui.lindaLaNotaMas){p.className='words';p.replaceChildren();textPart.split(' · ').forEach((word,i)=>{if(i)p.append(document.createTextNode(' · '));p.append(el('span',word));});}
  parent.append(p);
 }
}
function drawing(parent,markup,className) {const n=el('span',undefined,className);n.innerHTML=markup;parent.append(n);return n;}
function letter(parent,text) {const n=el('div',undefined,'letter');paragraphs(n,text);parent.append(n);}
function shake(node) {if(!node)return;node.classList.remove('shake');void node.offsetWidth;node.classList.add('shake');node.addEventListener('animationend',()=>node.classList.remove('shake'),{once:true});}
function openCurrent() {if(pendingPhoto(state)!==null){openPhoto();return;}if(state.finished)screen='final';else if(currentStep(state)===5){selected=3;screen='solved';}else screen='step';render();}

function form(parent,label,submit,{secret=false,answer=false}={}) {
 const f=el('form'),id=`field-${document.querySelectorAll('input').length}`,l=el('label',label),input=el('input');l.htmlFor=id;input.id=id;input.required=true;input.autocomplete='off';input.type=secret?'password':'text';input.setAttribute('autocapitalize',answer?'sentences':'off');input.setAttribute('autocorrect','off');input.spellcheck=false;f.append(l,input);const b=el('button',answer?'Abrir mi regalo':label===ui.claveDeStiven?'Abrir':label===ui.codigoDeStiven?'Canjear':'Continuar');b.type='submit';f.append(b);f.addEventListener('submit',e=>{e.preventDefault();run(()=>submit(input.value));});parent.append(f);return input;
}
async function dispatch(action) {
 const next=reduce(state,action,Date.now());
 try {if(action.type==='RESET')await clearPhotos(next.state);else await saveState(next.state);} catch {say(ui.noPudeGuardarTuAvanceIntentalo);return false;}
 state=next.state;
 for(const effect of next.effects) {

  if(effect.type==='photoSaved'){photoSaved=effect.index;selected=effect.index;screen='solved';}
  if(effect.type==='solved'){selected=effect.index;screen='solved';celebrate=true;}
  if(effect.type==='casa')screen='casa';
  if(effect.type==='memoryMap')memoryMap=true;
 }
 render();for(const effect of next.effects)if(effect.type==='error'){if(action.type==='ANSWER'){const error=document.querySelector('#answer-error');if(error)error.textContent=effect.message;shake(document.querySelector('.level-prop'));}else say(effect.message);}return !next.effects.some(e=>e.type==='error');
}
function hideMap() {clearInterval(timer);overlay.hidden=true;mapImage.removeAttribute('src');app.inert=false;memoryMap=false;}
function tick() {
 if(memoryMap||overlay.hidden)return;
 const ms=remaining(state,Date.now());countdown.textContent=Math.ceil(ms/1000);
 if(!ms){hideMap();run(()=>dispatch({type:'EXPIRE'}));}
}
async function showMap(action=null) {
 mapImage.src='./assets/mapa.jpg';
 try {await mapImage.decode();}catch{mapImage.removeAttribute('src');say(ui.noPudeAbrirElMapaIntentalo);return;}
 if(!action && !remaining(state,Date.now())) {hideMap();await dispatch({type:'EXPIRE'});return;}
 // Commit the consultation before revealing it, so a failed write grants no free view.
 if(action && !await dispatch(action)){hideMap();return;}
 if(!memoryMap && !remaining(state,Date.now())){hideMap();return;}
 overlay.hidden=false;app.inert=true;countdown.textContent='';closeMap.hidden=true;
 closeMap.hidden=!memoryMap;countdown.hidden=memoryMap;
 clearInterval(timer);tick();if(!overlay.hidden)timer=setInterval(tick,150);
}
closeMap.addEventListener('click',()=>{hideMap();render();});
document.addEventListener('visibilitychange',()=>{if(!overlay.hidden)tick();});
function back(parent) {button(parent,state.started?'Volver al camino':'Volver',()=>{screen='home';panel=false;render();},true);}
function render() {
 if(state.started && screen==='rules')screen='home';
 cleanupPhotos();app.replaceChildren();notice.textContent='';
 if(state.started && screen==='home'){renderCamino();return;}
 window.scrollTo({top:0,behavior:'instant'});
 let section=el('section',undefined,'welcome-card');
 app.append(section);
 if(screen==='panel'){renderPanel(section);return;}
 if(screen==='pin'){section.append(el('h1',ui.paraStiven));form(section,'PIN',value=>{if(checkPin(value)){panel=true;screen='panel';render();}else say(ui.esePinNoFunciona);},{secret:true});back(section);return;}
 if(!state.started){decorations();section.classList.add('welcome-card--intro');drawing(section,art.gift(screen==='rules'?'unlocked':'current'),'welcome-gift');section.append(el('p',ui.paraTiConCarino,'eyebrow'));}
 if(!state.started) {
  if(screen==='rules') {
   section.append(el('h1',ui.antesDeComenzar));
   const rules=el('ul',undefined,'rules');const icons=[art.mapIcon(),art.heartsArc(1),art.giftIcon(),art.padlock()];ui.elMapaApareceSoloUnosSegundos.split('\n\n').forEach((text,i)=>{const row=el('li');drawing(row,icons[i],'rule-icon');row.append(el('p',text));rules.append(row);});section.append(rules);
   button(section,ui.estoyLista,()=>showMap({type:'START'}));button(section,'Volver',()=>{screen='home';render();},true);
  } else {
   section.append(el('h1',config.welcome.text));paragraphs(section,ui.sweetEsteDiaGuardaPequenosMomentos);
   button(section,ui.comenzarAventura,()=>{screen='rules';render();});
   button(section,ui.prepararParaJugarSinSenal,async()=>{
    const list=el('div');section.append(list);
    const result=await prepare((text,ok)=>list.append(el('p',`${ok===true?ui.text:ok==='info'?'•':'✗'} ${text}`,'hint')));prepMessage=result.message;const message=el('p',prepMessage);section.append(message);
    if(!result.ok)button(section,'Reintentar',async()=>{list.replaceChildren();const retry=await prepare((text,ok)=>list.append(el('p',`${ok===true?ui.text:ok==='info'?'•':'✗'} ${text}`,'hint')));prepMessage=retry.message;message.textContent=prepMessage;},true);
   },true);
   if(prepMessage)section.append(el('p',prepMessage,'hint'));
   button(section,ui.paraStiven,()=>{screen='pin';render();},true).classList.add('quiet');
  }return;
 }

 section.remove();
 if(screen==='final') {
  section=levelScene(art.goal(true),'Final',5);
  section.append(el('h1',ui.paraTiSweet));letter(section,config.final);
  section.append(el('h2',config.photos.albumTitle));const album=el('div',undefined,'photo-album');section.append(album);state.gifts.forEach((g,i)=>{if(g.photo==='taken')loadPolaroid(album,i,true);});
  const a=el('a',ui.escucharNuestraCancion,'link-button secondary');a.href=config.song;a.target='_blank';a.rel='noopener noreferrer';section.append(a);
  if(config.memoriesAfterEnd)back(section);return;
 }
 if(screen==='casa') {section=levelScene(art.house(),'Casa',2);section.append(el('h1',ui.unPoquitoMasDeCamino));letter(section,config.casa.text);back(section);return;}
 if(screen==='solved') {
  section=levelScene(art.gift('solved'),`Regalo ${selected+1}`,[0,1,3,4][selected],selected+1,true);
  section.append(el('h1',ui.loLograste));
  if(selected===0){letter(section,config.guest);section.append(el('p',ui.stivenTieneTuSorpresa));}
  else section.append(el('p',selected===3?ui.stivenTieneTuUltimaSorpresa:ui.stivenTieneTuSorpresa2));
  if(state.gifts[selected].photo===null){
   if(received.has(selected))renderPhotoCard(section,selected);
   else button(section,selected===3?ui.yaLoTengoEnMisManos:config.photos.received,()=>{received.add(selected);render();});
  }else {
   if(state.gifts[selected].photo==='taken')loadPolaroid(section,selected,false,true);
   if(photoSaved===selected)section.append(el('p',selected===3?config.photos.savedLast:config.photos.saved,'photo-status'));
   if(selected===3)button(section,'Leer tu carta',()=>{screen='final';render();});
  }
  back(section);
  if(celebrate){celebrate=false;celebration();}return;
 }
 if(screen==='step') {
  const i=currentGift(state),step=currentStep(state),unlocked=i!==null && state.gifts[i].unlocked;
  section=levelScene(i===null?art.signpost():art.gift(unlocked?'unlocked':'current'),i===null?'Una parada':`Regalo ${i+1}`,step,i===null?null:i+1);
  if(unlocked) {
   const via=state.gifts[i].via??'a',gift=config.gifts[i];const tabs=el('div',undefined,'tabs');tabs.style.setProperty('--selected',via==='a'?0:1);tabs.setAttribute('aria-label','Elige tu pista');section.append(tabs);
   for(const v of ['a','b']){const b=button(tabs,gift[v].button,()=>dispatch({type:'VIA',via:v}));b.setAttribute('aria-pressed',String(v===via));}
   const card=el('div',undefined,'gift-tag');drawing(card,'<svg viewBox="0 0 60 40" aria-hidden="true"><path d="M14 30 C6 18 14 6 26 10 C34 13 40 6 52 4" fill="none" stroke="#B2284E" stroke-width="2.6" stroke-linecap="round"/><path d="M52 4 c-6 -4 -12 2 -6 5 c-5 3 1 9 6 4 z" fill="#E23D6B"/></svg>','tag-string');paragraphs(card,gift[via].text);section.append(card);
   const input=form(section,ui.tuRespuesta,value=>dispatch({type:'ANSWER',via,value}),{answer:true});
   const error=el('p',undefined,'field-error');error.id='answer-error';error.setAttribute('role','status');input.setAttribute('aria-describedby',error.id);input.after(error);
   if((state.wrongAttempts[`${i}${via}`]??0)>=2)section.append(el('p',ui.siQuieresPideleUnaAyuditaA,'hint'));
  } else {
   section.append(el('h1',i===null?'Una parada en el camino':'¿Ya llegamos?'));
   if(step===0){const geo=button(section,ui.comprobarDondeEstoy,async()=>{geo.textContent='Buscando tu ubicación…';try{await dispatch({type:'GEO',position:await locate()});}finally{geo.textContent=ui.comprobarDondeEstoy;}});section.append(el('p','o','separator'));}
   form(section,ui.claveDeStiven,value=>dispatch({type:'KEY',value}));
   if(pendingPhoto(state)!==null)button(section,'Ir a mi foto',openPhoto,true);
  }back(section);
 }
}
const received=new Set();
let photoSaved=null, photoGeneration=0;
const photoURLs=new Set();
function cleanupPhotos(){photoGeneration++;for(const url of photoURLs)URL.revokeObjectURL(url);photoURLs.clear();}
function photoURL(blob){const url=URL.createObjectURL(blob);photoURLs.add(url);return url;}
function openPhoto(){selected=pendingPhoto(state);if(selected===null)return;screen='solved';render();}
function polaroid(blob,index,mini=false){
 const figure=el('figure',undefined,mini?'polaroid mini-polaroid':'polaroid'),image=el('img');
 image.src=photoURL(blob);image.alt=`Recuerdo en ${config.gifts[index].place}`;
 figure.append(image);if(!mini)figure.append(el('figcaption',config.gifts[index].place));return figure;
}
function phoneButton(parent,blob,index){
 const file=photoFile(blob,index),files=[file];let shareable=false;
 try{shareable=Boolean(navigator.share && navigator.canShare?.({files}));}catch{/* download */}
 if(shareable){
  // File is ready before the click. No asynchronous work precedes share().
  const b=el('button',config.photos.saveToPhone);b.type='button';
  b.onclick=()=>{try{navigator.share({files}).catch(e=>{if(e.name!=='AbortError')say('No pude compartir tu foto. Inténtalo de nuevo.');});}catch{say('No pude compartir tu foto. Inténtalo de nuevo.');}};parent.append(b);
 }else{const a=el('a',config.photos.saveToPhone,'link-button secondary');a.href=photoURL(blob);a.download=file.name;parent.append(a);}
}
async function loadPolaroid(parent,index,enlarge=false,save=false,mini=false){
 const generation=photoGeneration,slot=el('span',undefined,mini?'photo-mini-slot':'photo-slot');parent.append(slot);parent=slot;
 try{
  const blob=await getPhoto(index);if(generation!==photoGeneration)return;
  if(!blob){if(!mini)parent.append(el('p','Esta foto no está en este dispositivo. Si la guardaste en tu celular, búscala en Fotos.','hint'));return;}
  const figure=polaroid(blob,index,mini);parent.append(figure);
  if(enlarge){const b=el('button',undefined,'photo-expand');b.type='button';b.setAttribute('aria-label',`Ampliar recuerdo en ${config.gifts[index].place}`);figure.replaceChildren(b,el('figcaption',config.gifts[index].place));const img=el('img');img.src=photoURL(blob);img.alt=`Recuerdo en ${config.gifts[index].place}`;b.append(img);
   b.onclick=()=>{const d=el('dialog',undefined,'photo-overlay');d.append(polaroid(blob,index));const close=()=>{for(const img of d.querySelectorAll('img')){URL.revokeObjectURL(img.src);photoURLs.delete(img.src);}d.close();d.remove();b.focus();};button(d,'Cerrar',close,true);d.addEventListener('cancel',e=>{e.preventDefault();close();});document.body.append(d);d.showModal();};
  }
  if(save)phoneButton(parent,blob,index);
 }catch(e){if(generation===photoGeneration && !mini)parent.append(el('p',e.message,'field-error'));}
}
function renderPhotoCard(parent,index){
 const card=el('section',undefined,'photo-card');parent.append(card);
 card.append(el('h2',index===3?config.photos.titleLast:config.photos.title),el('p',config.photos.prompts[index]));
 const preview=el('div'),empty=el('div','📷','polaroid photo-empty');empty.setAttribute('aria-hidden','true');preview.append(empty);card.append(preview);
 const camera=el('input'),library=el('input');
 for(const input of [camera,library]){input.type='file';input.accept='image/*';input.hidden=true;card.append(input);}camera.setAttribute('capture','environment');
 let candidate=null,previewURL=null;const generation=photoGeneration;
 const choose=button(card,config.photos.choose,async()=>{if(!candidate)return;const blob=candidate,file=photoFile(blob,index);let sharing=null;try{if(navigator.share&&navigator.canShare?.({files:[file]}))sharing=navigator.share({files:[file]}).catch(()=>{});}catch{/* el botón de guardar queda disponible */}if(await persistPhoto(index,blob,savePhoto,dispatch))candidate=null;await sharing;});choose.hidden=true;
 const take=button(card,config.photos.take,()=>camera.click());button(card,config.photos.fromLibrary,()=>library.click(),true);
 for(const input of [camera,library])input.addEventListener('change',()=>run(async()=>{
  const file=input.files[0];input.value='';if(!file)return;
  const blob=await processPhoto(file);if(generation!==photoGeneration)return;
  if(previewURL){URL.revokeObjectURL(previewURL);photoURLs.delete(previewURL);}
  candidate=blob;const figure=polaroid(blob,index);previewURL=figure.children[0].src;preview.replaceChildren(figure);choose.hidden=false;take.textContent=config.photos.retake;take.classList.add('secondary');
 }));
 const skip=el('div');const openSkip=()=>{skipOpenFor=index;skip.replaceChildren();form(skip,ui.claveDeStiven,value=>dispatch({type:'PHOTO_SKIP',index,value}));};button(card,config.photos.skipLabel,openSkip,true).classList.add('quiet');card.append(skip);if(skipOpenFor===index)openSkip();
}
function decorations() {
 const decor=el('div',undefined,'welcome-decor');decor.setAttribute('aria-hidden','true');
 for(let i=0;i<3;i++){drawing(decor,art.island(i,true),`decor-island decor-island-${i}`);drawing(decor,art.cloud(),`decor-cloud decor-cloud-${i}`);}app.prepend(decor);
}
function levelScene(prop,label,index,n=null,solved=false) {
 const page=el('section',undefined,'level-page'),header=el('header',undefined,'level-header');
 const backButton=button(header,'‹ Camino',()=>{screen='home';render();},true);backButton.classList.add('back-pill');
 const scene=el('div',undefined,'level-island');drawing(scene,art.island(index),'level-ground');drawing(scene,prop,'level-prop');
 if(n!==null)drawing(scene,art.badge({n}),'level-badge');
 if(solved)drawing(scene,art.heartsArc(3),'level-hearts');
 scene.append(el('p',label,'level-label'));header.append(scene);page.append(header);
 const sheet=el('div',undefined,'level-sheet');page.append(sheet);app.append(page);return sheet;
}
function celebration() {
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const scene=document.querySelector('.level-island');scene.classList.add('opening');
 const petalColors=['#B2284E','#E23D6B','#F2A3BC','#EC5A84','#FFD27A'];for(let i=0;i<18;i++){const petal=el('span',i%5===4?'✦':'♥','petal');petal.setAttribute('aria-hidden','true');const a=(i/18)*Math.PI*2+Math.random()*.4,d=90+Math.random()*90;petal.style.setProperty('--x',`${Math.cos(a)*d}px`);petal.style.setProperty('--y',`${Math.sin(a)*d*.7-90}px`);petal.style.setProperty('--r',`${Math.round(Math.random()*120-60)}deg`);petal.style.setProperty('--delay',`${Math.round(Math.random()*180)}ms`);petal.style.color=petalColors[i%5];petal.style.fontSize=`${14+Math.round(Math.random()*16)}px`;scene.append(petal);petal.addEventListener('animationend',()=>petal.remove(),{once:true});}
 setTimeout(()=>{scene.classList.remove('opening');scene.querySelectorAll('.petal').forEach(n=>n.remove());},1300);
}
function renderCamino() {
 const pending=pendingPhoto(state);
 const current=currentStep(state),solved=state.gifts.filter(g=>g.solved).length;
 const hud=el('header',undefined,'hud'),progress=el('div',undefined,'hud-progreso');progress.append(el('span',`Regalo ${Math.min(solved+1,4)} de 4`,'hud-titulo'));drawing(progress,art.heartsArc(solved));hud.append(progress);
 const map=button(hud,'',openMapSheet);map.className='hud-mapa';drawing(map,art.mapIcon());map.append(el('span','Mapa'),el('span',`${state.map.lives} ♥`,'hud-vidas'));app.append(hud);
 const scene=el('section',undefined,'camino'),X=[30,68,34,66,32,52],H=1700,ys=X.map((_,i)=>H-260-i*250);scene.style.height=`${H}px`;scene.setAttribute('aria-label','Camino de regalos');
 for(let i=0;i<14;i++){const r=drawing(scene,art.ripple(),'ripple');r.style.left=((i*37)%86)+'%';r.style.top=(60+i*(H-120)/14)+'px';}
 [[-8,.12],[62,.42],[-12,.7]].forEach(([x,f])=>{const c=drawing(scene,art.cloud(),'cloud');c.style.left=x+'%';c.style.top=H*f+'px';});
 for(let i=0;i<5;i++)for(let k=1;k<=3;k++){const t=k/4,stone=drawing(scene,art.stone(i>=current),'stone'+(i>=current?' is-dim':''));stone.style.left=`calc(${X[i]+(X[i+1]-X[i])*t+Math.sin(t*Math.PI)*(i%2?-10:10)}% - 20px)`;stone.style.top=(ys[i]-78+(ys[i+1]+92-ys[i]+78)*t)+'px';}
 [0,1,null,2,3,null].forEach((g,i)=>{
  const kind=i===5?'goal':g===null?'casa':'gift',done=kind==='gift'?state.gifts[g].solved:kind==='casa'?state.casa.seen:state.finished;
  const unlocked=kind==='gift' && state.gifts[g].unlocked && !done;
  const status=done?'solved':unlocked?'unlocked':i===current?'current':'locked',dim=status==='locked';
  const node=button(scene,'',()=>{if(done){if(kind==='gift'){selected=g;screen='solved';}else screen=kind==='casa'?'casa':'final';render();}else if(i===current || unlocked)openCurrent();else{shake(node);say('Todavía no, sigamos el camino 💛');}});
  node.className=`nivel nivel--${status} nivel--${kind}`;node.style.left=X[i]+'%';node.style.top=ys[i]+'px';if(pending!==null?g===pending:i===current)node.id='current-level';
  const label=kind==='gift'?`Regalo ${g+1}`:kind==='casa'?(done?'Casa':'Una parada'):'Final';
  node.setAttribute('aria-label',done&&kind==='gift'?`${label}, abierto, ${config.gifts[g].place}`:done&&kind==='casa'?'Casa, pista vista':`${label}, ${done?'abierto':dim?'todavía cerrado':unlocked?'Tu acertijo te espera':'Aquí hay algo para ti'}`);
  drawing(node,art.island(i,dim),'nivel-isla');
  if([1,3,4].includes(i))drawing(node,art.frailejon(),`nivel-deco nivel-deco--${i%2?'r':'l'}`);
  drawing(node,kind==='gift'?art.gift(status):kind==='casa'?(done?art.house():art.signpost()):art.goal(state.finished),'nivel-prop');
  if(kind!=='goal')drawing(node,art.badge({kind:dim?'lock':kind==='casa'?'house':'number',n:g+1,active:!dim}),'nivel-badge');
  if(done&&kind==='gift')drawing(node,art.heartsArc(3),'nivel-hearts');
  if(kind==='gift' && g===pending)node.append(el('span','Falta tu foto 📸','nivel-here'));
  if(kind==='gift' && state.gifts[g].photo==='taken')loadPolaroid(node,g,false,false,true);
  if(pending===null&&(status==='current'||unlocked)&&kind!=='goal'){if(!unlocked)drawing(node,art.car(),'nivel-car');node.append(el('span',unlocked?'Tu acertijo te espera':ui.aquiHayAlgoParaTi,'nivel-here'));}
  const title=el('span',undefined,'nivel-label');title.append(el('b',label));if(done&&kind==='gift')title.append(el('small',config.gifts[g].place));node.append(title);
 });
 const stiven=button(scene,ui.paraStiven,()=>{screen='pin';render();});stiven.className='para-stiven';stiven.style.top=(H-170)+'px';app.append(scene);
 const cta=el('div',undefined,'cta'),go=button(cta,'',openCurrent);go.className='cta-btn';drawing(go,art.giftIcon());go.append(el('span',pending!==null?'Tomar mi foto 📸':state.finished?'Leer tu carta':ui.aquiHayAlgoParaMi));app.append(cta);
 requestAnimationFrame(()=>document.querySelector('#current-level')?.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
}
function openMapSheet() {
 if(state.finished && config.memoriesAfterEnd)return showMap({type:'MAP'});
 const d=el('dialog',undefined,'map-sheet');d.setAttribute('aria-labelledby','map-sheet-title');
 const close=()=>{sheetError=null;d.close();d.remove();document.querySelector('.hud-mapa')?.focus();};
 d.addEventListener('cancel',e=>{e.preventDefault();if(!busy)close();});
 function contents(){
  d.replaceChildren();drawing(d,art.mapIcon(),'sheet-icon');const title=el('h2',state.map.lives>0?'¿Usar tu vida para ver el mapa otra vez?':ui.pideleAStivenUnaNuevaOportunidad);title.id='map-sheet-title';d.append(title);
  if(state.map.lives>0)button(d,'Sí, verlo',async()=>{d.querySelectorAll('button').forEach(b=>b.disabled=true);try{await showMap({type:'MAP'});if(!overlay.hidden)close();}finally{d.querySelectorAll('button').forEach(b=>b.disabled=false);}});
  else form(d,ui.codigoDeStiven,async value=>{if(await dispatch({type:'CODE',value}))contents();});
  sheetError=el('p',undefined,'field-error');sheetError.setAttribute('role','status');d.append(sheetError);button(d,'Ahora no',close,true);
 }
 contents();document.body.append(d);d.showModal();
}
function summary(s) {return `${s.gifts.filter(g=>g.solved).length} regalos abiertos · ${s.map.lives} vidas · ${s.map.redeemedCodes.length} códigos usados${s.finished?' · Aventura terminada':''}`;}
function renderPanel(parent) {
 if(!panel){screen='pin';render();return;}
 parent.append(el('p','Las fotos no van en el respaldo; si Sweet las guardó en su celular, quedan en Fotos.','hint'));
 parent.append(el('h1',ui.paraStiven),el('p',summary(state)),el('p',registration?.waiting?ui.hayUnaVersionNuevaEsperando:ui.noHayUnaVersionNuevaEsperando));
 button(parent,ui.guardarRespaldo,async()=> {
  const text=JSON.stringify(backup(state,Date.now()),null,2),area=el('textarea');area.readOnly=true;area.setAttribute('aria-label',ui.respaldoDeLaPartida);area.value=text;parent.append(area);
  button(parent,'Copiar',async()=>{try{await navigator.clipboard.writeText(text);say(ui.respaldoCopiado);}catch{area.focus();area.select();say(ui.seleccionaYCopiaElTextoDel);}},true);
  const file=new File([text],'sweet-respaldo.json',{type:'application/json'});
  let shared=false;try{if(navigator.share){await navigator.share({files:[file]});shared=true;}}catch{/* download fallback */}
  if(!shared){const url=URL.createObjectURL(file),a=el('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 });
 const label=el('label',ui.restaurarRespaldo);label.htmlFor='restore-text';const area=el('textarea');area.id='restore-text';parent.append(label,area);
 const fileLabel=el('label',ui.oEligeUnArchivo);fileLabel.htmlFor='restore-file';const file=el('input');file.id='restore-file';file.type='file';file.accept='.json,application/json';parent.append(fileLabel,file);
 file.addEventListener('change',()=>run(async()=>{if(file.files[0]){if(file.files[0].size>1000000)throw new Error(ui.eseRespaldoNoEsValido);area.value=await file.files[0].text();}}));
 button(parent,ui.revisarRespaldo,()=> {
  const candidate=validateBackup(area.value);if(!candidate){say(ui.eseRespaldoNoEsValido);return;}
  restoreCandidate=backup(candidate,Date.now());parent.append(el('p',summary(candidate)));
  button(parent,ui.reemplazarElAvanceActual,async()=>{if(await ask(ui.reemplazarElAvanceActual2,'Reemplazar')){if(await dispatch({type:'RESTORE',backup:restoreCandidate})){received.clear();photoSaved=null;panel=false;screen=state.finished?'final':'home';render();await resumeMap();}}},true);
 },true);
 if(registration?.waiting)button(parent,ui.activarVersionNueva,()=>{navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true});registration.waiting.postMessage({type:'SKIP_WAITING'});},true);
 button(parent,ui.reiniciarPartida,async()=>{if(await ask(ui.reiniciarPartida2,'Continuar') && await ask(ui.seBorraraElAvanceActualConfirmas,'Borrar avance')){if(await dispatch({type:'RESET'})){received.clear();photoSaved=null;panel=false;screen='home';render();}}},true);
 back(parent);
}
async function resumeMap() {if(remaining(state,Date.now()))await showMap();else if(state.map.activeUntil!==null)await dispatch({type:'EXPIRE'});}
async function boot() {
 navigator.storage?.persist?.().catch(()=>{});
 try {
  const saved=await loadState(), migrated=saved===undefined?initialState():migrate(saved);if(!migrated || !validState(migrated))throw new Error(ui.noPudeLeerTuAvanceCon);
  if(saved?.version===1)await saveState(migrated);
  state=migrated;const prep=await read('prep');if(prep?.ok)prepMessage=ui.laPreparacionSeComproboAnteriormentePuedes;
  screen=state.finished?'final':'home';render();await resumeMap();
 } catch(e){app.replaceChildren(el('p',e.message));button(app,'Reintentar',boot);}
 app.setAttribute('aria-busy','false');
 if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').then(r=>{registration=r;}).catch(()=>{});
}
boot();
