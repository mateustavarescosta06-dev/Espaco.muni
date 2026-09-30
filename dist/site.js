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
      document.dispatchEvent(new CustomEvent('muni:motion',{detail:{on:this.on}}));
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

  /* Como funciona: traço ondulado, etapa em foco e contador */
  const process=document.querySelector('[data-process]');
  const steps=process?[...process.querySelectorAll('[data-step]')]:[];
  const counter=document.querySelector('[data-count]');
  let currentStep=-1;

  /* Imagens com leve parallax */
  const parallax=[...document.querySelectorAll('[data-parallax]')];

  let ticking=0;
  function onScroll(){
    ticking=0;
    updateHeader();
    const vh=innerHeight;
    if(process){
      const rect=process.getBoundingClientRect();
      const line=vh*.6;
      process.style.setProperty('--progress',clamp((line-rect.top)/rect.height).toFixed(4));
      let current=0;
      steps.forEach((step,i)=>{const on=step.getBoundingClientRect().top<line;step.classList.toggle('is-on',on);if(on)current=i;});
      steps.forEach((step,i)=>step.classList.toggle('is-current',i===current));
      if(counter&&current!==currentStep){
        currentStep=current;counter.textContent=String(current+1).padStart(2,'0');
        const box=counter.parentElement;box.classList.remove('bump');void box.offsetWidth;box.classList.add('bump');
      }
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
    ['equipe-muni.jpg','Bia e Bruno em frente à parede com a marca MUNI','03 / ENCONTROS'],
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

  /* Lanterna: o cursor acende o padrão no fundo; no toque, a luz passeia sozinha. */
  const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('[data-spotlight]').forEach(section=>{
    let visible=false,raf=0,start=0;
    const set=(x,y)=>{section.style.setProperty('--mx',`${x}px`);section.style.setProperty('--my',`${y}px`);};
    section.addEventListener('pointermove',event=>{
      if(!finePointer.matches||!motion.on)return;
      const rect=section.getBoundingClientRect();
      set(event.clientX-rect.left,event.clientY-rect.top);section.classList.add('is-lit');
    },{passive:true});
    section.addEventListener('pointerleave',()=>{if(finePointer.matches)section.classList.remove('is-lit');},{passive:true});
    const wander=time=>{
      raf=0;
      if(!visible||finePointer.matches||!motion.on){section.classList.remove('is-lit');return;}
      if(!start)start=time;
      const t=(time-start)/1000,w=section.clientWidth,h=section.clientHeight;
      set(w*(.5+.38*Math.sin(t*.35)),h*(.5+.36*Math.sin(t*.5+1.2)));
      section.classList.add('is-lit');
      raf=requestAnimationFrame(wander);
    };
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(wander);}).observe(section);
    motion.listeners.push(on=>{if(!on)section.classList.remove('is-lit');else if(visible&&!raf)raf=requestAnimationFrame(wander);});
  });

  /* O M se formando: o símbolo MUNI é desenhado num traço contínuo, como uma caneta. */
  document.querySelectorAll('[data-mform]').forEach(svg=>{
    let played=false;
    const play=()=>{
      svg.classList.remove('is-drawn','is-drawing');
      if(!motion.on){svg.classList.add('is-drawn');return;}
      void svg.getBoundingClientRect();
      svg.classList.add('is-drawing');
    };
    svg.classList.add('is-ready');
    new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!played){played=true;play();}},{threshold:.5}).observe(svg);
    svg.addEventListener('click',play);
    motion.listeners.push(on=>{if(!on){svg.classList.remove('is-drawing');svg.classList.add('is-drawn');}});
  });

  /* Emagrecer com saúde: no celular, um lado por vez */
  document.querySelectorAll('[data-truth-switch]').forEach(box=>{
    const tabs=[...box.querySelectorAll('[role=tab]')];
    const select=tab=>{
      tabs.forEach(t=>{const on=t===tab;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;});
      box.dataset.active=tab.dataset.truth;
      box.querySelectorAll('[data-panel]').forEach(panel=>panel.classList.add('is-in'));
    };
    tabs.forEach((tab,i)=>{
      tab.addEventListener('click',()=>select(tab));
      tab.addEventListener('keydown',event=>{
        if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;
        event.preventDefault();const next=tabs[(i+1)%tabs.length];select(next);next.focus();
      });
    });
  });

  /* Abas genéricas (situações da nutrição + treino) */
  document.querySelectorAll('[data-tabs]').forEach(box=>{
    const tabs=[...box.querySelectorAll('[role=tab]')];
    const select=tab=>tabs.forEach(t=>{const on=t===tab;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!on;});
    tabs.forEach((tab,i)=>{
      tab.addEventListener('click',()=>select(tab));
      tab.addEventListener('keydown',event=>{
        if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;
        event.preventDefault();const next=tabs[(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];select(next);next.focus();
      });
    });
  });

  /* Formatos: seletor presencial/online */
  document.querySelectorAll('[data-format-switch]').forEach(box=>{
    const tabs=[...box.querySelectorAll('[role=tab]')];
    const select=tab=>{
      tabs.forEach(t=>{const on=t===tab;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!on;});
      box.dataset.active=tab.dataset.fmt;
    };
    tabs.forEach((tab,i)=>{
      tab.addEventListener('click',()=>select(tab));
      tab.addEventListener('keydown',event=>{
        if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;
        event.preventDefault();const next=tabs[(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];select(next);next.focus();
      });
    });
    const initial=new URLSearchParams(location.search).get('formato');
    const match=tabs.find(t=>t.dataset.fmt===initial);if(match)select(match);
  });

  /* Caminhos: no desktop, a foto do caminho acompanha o cursor sobre a lista. */
  document.querySelectorAll('[data-paths]').forEach(list=>{
    const float=list.querySelector('.path-float');
    const img=float?.querySelector('img');
    if(!float||!img)return;
    const fine=matchMedia('(hover: hover) and (pointer: fine)');
    let x=0,y=0,cx=0,cy=0,raf=0;
    const follow=()=>{
      cx+=(x-cx)*.16;cy+=(y-cy)*.16;
      float.style.transform=`translate(${cx+36}px,${cy}px) translateY(-50%) rotate(${((x-cx)*.04).toFixed(2)}deg)`;
      raf=Math.abs(x-cx)+Math.abs(y-cy)>.5?requestAnimationFrame(follow):0;
    };
    list.querySelectorAll('.path-row').forEach(row=>{
      row.addEventListener('pointerenter',()=>{
        if(!fine.matches)return;
        img.src=row.dataset.img;img.alt='';
        list.classList.add('is-hovering');
      });
    });
    list.addEventListener('pointermove',event=>{
      if(!fine.matches)return;
      const rect=list.getBoundingClientRect();
      x=event.clientX-rect.left;y=event.clientY-rect.top;
      if(!motion.on){cx=x;cy=y;}
      if(!raf)raf=requestAnimationFrame(follow);
    },{passive:true});
    list.addEventListener('pointerleave',()=>list.classList.remove('is-hovering'));
  });

  motion.sync();
  onScroll();
})();
