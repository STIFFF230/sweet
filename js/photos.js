// Decode orientation before resizing; all temporary resources belong to this call.
export async function processPhoto(file) {
  if(!file || (file.type && !file.type.startsWith('image/')))throw new Error('Elige una imagen para tu foto.');
  let source, url;
  try {
    if(typeof createImageBitmap==='function') {
      try {source=await createImageBitmap(file,{imageOrientation:'from-image'});}catch {/* Safari fallback */}
    }
    if(!source){url=URL.createObjectURL(file);source=new Image();source.src=url;await source.decode();}
    const width=source.naturalWidth||source.width,height=source.naturalHeight||source.height;
    if(!width || !height)throw new Error('Imagen vacía');
    const scale=Math.min(1,1600/Math.max(width,height)),canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
    const context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(source,0,0,canvas.width,canvas.height);
    return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('No pude procesar tu foto. Inténtalo de nuevo.')),'image/jpeg',0.85));
  } catch {throw new Error('No pude procesar tu foto. Intenta otra foto o elige una de tu galería.');}
  finally {source?.close?.();if(url)URL.revokeObjectURL(url);}
}
// Keep the ordering explicit: a failed blob write never dispatches PHOTO.
export async function persistPhoto(index,blob,savePhoto,dispatch) {
  await savePhoto(index,blob);
  return dispatch({type:'PHOTO',index});
}
export function photoFile(blob,index) {
  return new File([blob],`sweet-regalo-${index+1}.jpg`,{type:'image/jpeg'});
}
