import { ui } from './config.js';
import { prepTest, write } from './storage.js';
const timeout=(promise,ms,message)=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(message)),ms);promise.then(v=>{clearTimeout(timer);resolve(v);},e=>{clearTimeout(timer);reject(e);});});
export function status(worker) {
  return new Promise((resolve,reject)=> {
    const channel=new MessageChannel();const timer=setTimeout(()=>{channel.port1.close();reject(new Error(ui.noPudeComprobarLaDescargaReintenta));},15000);
    channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();resolve(e.data);};
    worker.postMessage({type:'STATUS'},[channel.port2]);
  });
}
async function controlled() {
  if(navigator.serviceWorker.controller) return;
  await new Promise((resolve,reject)=> {
    const done=()=>{if(navigator.serviceWorker.controller){clearTimeout(timer);navigator.serviceWorker.removeEventListener('controllerchange',done);resolve();}};
    const timer=setTimeout(()=>{navigator.serviceWorker.removeEventListener('controllerchange',done);reject(new Error(ui.cierraYVuelveAAbrirLa));},15000);
    navigator.serviceWorker.addEventListener('controllerchange',done);done();
  });
}
export async function prepare(report) {
  let step='Compatibilidad';
  try {
    if(!('serviceWorker' in navigator) || !globalThis.indexedDB) throw new Error(ui.esteNavegadorNoPermitePrepararLa);
    report(step,true);step=ui.activacion;
    await timeout(navigator.serviceWorker.register('./sw.js'),15000,ui.noPudeDescargarLaAventuraReintenta);
    await timeout(navigator.serviceWorker.ready,15000,ui.laDescargaNoTerminoReintentaCon);await controlled();report(step,true);
    step=ui.contenidoSinSenal;
    const result=await status(navigator.serviceWorker.controller);
    if(!Array.isArray(result.missing) || result.missing.length) throw new Error(ui.faltanArchivosPorDescargarReintentaCon);
    const cache=await caches.open(`sweet-${result.version}`);
    if(!await cache.match(new URL('./assets/mapa.jpg',location.href),{ignoreSearch:true})) throw new Error(ui.faltaUnaImagenPorDescargar);
    const response=await fetch('./assets/mapa.jpg');if(!response.ok) throw new Error(ui.noPudeComprobarUnaImagen);
    const url=URL.createObjectURL(await response.blob());
    try {const img=new Image();img.src=url;await img.decode();} finally {URL.revokeObjectURL(url);}
    report(step,true);step=ui.guardadoDelAvance;await prepTest();report(step,true);
    let persisted=false;try {persisted=await navigator.storage?.persist?.()??false;}catch {/* optional */}
    report(persisted?ui.almacenamientoPersistenteConcedido:ui.elSistemaAdministraElAlmacenamientoConserva,persisted||'info');
    const installed=matchMedia('(display-mode: standalone)').matches || navigator.standalone===true;
    report(installed?ui.abiertoDesdeElIcono:ui.abreloDesdeElIconoDeTu,installed||'info');
    step=ui.confirmacion;await write('prep',{ok:true,at:Date.now(),version:result.version});
    return {ok:true,message:ui.preparadoParaJugarSinSenal+(installed?'':ui.abreloDesdeElIconoDeTu2)};
  } catch(e) {report(step,false);return {ok:false,message:e.message||ui.noPudeCompletarLaPreparacionReintenta};}
}
