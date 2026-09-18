const projects = [
  {id:'01',category:'interactive',label:'交互设计',fileLabel:'交互设计/界面与交互体验',title:'AI介入社交小程序体验设计',kind:'AI INVOLVEMENT IN SOCIAL MINI-PROGRAM',tag:'落地',image:'./assets/project-01-cover.png',href:'./matchus-project.html'},
  {id:'02',category:'visual',label:'视觉设计',fileLabel:'视觉设计/界面主题数字体验',title:'界面与交互体验',kind:'DIGITAL EXPERIENCE',tag:'竞赛',image:'./assets/project-02-cover.png',href:'./theme-design.html'},
  {id:'03',category:'industrial',label:'工业设计',fileLabel:'工业设计/穿戴类设备',title:'AI智能穿戴设备',kind:'ASSISTIVE WEARABLE DESIGN',tag:'竞赛',image:'./assets/project-03-cover.png',href:'./wearable-project.html'},
  {id:'04',category:'visual',label:'视觉设计',fileLabel:'视觉设计/包装设计',title:'泊罗粽包装设计展示',kind:'BRAND & PACKAGING DESIGN',tag:'课程',image:'./assets/project-04-cover.png',href:'./packaging-project.html'},
  {id:'05',category:'visual',label:'视觉设计',fileLabel:'视觉设计/地方元素重构',title:'地方元素重构设计',kind:'SONGYANG LOCAL VISUAL SYSTEM',tag:'商业',image:'./assets/project-05-cover.png',href:'./songyang-project.html'},
  {id:'06',category:'visual',label:'视觉设计',fileLabel:'视觉设计/品牌VI设计',title:'徐记点心局品牌VI设计',kind:'BRAND IDENTITY & PACKAGING',tag:'商业',image:'./assets/project-06-cover.png',href:'./brand-project.html'},
  {id:'07',category:'visual',label:'课程作业',fileLabel:'课程作业/衍生品设计',title:'乐高乐园衍生品设计',kind:'LEGOLAND DERIVATIVE DESIGN',tag:'校企合作',image:'./assets/project-07-cover.png',href:'./lego-project.html'},
  {id:'08',category:'visual',label:'品牌设计',fileLabel:'品牌设计/品牌物料',title:'蔚来实习作品集',kind:'SERVICE DESIGN',tag:'示例',image:'./assets/project-08-cover.png'},
];
const grid=document.querySelector('#projects');
const dialog=document.querySelector('.cover-dialog');
let opener;
function artwork(p){
  if(p.image){
    const art=document.createElement('div');art.className='cover-art project-image';
    const image=document.createElement('img');image.src=p.image;image.alt=`${p.title}项目封面`;
    art.append(image);return art;
  }
  const art=document.createElement('div');art.className=`cover-art ${p.art}`;
  const series=document.createElement('span');series.className='cover-series';series.textContent=`L / ${p.id} — DESIGN STUDY`;
  const word=document.createElement('span');word.className='cover-word';word.textContent=p.word;
  const mark=document.createElement('span');mark.className='cover-mark';mark.textContent=p.mark;mark.setAttribute('aria-hidden','true');
  const bottom=document.createElement('span');bottom.className='cover-bottom';bottom.textContent=p.kind;
  art.append(series,mark,word,bottom);return art;
}
for(const p of projects){
  const article=document.createElement('article');article.className='project';article.dataset.category=p.category;
  const tab=document.createElement('div');tab.className='file-tab';tab.textContent=`FILE ${p.id} / ${p.fileLabel||p.label}`;
  const button=document.createElement('button');button.type='button';button.className='cover-button';button.setAttribute('aria-label',p.href?`打开${p.title}项目`:`预览${p.title}封面`);button.append(artwork(p));
  const hint=document.createElement('span');hint.className=p.href?'project-cursor':'preview-hint';hint.textContent=p.href?'打开项目 ↗':'查看封面 ↗';button.append(hint);
  const meta=document.createElement('div');meta.className='project-meta';
  const number=document.createElement('span');number.className='project-number';number.textContent=p.id;
  const title=document.createElement('h2');title.textContent=p.title;
  const subtitle=document.createElement('p');subtitle.textContent=p.kind;
  const info=document.createElement('div');info.append(title,subtitle);
  const sample=document.createElement('span');sample.className='sample-tag';sample.textContent=p.tag||'示例';
  meta.append(number,info,sample);article.append(tab,button,meta);grid.append(article);
  if(p.href){
    button.addEventListener('pointermove',event=>{
      const rect=button.getBoundingClientRect();
      button.style.setProperty('--pointer-x',`${event.clientX-rect.left}px`);
      button.style.setProperty('--pointer-y',`${event.clientY-rect.top}px`);
      button.style.setProperty('--tilt-x',`${((event.clientY-rect.top)/rect.height-.5)*-2.2}deg`);
      button.style.setProperty('--tilt-y',`${((event.clientX-rect.left)/rect.width-.5)*2.2}deg`);
    });
    button.addEventListener('pointerleave',()=>{button.style.removeProperty('--tilt-x');button.style.removeProperty('--tilt-y');});
    button.addEventListener('click',()=>location.assign(p.href));
  }else button.addEventListener('click',()=>{opener=button;document.querySelector('.preview-art').replaceChildren(artwork(p));document.querySelector('#preview-title').textContent=p.title;dialog.showModal();});
}
for(const button of document.querySelectorAll('[data-filter]'))button.addEventListener('click',()=>{
  for(const filter of document.querySelectorAll('[data-filter]'))filter.setAttribute('aria-pressed',String(filter===button));
  let count=0;for(const item of grid.children){item.hidden=button.dataset.filter!=='all'&&item.dataset.category!==button.dataset.filter;if(!item.hidden)count++;}
  document.querySelector('.result-count').textContent=`${String(count).padStart(2,'0')} FILES`;
});
document.querySelector('.close-preview').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>opener?.focus());
