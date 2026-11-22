(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav=document.querySelector('.nav');
  var onScroll=function(){nav.classList.toggle('is-solid', window.scrollY>20)};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  var burger=document.querySelector('.burger'), drawer=document.getElementById('drawer');
  function setOpen(o){
    drawer.hidden=!o; burger.setAttribute('aria-expanded',o);
    document.body.style.overflow=o?'hidden':'';
  }
  burger.addEventListener('click',function(){setOpen(true)});
  drawer.querySelector('.drawer__close').addEventListener('click',function(){setOpen(false)});
  drawer.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setOpen(false)})});

  // Ken Burns slider
  var slides=[].slice.call(document.querySelectorAll('.slide'));
  var i=0, timer, bar=document.getElementById('slideBar');
  var num=document.getElementById('slideNum'), place=document.getElementById('slidePlace');
  function show(n){
    slides[i].classList.remove('is-on');
    i=(n+slides.length)%slides.length;
    slides[i].classList.add('is-on');
    var s=slides[i];
    num.textContent=s.getAttribute('data-n');
    place.textContent=s.getAttribute('data-place');
    if(bar){
      bar.classList.remove('run'); void bar.offsetWidth;
      if(!reduce) bar.classList.add('run');
    }
  }
  function next(){show(i+1)}
  function start(){ if(reduce) return; stop(); timer=setInterval(next,7000); if(bar){bar.classList.remove('run');void bar.offsetWidth;bar.classList.add('run')} }
  function stop(){ if(timer) clearInterval(timer) }
  document.getElementById('nextSlide').addEventListener('click',function(){next();start()});
  document.getElementById('prevSlide').addEventListener('click',function(){show(i-1);start()});
  start();

  // Quotes
  var quotes=[].slice.call(document.querySelectorAll('.quote')), qi=0;
  function qshow(n){quotes[qi].classList.remove('is-on');qi=(n+quotes.length)%quotes.length;quotes[qi].classList.add('is-on')}
  var voice=document.querySelector('[data-carousel]');
  if(voice){
    voice.querySelector('[data-next]').addEventListener('click',function(){qshow(qi+1)});
    voice.querySelector('[data-prev]').addEventListener('click',function(){qshow(qi-1)});
  }

  // Reveal
  var els=document.querySelectorAll('.reveal');
  if(!reduce && 'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})
    },{threshold:.16,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){io.observe(el)});
  } else els.forEach(function(el){el.classList.add('in')});

  var toast=document.querySelector('.toast'), tt;
  function say(m){toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},3600)}
  var form=document.getElementById('callback');
  if(form) form.addEventListener('submit',function(e){e.preventDefault();say('Demo only — on the live site this request reaches the Delhi team.')});
})();
