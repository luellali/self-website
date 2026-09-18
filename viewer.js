import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { nextAngle, isPaused, FACE_ANGLES, faceTransition } from './rotation.mjs';

const viewport = document.querySelector('.viewport');
const status = document.querySelector('.status');
const motionButton = document.querySelector('.motion-button');
const tabs = [...document.querySelectorAll('.tab')];
const state = { hover:false, focus:false, manual:false, reduced:false, hidden:document.hidden };
let angle=0, model, previous=performance.now(), lastStatus='';
let turn=null, selectedFace=null;
function faceTab(tab) {
  const face=tab.dataset.theme;
  if (!(face in FACE_ANGLES)) return;
  if (selectedFace===face && turn) return;
  selectedFace=face;
  turn={from:angle,to:FACE_ANGLES[face],elapsed:0};
  viewport.dataset.face=face;
  updateStatus();
}
function updateStatus() {
  if (!model) return;
  const paused = isPaused(state);
  const label = paused ? 'Paused · move off the tab to explore' : 'Slowly rotating · hover a tab to pause';
  const value = turn ? 'Turning to selected category…' : state.manual ? 'Paused · click play to rotate' : label;
  if (value !== lastStatus) { status.textContent=value; lastStatus=value; }
  viewport.dataset.rotation=turn?'turning':paused?'paused':'rotating';
}
for (const tab of tabs) {
  tab.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;state.hover=true;faceTab(tab)});
  tab.addEventListener('pointerleave',()=>{state.hover=tabs.some(t=>t.matches(':hover'));updateStatus()});
  tab.addEventListener('focus',()=>{state.focus=tab.matches(':focus-visible');if(state.focus)faceTab(tab)});
  tab.addEventListener('blur',()=>{state.focus=false;updateStatus()});
  tab.addEventListener('click',e=>{
    // Touch selection stays on its face until the user resumes or selects another tab.
    if(e.pointerType==='touch'){state.manual=true;motionButton.textContent='▶';motionButton.setAttribute('aria-label','Resume rotation');}
    faceTab(tab);
  });
}
motionButton.addEventListener('click',()=>{
  state.manual=!state.manual;
  motionButton.textContent=state.manual?'▶':'Ⅱ';
  motionButton.setAttribute('aria-label',state.manual?'Resume rotation':'Pause rotation');updateStatus();
});
document.addEventListener('visibilitychange',()=>{state.hidden=document.hidden;previous=performance.now();updateStatus()});

try {
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor(0x000000,0);
  // Standard display transform preserves the original mint, gold and navy textures.
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.LinearToneMapping;
  renderer.toneMappingExposure=0.8;
  viewport.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const pmrem=new THREE.PMREMGenerator(renderer);
  const room=new RoomEnvironment();
  const environment=pmrem.fromScene(room,0.04);
  scene.environment=environment.texture;
  scene.environmentIntensity=0.55;
  room.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff,0x8c9c91,1.35));
  const light=new THREE.DirectionalLight(0xffffff,2.2);light.position.set(2,4,3);scene.add(light);
  const fill=new THREE.DirectionalLight(0xffffff,0.7);fill.position.set(-3,2,1);scene.add(fill);
  const rim=new THREE.DirectionalLight(0xffffff,1.1);rim.position.set(0,3,-3);scene.add(rim);
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,.01,100);
  const viewDirection=new THREE.Vector3(1.35,0.42,2.2).normalize();
  camera.position.copy(viewDirection.clone().multiplyScalar(8));camera.lookAt(0,0,0);
  const pivot=new THREE.Group();scene.add(pivot);
  let modelHeight=2, horizontalRadius=1;
  const resize=()=>{
    const width=viewport.clientWidth,height=viewport.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width,height,false);
    const aspect=width/height;
    // Fit the complete rotation envelope, so the star base never clips or zooms mid-turn.
    const projectedHeight=modelHeight*Math.sqrt(1-viewDirection.y**2)+2*horizontalRadius*viewDirection.y;
    const span=Math.max(projectedHeight/0.94,2*horizontalRadius/(aspect*0.96));
    camera.top=span/2;camera.bottom=-span/2;
    camera.left=-span*aspect/2;camera.right=span*aspect/2;camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(viewport);resize();
  const dracoLoader=new DRACOLoader();
  dracoLoader.setDecoderPath('./node_modules/three/examples/jsm/libs/draco/gltf/');
  const gltfLoader=new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  const gltf=await gltfLoader.loadAsync('./for-website.glb',e=>{
    if(e.total) status.textContent=`Loading model… ${Math.round(e.loaded/e.total*100)}%`;
  });
  dracoLoader.dispose();
  model=gltf.scene;
  const bounds=new THREE.Box3().setFromObject(model);
  const center=bounds.getCenter(new THREE.Vector3());
  const size=bounds.getSize(new THREE.Vector3());
  const scale=2/Math.max(size.x,size.y,size.z);
  model.position.sub(center);pivot.add(model);pivot.scale.setScalar(scale);
  modelHeight=size.y*scale;
  horizontalRadius=0;
  const vertex=new THREE.Vector3();
  pivot.updateMatrixWorld(true);
  model.traverse(node=>{
    if (!node.isMesh) return;
    const positions=node.geometry.attributes.position;
    for(let i=0;i<positions.count;i++){
      vertex.fromBufferAttribute(positions,i).applyMatrix4(node.matrixWorld);
      horizontalRadius=Math.max(horizontalRadius,Math.hypot(vertex.x,vertex.z));
    }
  });
  if(!turn) angle=FACE_ANGLES[document.querySelector('.page').dataset.theme];
  document.querySelector('.poster').hidden=true;resize();updateStatus();
  function animate(now){
    const delta=(now-previous)/1000;previous=now;
    if(turn && !state.hidden){
      turn.elapsed+=Math.min(delta,0.05);
      const progress=state.reduced?1:turn.elapsed/0.8;
      angle=faceTransition(turn.from,turn.to,progress);
      if(progress>=1){turn=null;updateStatus();}
    }else if(!turn){angle=nextAngle(angle,delta,isPaused(state));}
    pivot.rotation.y=angle;
    renderer.render(scene,camera);requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
} catch (error) {
  console.error(error);
  document.querySelector('.error').textContent='The 3D preview could not load. Please reload in a browser with WebGL enabled.';
  status.textContent='Model preview';motionButton.disabled=true;
}
