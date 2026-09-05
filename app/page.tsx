'use client';
import {useEffect,useRef,useState} from 'react';
import {Camera,CameraOff,Lightbulb,RotateCcw,Star,SwitchCamera,Zap} from 'lucide-react';
import {Slider} from '@/components/ui/slider';

export default function Home(){
 const video=useRef<HTMLVideoElement>(null),stream=useRef<MediaStream|null>(null);
 const [cam,setCam]=useState(false),[facing,setFacing]=useState<'user'|'environment'>('environment'),[error,setError]=useState(''),[on,setOn]=useState(false),[power,setPower]=useState(3),[stars,setStars]=useState(0),[pos,setPos]=useState({x:0,y:0});
 useEffect(()=>()=>stream.current?.getTracks().forEach(t=>t.stop()),[]);
 async function startCamera(mode:'user'|'environment'){stream.current?.getTracks().forEach(t=>t.stop());try{setError('');let s:MediaStream;try{s=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:mode},width:{ideal:1280},height:{ideal:720}},audio:false})}catch{s=await navigator.mediaDevices.getUserMedia({video:true,audio:false})}stream.current=s;if(video.current){video.current.srcObject=s;await video.current.play()}setFacing(mode);setCam(true)}catch{setCam(false);setError('No pude abrir la cámara. Revisa el permiso del navegador.')}}
 async function openCamera(){if(stream.current){stream.current.getTracks().forEach(t=>t.stop());stream.current=null;if(video.current)video.current.srcObject=null;setCam(false);return}await startCamera(window.innerWidth<700?'environment':'user')}
 async function switchCamera(){await startCamera(facing==='environment'?'user':'environment')}
 function toggle(){setOn(v=>!v);if(!on)setStars(v=>v+1)}
 function drag(e:React.PointerEvent<HTMLDivElement>){if(e.buttons!==1)return;setPos(p=>({x:p.x+e.movementX,y:p.y+e.movementY}))}
 return <main className={`ar-page ${on?'is-on':''}`}>
  <video ref={video} muted playsInline className={`camera-feed ${cam?'show':''}`}/><div className={`camera-fallback ${cam?'hide':''}`}/>
  <header><div className="brand"><span><Zap/></span><div><h1>Electricidad mágica AR</h1><p>Juega sobre el mundo real</p></div></div><div className="score"><Star fill="currentColor"/> {stars}</div></header>
  <div className="camera-tools"><button onClick={openCamera}>{cam?<CameraOff/>:<Camera/>}{cam?'Cerrar cámara':'Abrir cámara'}</button>{cam&&<button className="switch-camera" onClick={switchCamera} aria-label="Cambiar cámara"><SwitchCamera/> Cambiar</button>}<span>{cam?(facing==='user'?'Cámara frontal o de laptop':'Cámara trasera del celular'):'Funciona en computadora y celular'}</span></div>
  <section className="ar-space" onPointerMove={drag}>
   <div className="scan-corners"/>
   <div className="ar-board-kid" style={{transform:`translate(${pos.x}px,${pos.y}px) rotateX(55deg)`}}>
    <div className="board-label">ARRASTRA PARA COLOCAR</div>
    <div className={`wire top ${on?'live':''}`}/><div className={`wire bottom ${on?'live':''}`}/>
    <button className={`battery ${on?'active':''}`} onPointerDown={e=>e.stopPropagation()} onClick={toggle}><span>+</span><Zap fill="currentColor"/><b>BATERÍA</b><small>TÓCAME</small></button>
    <div className="path-dots">{Array.from({length:7},(_,i)=><i key={i}/>)}</div>
    <button className={`bulb ${on?'glow':''}`} onPointerDown={e=>e.stopPropagation()} onClick={toggle}><span className="rays">✦</span><Lightbulb fill={on?'#ffe266':'#dfe7ff'}/><b>{on?'¡BRILLA!':'FOCO'}</b></button>
   </div>
   <div className="ar-message"><span>{on?'🎉':'👆'}</span><p><b>{on?'¡Muy bien!':'Toca la batería'}</b><br/>{on?'La energía llegó al foco.':'y mira qué sucede.'}</p></div>
  </section>
  <section className="bottom-panel"><div className="power-control"><div><b>Fuerza</b><span>{'⚡'.repeat(power)}</span></div><Slider min={1} max={5} step={1} value={[power]} onValueChange={v=>setPower(v[0])}/></div><button className={`main-action ${on?'stop':''}`} onClick={toggle}>{on?'Apagar':'Encender'}</button><button className="reset" onClick={()=>{setOn(false);setPower(3);setStars(0);setPos({x:0,y:0})}}><RotateCcw/> Reiniciar</button></section>
  {error&&<div className="error">{error}</div>}
 </main>
}
