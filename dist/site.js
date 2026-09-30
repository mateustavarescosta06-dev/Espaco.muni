/* MUNI — interações do site.
   Todo movimento respeita prefers-reduced-motion e o botão "Pausar animações" do rodapé.
   Nenhuma interação captura a roda do mouse ou bloqueia a rolagem. */
(()=>{
  const root=document.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
  const store={
    get(key){try{return localStorage.getItem(key);}catch{return null;}},
    set(key,value){try{localStorage.setItem(key,value);}catch{/* Armazenamento indisponível: segue sem lembrar. */}}
  };

  /* Preferência de movimento */
  const motion={
    paused:store.get('muni-motion')==='off',
    listeners:[],
    get on(){return !this.paused&&!reduce.matches;},
    toggle(){this.paused=!this.paused;store.set('muni-motion',this.paused?'off':'on');this.sync();},
    sync(){
      root.classList.toggle('no-motion',!this.on);
      document.querySelectorAll('.motion-toggle').forEach(button=>{
        button.textContent=this.paused?'Ativar animações':'Pausar animações';
        button.setAttribute('aria-pressed',String(this.paused));
      });
      this.listeners.forEach(fn=>fn(this.on));
    }
  };
  document.querySelectorAll('.motion-toggle').forEach(button=>button.addEventListener('click',()=>motion.toggle()));
  reduce.addEventListener('change',()=>motion.sync());

  /* Menu */
  const header=document.querySelector('[data-header]');
  const menuToggle=document.querySelector('.menu-toggle');
  const menu=document.querySelector('#menu');
  function setMenu(open){
    if(!menuToggle)return;
    menuToggle.setAttribute('aria-expanded',String(open));
    menu.classList.toggle('open',open);
  }
  menuToggle?.addEventListener('click',()=>setMenu(menuToggle.getAttribute('aria-expanded')!=='true'));
  menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&menuToggle?.getAttribute('aria-expanded')==='true'){setMenu(false);menuToggle.focus();}
  });

  /* Cabeçalho: compacto ao rolar, some ao descer e volta ao subir. */
  let lastY=scrollY;
  function updateHeader(){
    if(!header)return;
    const y=scrollY;
    header.classList.toggle('is-scrolled',y>12);
    const menuOpen=menuToggle?.getAttribute('aria-expanded')==='true';
    const focusInside=header.contains(document.activeElement);
    if(!menuOpen&&!focusInside&&y>420&&y>lastY+4)header.classList.add('is-hidden');
    else if(y<lastY-4||y<=420)header.classList.remove('is-hidden');
    lastY=y;
  }
  header?.addEventListener('focusin',()=>header.classList.remove('is-hidden'));

  /* Revelação suave ao entrar na tela */
  const reveals=document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-in');io.unobserve(entry.target);}
    }),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    reveals.forEach(el=>io.observe(el));
  }else reveals.forEach(el=>el.classList.add('is-in'));

  /* Manifesto: as palavras acendem com a rolagem. */
  const statements=[...document.querySelectorAll('[data-words]')].map(el=>{
    const words=[];
    const wrap=(text,accent)=>text.split(/(\s+)/).map(part=>{
      if(!part.trim())return document.createTextNode(part);
      const span=document.createElement('span');
      span.className='w'+(accent?' accent':'');span.textContent=part;words.push(span);return span;
    });
    [...el.childNodes].forEach(node=>{
      const accent=node.nodeType===1&&node.hasAttribute('data-accent');
      const text=node.textContent;
      node.replaceWith(...wrap(text,accent));
    });
    el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());
    return {el,words};
  });

  /* Como funciona: trilho de progresso */
  const process=document.querySelector('[data-process]');
  const rail=process?.querySelector('.process-rail');
  const steps=process?[...process.querySelectorAll('[data-step]')]:[];

  /* Imagens com leve parallax */
  const parallax=[...document.querySelectorAll('[data-parallax]')];

  let ticking=0;
  function onScroll(){
    ticking=0;
    updateHeader();
    const vh=innerHeight;
    statements.forEach(({el,words})=>{
      const rect=el.getBoundingClientRect();
      const p=motion.on?clamp((vh*.88-rect.top)/(rect.height+vh*.4)):1;
      const lit=Math.round(p*words.length);
      words.forEach((w,i)=>w.classList.toggle('on',i<lit));
    });
    if(process){
      const rect=process.getBoundingClientRect();
      const line=vh*.6;
      rail.style.setProperty('--progress',clamp((line-rect.top)/rect.height));
      steps.forEach(step=>step.classList.toggle('is-on',step.getBoundingClientRect().top<line));
    }
    parallax.forEach(el=>{
      if(!motion.on){el.style.removeProperty('--parallax');return;}
      const rect=el.getBoundingClientRect();
      if(rect.bottom<0||rect.top>vh)return;
      el.style.setProperty('--parallax',clamp(-rect.top/rect.height).toFixed(3));
    });
  }
  function schedule(){if(!ticking)ticking=requestAnimationFrame(onScroll);}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  motion.listeners.push(schedule);

  /* Paleta: mostra o nome e copia o código */
  document.querySelectorAll('.palette').forEach(palette=>{
    const note=palette.parentElement.querySelector('[data-palette-note]');
    const swatches=[...palette.querySelectorAll('.swatch')];
    swatches.forEach(swatch=>swatch.addEventListener('click',async()=>{
      swatches.forEach(s=>s.classList.toggle('is-active',s===swatch));
      const hex=swatch.dataset.hex,name=swatch.querySelector('span').textContent;
      let copied=false;
      try{await navigator.clipboard.writeText(hex);copied=true;}catch{/* Sem permissão de área de transferência. */}
      if(note)note.textContent=copied?`${name} · ${hex} copiado.`:`${name} · ${hex}`;
    }));
  });

  /* Galeria horizontal: arrastar com o mouse e botões */
  document.querySelectorAll('[data-drag]').forEach(rail=>{
    let startX=0,startScroll=0,dragging=false;
    rail.addEventListener('pointerdown',event=>{
      if(event.pointerType!=='mouse')return;
      dragging=true;startX=event.clientX;startScroll=rail.scrollLeft;rail.classList.add('dragging');rail.setPointerCapture(event.pointerId);
    });
    rail.addEventListener('pointermove',event=>{if(dragging)rail.scrollLeft=startScroll-(event.clientX-startX);});
    const stop=()=>{dragging=false;rail.classList.remove('dragging');};
    rail.addEventListener('pointerup',stop);rail.addEventListener('pointercancel',stop);
    rail.addEventListener('keydown',event=>{
      if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
        event.preventDefault();
        rail.scrollBy({left:(event.key==='ArrowRight'?1:-1)*rail.clientWidth*.7,behavior:motion.on?'smooth':'auto'});
      }
    });
    rail.closest('.wrap')?.querySelectorAll('[data-rail]').forEach(button=>button.addEventListener('click',()=>{
      rail.scrollBy({left:Number(button.dataset.rail)*rail.clientWidth*.7,behavior:motion.on?'smooth':'auto'});
    }));
  });

  /* Universo: galeria com troca suave */
  const gallery=[
    ['muni-digital.jpg','Identidade digital MUNI em notebook','01 / CONEXÃO'],
    ['higgsfield-objects.webp','Objetos conceituais com identidade MUNI','02 / CUIDADO'],
    ['encontro-muni-recorte.jpg','Encontro na inauguração do Espaço MUNI','03 / ENCONTROS'],
    ['ritual-muni.jpg','Caneca verde com o símbolo MUNI','04 / RITUAL']
  ];
  const galleryImage=document.querySelector('#gallery-image');
  document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{
    const [src,alt,caption]=gallery[Number(button.dataset.gallery)];
    const show=()=>{galleryImage.src='/assets/'+src;galleryImage.alt=alt;document.querySelector('#gallery-caption').textContent=caption;galleryImage.classList.remove('swap');};
    if(motion.on){galleryImage.classList.add('swap');setTimeout(show,220);}else show();
    document.querySelectorAll('[data-gallery]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  }));

  /* Contato: escolha de área e formato */
  let interest='',format='';
  const names={nutricao:'Nutrição',treinamento:'Treinamento',integrado:'Nutrição + treinamento',presencial:'presencial em Jundiaí',online:'online'};
  function updateChoice(){
    const summary=document.querySelector('#choice-summary');
    if(!summary)return;
    summary.textContent=interest&&format?`${names[interest]}, ${names[format]}.`:interest?`${names[interest]}. Agora, escolha seu formato.`:format?`Atendimento ${names[format]}. Escolha sua área.`:'Escolha sua área de interesse e seu formato.';
    document.querySelector('#choice-detail').textContent=interest&&format?'Esse é seu ponto de partida. A equipe explica os atendimentos e a disponibilidade.':'Depois, converse com a equipe pelos canais da MUNI.';
    document.querySelectorAll('[data-interest]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.interest===interest)));
    document.querySelectorAll('[data-format]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.format===format)));
  }
  document.querySelectorAll('[data-interest]').forEach(b=>b.addEventListener('click',()=>{interest=b.dataset.interest;updateChoice();}));
  document.querySelectorAll('[data-format]').forEach(b=>b.addEventListener('click',()=>{format=b.dataset.format;updateChoice();}));
  const params=new URLSearchParams(location.search);
  if(['nutricao','treinamento','integrado'].includes(params.get('interesse')))interest=params.get('interesse');
  if(['presencial','online'].includes(params.get('formato')))format=params.get('formato');
  updateChoice();

  /* Fundo vivo: a marca repetida reage ao ponteiro. */
  (()=>{
    const sections=[...document.querySelectorAll('.living-pattern')];
    if(!sections.length)return;
    let pending=0;
    const texture=new Image();texture.src='/assets/pattern-unit.png';
    const states=sections.map(section=>{
      const canvas=document.createElement('canvas');
      canvas.className='brand-canvas';canvas.setAttribute('aria-hidden','true');section.prepend(canvas);
      return {section,canvas,ctx:canvas.getContext('2d'),visible:false,width:0,height:0,x:-500,y:-500,tx:-500,ty:-500};
    });
    const draw=()=>{
      pending=0;
      if(!texture.complete||!texture.naturalWidth)return;
      const enabled=motion.on;let unsettled=false;
      states.forEach(s=>{
        if(!s.visible)return;
        const {ctx,width,height}=s;ctx.clearRect(0,0,width,height);
        s.x+=(s.tx-s.x)*.13;s.y+=(s.ty-s.y)*.13;
        unsettled||=enabled&&(Math.abs(s.tx-s.x)+Math.abs(s.ty-s.y)>.3);
        const mobile=width<600,step=mobile?125:170,size=mobile?74:100;
        const drift=enabled?Math.sin((scrollY+s.section.offsetTop)*.0014)*16:0;
        for(let row=-1;row<Math.ceil(height/step)+1;row++){
          for(let col=-1;col<Math.ceil(width/step)+1;col++){
            let x=col*step+(row%2)*step/2+drift,y=row*step+drift*.5,angle=0,near=0;
            if(enabled&&s.tx>=0){
              const dx=x-s.x,dy=y-s.y,d=Math.hypot(dx,dy);near=Math.max(0,1-d/210);
              if(d>1){x+=dx/d*near*24;y+=dy/d*near*24;}
              angle=near*.12*(dx<0?-1:1);
            }
            ctx.save();ctx.globalAlpha=.05+near*.12;ctx.translate(x,y);ctx.rotate(angle);
            ctx.drawImage(texture,-size/2,-size/2,size,size*texture.height/texture.width);ctx.restore();
          }
        }
      });
      if(unsettled)scheduleDraw();
    };
    function scheduleDraw(){if(!pending)pending=requestAnimationFrame(draw);}
    function resize(s){
      const rect=s.section.getBoundingClientRect();s.width=rect.width;s.height=rect.height;
      const dpr=Math.min(devicePixelRatio||1,1.5);
      s.canvas.width=Math.round(rect.width*dpr);s.canvas.height=Math.round(rect.height*dpr);s.ctx.setTransform(dpr,0,0,dpr,0,0);scheduleDraw();
    }
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      const s=states.find(x=>x.section===entry.target);s.visible=entry.isIntersecting;if(s.visible)resize(s);
    }),{rootMargin:'60px'});
    const resizer=new ResizeObserver(entries=>entries.forEach(entry=>{const s=states.find(x=>x.section===entry.target);if(s)resize(s);}));
    states.forEach(s=>{
      observer.observe(s.section);resizer.observe(s.section);
      s.section.addEventListener('pointermove',event=>{
        if(!motion.on)return;
        const rect=s.section.getBoundingClientRect();s.tx=event.clientX-rect.left;s.ty=event.clientY-rect.top;scheduleDraw();
      },{passive:true});
      s.section.addEventListener('pointerleave',()=>{s.tx=-500;s.ty=-500;scheduleDraw();},{passive:true});
    });
    addEventListener('scroll',()=>{if(motion.on)scheduleDraw();},{passive:true});
    texture.onload=scheduleDraw;
    motion.listeners.push(()=>{states.forEach(s=>{s.tx=s.x=-500;s.ty=s.y=-500;});scheduleDraw();});
  })();

  motion.sync();
  onScroll();
})();
