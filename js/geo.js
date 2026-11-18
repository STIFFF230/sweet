import { ui } from './config.js';
export function haversine(a,b) {
  const rad=x=>x*Math.PI/180;
  const h=Math.sin(rad(b.lat-a.lat)/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(rad(b.lng-a.lng)/2)**2;
  return 6371000*2*Math.asin(Math.sqrt(Math.min(1,h)));
}
export function locate() {
  return new Promise((resolve,reject)=> {
    if(!navigator.geolocation) return reject(new Error(ui.noPudeConsultarTuUbicacionPidele));
    navigator.geolocation.getCurrentPosition(p=>resolve({lat:p.coords.latitude,lng:p.coords.longitude,accuracy:p.coords.accuracy}),e=>reject(new Error(({1:ui.noTengoPermisoParaConsultarTu,2:ui.noPudeEncontrarTuUbicacion,3:ui.laUbicacionTardoDemasiado}[e.code]??ui.noPudeConsultarTuUbicacion)+ui.pideleAStivenLaClave)),{enableHighAccuracy:true,timeout:20000,maximumAge:0});
  });
}
