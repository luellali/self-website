const dialog=document.querySelector('.cover-dialog');
let opener;
for(const button of document.querySelectorAll('.course-card-button')){
  button.addEventListener('pointermove',event=>{
    const rect=button.getBoundingClientRect();
    button.style.setProperty('--pointer-x',`${event.clientX-rect.left}px`);
    button.style.setProperty('--pointer-y',`${event.clientY-rect.top}px`);
    button.style.setProperty('--tilt-x',`${((event.clientY-rect.top)/rect.height-.5)*-2.2}deg`);
    button.style.setProperty('--tilt-y',`${((event.clientX-rect.left)/rect.width-.5)*2.2}deg`);
  });
  button.addEventListener('pointerleave',()=>{button.style.removeProperty('--tilt-x');button.style.removeProperty('--tilt-y');});
  button.addEventListener('click',()=>{
    opener=button;
    const image=dialog.querySelector('.preview-art img');
    image.src=button.dataset.image;image.alt=`${button.dataset.title}项目封面`;
    dialog.querySelector('#course-preview-title').textContent=button.dataset.title;
    dialog.showModal();
  });
}
dialog.querySelector('.close-preview').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
dialog.addEventListener('close',()=>opener?.focus());
