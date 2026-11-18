import { ui } from './config.js';
let database;
function open() {
  if(database) return database;
  database=new Promise((resolve,reject)=> {
    const r=indexedDB.open('sweet-aventura',2);
    r.onupgradeneeded=()=>{for(const name of ['kv','photos'])if(!r.result.objectStoreNames.contains(name))r.result.createObjectStore(name);};
    r.onsuccess=()=>{r.result.onversionchange=()=>{r.result.close();database=null;};resolve(r.result);};
    r.onerror=()=>{database=null;reject(new Error(ui.noPudeAbrirElAlmacenamiento));};
    r.onblocked=()=>{database=null;reject(new Error(ui.cierraLasOtrasVentanasDeLa));};
  });return database;
}
export async function read(key) {
  const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('kv','readonly');const r=tx.objectStore('kv').get(key);tx.oncomplete=()=>resolve(r.result);tx.onerror=tx.onabort=()=>reject(new Error(ui.noPudeLeerElAvanceGuardado));});
}
export async function write(key,value) {
  const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('kv','readwrite');tx.objectStore('kv').put(value,key);tx.oncomplete=()=>resolve();tx.onerror=tx.onabort=()=>reject(new Error(ui.noPudeGuardarTuAvanceIntentalo));});
}
export const loadState=()=>read('game');
export const saveState=s=>write('game',s);
export async function prepTest() {const value=`${Date.now()}-${Math.random()}`;await write('prep-test',value);if(await read('prep-test')!==value) throw new Error(ui.noPudeComprobarElGuardado);}

async function photoTransaction(mode, operation) {
  const db=await open();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('photos',mode),request=operation(tx.objectStore('photos'));
    tx.oncomplete=()=>resolve(request.result);
    tx.onerror=tx.onabort=()=>reject(new Error('No pude guardar o leer tu foto. Inténtalo de nuevo.'));
  });
}
export const savePhoto=(index,blob)=>photoTransaction('readwrite',store=>store.put(blob,index));
export const getPhoto=index=>photoTransaction('readonly',store=>store.get(index));
// When resetting, commit the new game and deletion together: neither can win alone.
export async function clearPhotos(resetState) {
  if(resetState===undefined)return photoTransaction('readwrite',store=>store.clear());
  const db=await open();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(['kv','photos'],'readwrite');
    tx.objectStore('photos').clear();tx.objectStore('kv').put(resetState,'game');
    tx.oncomplete=()=>resolve();
    tx.onerror=tx.onabort=()=>reject(new Error(ui.noPudeGuardarTuAvanceIntentalo));
  });
}
