/* Filme de fundo da abertura: acompanha a rolagem normal do documento ao longo de três telas.
   Não intercepta roda nem toque; a rolagem só é lida. As caixas de texto rolam por cima do vídeo. */
(()=>{
  const section=document.querySelector('[data-film]');
  if(!section)return;
  const video=section.querySelector('video');
  const source=video.querySelector('source');
  const play=section.querySelector('.film-play');
  const scrollButton=section.querySelector('.film-scroll');
  const bar=section.querySelector('.journey-progress>span');
  const chapterEls=[...section.querySelectorAll('[data-chapter]')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
  const lerp=(a,b,t)=>a+(b-a)*t;

  /* Progresso da rolagem → tempo do filme. Cada tela alinha um capítulo:
     abertura com a corrida, "Mover" no fim da corrida, "Nutrir" com a tigela, "Integrar" com a mesa. */
  const stops=[[0,1],[1/3,3.2],[2/3,6.8],[1,12]];
  /* Tempo → centro vertical do enquadramento (fração da altura do vídeo), para seguir o assunto no desktop. */
  const framing=[[0,.3],[4,.32],[5.4,.52],[8,.5],[12,.46]];
  const chapters=[4.5,8];

  function piecewise(points,x){
    for(let i=1;i<points.length;i++){
      const [x0,y0]=points[i-1],[x1,y1]=points[i];
      if(x<=x1)return lerp(y0,y1,clamp((x-x0)/(x1-x0)));
    }
    return points[points.length-1][1];
  }
  const duration=()=>Number.isFinite(video.duration)&&video.duration>0?video.duration:12;
  const timeFor=p=>Math.min(duration()-.05,piecewise(stops,p)*duration()/12);

  let mode=reduced.matches?'paused':'scroll',loaded=false,failed=false,visible=true,frame=0,smooth=0,lastChapter=-1;

  function progress(){
    const rect=section.getBoundingClientRect();
    return clamp(-rect.top/Math.max(1,section.offsetHeight-innerHeight));
  }
  function frameTo(t){
    const w=video.clientWidth,h=video.clientHeight;
    const vw=video.videoWidth||720,vh=video.videoHeight||1280;
    const scaledH=vh*Math.max(w/vw,h/vh);
    const band=h/scaledH;
    const y=band>=.995?.5:clamp((piecewise(framing,t)-band/2)/(1-band));
    video.style.objectPosition=`50% ${(y*100).toFixed(2)}%`;
  }
  function paint(p,t){
    if(bar)bar.style.transform=`scaleY(${p.toFixed(4)})`;
    section.style.setProperty('--shade',(1-clamp(p*3)).toFixed(3));
    frameTo(t);
    const index=t<chapters[0]?0:t<chapters[1]?1:2;
    if(index!==lastChapter){
      lastChapter=index;
      chapterEls.forEach((el,i)=>el.classList.toggle('active',i===index));
    }
  }
  function seek(t){
    if(!loaded||failed||video.seeking)return;
    if(Math.abs(video.currentTime-t)>.03){try{video.currentTime=t;}catch{/* Metadados podem chegar antes do trecho buscável no celular. */}}
  }
  function tick(){
    frame=0;
    if(mode!=='scroll'||!visible)return;
    const p=progress();
    smooth+=(p-smooth)*.2;
    if(Math.abs(p-smooth)<.0008)smooth=p;
    const t=timeFor(smooth);
    paint(smooth,t);seek(t);
    if(smooth!==p)schedule();
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(tick);}
  function load(){
    if(source.src)return;
    source.src=source.dataset.src;video.load();
  }
  function syncControls(){
    play.textContent=mode==='play'?'Pausar':'Reproduzir';
    play.setAttribute('aria-label',mode==='play'?'Pausar o filme':'Reproduzir o filme sem rolar');
    scrollButton.hidden=mode==='scroll'||reduced.matches||failed;
  }

  new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(visible)schedule();
    else if(mode==='play'){video.pause();mode='paused';syncControls();}
  },{rootMargin:'200px'}).observe(section);

  video.addEventListener('loadedmetadata',()=>{loaded=true;smooth=progress();schedule();});
  video.addEventListener('seeked',()=>{if(mode==='scroll')schedule();});
  video.addEventListener('timeupdate',()=>{
    if(mode!=='play')return;
    const t=video.currentTime;
    const p=stops.findIndex(([,s])=>s*duration()/12>=t);
    paint(p<=0?0:lerp(stops[p-1][0],stops[p][0],clamp((t-stops[p-1][1])/(stops[p][1]-stops[p-1][1]))),t);
  });
  video.addEventListener('ended',()=>{mode='paused';syncControls();});
  video.addEventListener('error',()=>{
    failed=true;mode='paused';section.classList.add('film-static');play.hidden=true;scrollButton.hidden=true;
  },true);

  play.addEventListener('click',async()=>{
    if(mode==='play'){video.pause();mode='paused';syncControls();return;}
    load();mode='play';syncControls();
    if(video.ended)video.currentTime=0;
    try{await video.play();}catch{mode='paused';syncControls();}
  });
  scrollButton.addEventListener('click',()=>{video.pause();mode='scroll';smooth=progress();syncControls();schedule();});
  reduced.addEventListener('change',()=>{
    video.pause();mode=reduced.matches?'paused':'scroll';
    section.classList.toggle('film-static',reduced.matches);syncControls();schedule();
  });
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',()=>{frameTo(video.currentTime||0);schedule();},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play'){video.pause();mode='paused';syncControls();}});

  section.classList.toggle('film-static',reduced.matches);
  syncControls();
  load();
  paint(0,0);
  schedule();
})();
