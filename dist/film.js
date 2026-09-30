/* The film follows normal document scroll; no wheel or touch interception. */
(()=>{
  const section=document.querySelector('.scroll-film');
  if(!section)return;
  const video=section.querySelector('video');
  const play=section.querySelector('.film-play');
  const scrollButton=section.querySelector('.film-scroll');
  const hint=section.querySelector('.film-hint');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const chapters=[
    ['Encontre<br>seu <em>ritmo.</em>','O cuidado começa em você.'],
    ['Dê sabor<br>à sua <em>rotina.</em>','Nutrir também é se cuidar.'],
    ['Faça do cuidado<br>um <em>ritual.</em>','Seu corpo. Sua vida. Sua MUNI.']
  ];
  let mode=reduced.matches?'paused':'scroll',loaded=false,visible=false,frame=0,target=0,lastChapter=-1,failed=false;
  const clamp=value=>Math.max(0,Math.min(1,value));
  function progress(){const rect=section.getBoundingClientRect();return clamp(-rect.top/Math.max(1,section.offsetHeight-innerHeight));}
  function caption(value){
    const p=clamp(value),index=Math.min(2,Math.floor(p*3));
    section.querySelector('.film-progress>span').style.transform=`scaleX(${p})`;
    if(index===lastChapter)return;
    lastChapter=index;
    section.querySelector('#film-title').innerHTML=chapters[index][0];
    section.querySelector('#film-caption').textContent=chapters[index][1];
    section.querySelector('.film-counter').textContent=`0${index+1} / 03`;
    section.querySelectorAll('.film-chapters span').forEach((el,i)=>el.classList.toggle('active',i===index));
  }
  function syncControls(){
    play.textContent=mode==='play'?'Pausar filme Ⅱ':'Reproduzir ↗';
    play.setAttribute('aria-label',mode==='play'?'Pausar o filme':'Reproduzir o filme sem rolar');
    scrollButton.hidden=mode==='scroll'||reduced.matches||failed;
    hint.textContent=mode==='scroll'?'Role para dar movimento ↓':mode==='play'?'Um cuidado que se move com você.':'No seu tempo. Toque para assistir.';
  }
  function seek(){
    if(mode!=='scroll'||!loaded||video.seeking||failed||!visible)return;
    if(Number.isFinite(video.duration)&&video.duration>0&&Math.abs(video.currentTime-target)>.035){
      try{video.currentTime=target;}catch{/* Metadata may precede the seekable range on mobile. */}
    }
  }
  function update(){
    frame=0;if(mode!=='scroll'||!visible)return;
    const p=progress();caption(p);
    if(Number.isFinite(video.duration)){target=p*Math.max(0,video.duration-.05);seek();}
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update);}
  function load(){if(loaded||video.querySelector('source').src)return;video.querySelector('source').src=video.querySelector('source').dataset.src;video.load();}
  const observer=new IntersectionObserver(entries=>{
    const entry=entries[0];visible=entry.isIntersecting;
    if(visible){load();schedule();}else if(mode==='play'){video.pause();mode='paused';syncControls();}
  },{rootMargin:'250px'});observer.observe(section);
  video.addEventListener('loadedmetadata',()=>{loaded=true;schedule();});
  video.addEventListener('loadeddata',schedule);
  video.addEventListener('seeked',seek);
  video.addEventListener('timeupdate',()=>{if(mode==='play')caption(video.currentTime/video.duration);});
  video.addEventListener('ended',()=>{mode='paused';syncControls();});
  video.addEventListener('error',()=>{failed=true;mode='paused';section.classList.add('film-static');play.hidden=true;scrollButton.hidden=true;hint.textContent='Cuidar de você é um movimento.';});
  play.addEventListener('click',async()=>{
    if(mode==='play'){video.pause();mode='paused';syncControls();return;}
    load();mode='play';syncControls();
    if(video.ended)video.currentTime=0;
    try{await video.play();}catch{mode='paused';syncControls();hint.textContent='Toque em reproduzir para iniciar o filme.';}
  });
  scrollButton.addEventListener('click',()=>{video.pause();mode='scroll';syncControls();schedule();});
  reduced.addEventListener('change',()=>{
    video.pause();mode=reduced.matches?'paused':'scroll';
    section.classList.toggle('film-static',reduced.matches);syncControls();schedule();
  });
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play'){video.pause();mode='paused';syncControls();}});
  section.classList.toggle('film-static',reduced.matches);syncControls();caption(0);
})();
