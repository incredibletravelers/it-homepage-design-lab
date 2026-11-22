(function(){
  // Sticky header shadow
  var header=document.querySelector('.header');
  var onScroll=function(){header.classList.toggle('is-scrolled',window.scrollY>10)};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // Mega menu: click/keyboard support (hover handled by CSS)
  document.querySelectorAll('.has-mega > .nav__link').forEach(function(btn){
    btn.addEventListener('click',function(){
      var li=btn.parentElement, open=!li.classList.contains('open');
      li.classList.toggle('open',open);btn.setAttribute('aria-expanded',open);
    });
  });
  document.addEventListener('click',function(e){
    document.querySelectorAll('.has-mega.open').forEach(function(li){if(!li.contains(e.target)){li.classList.remove('open');li.firstElementChild.setAttribute('aria-expanded','false')}});
  });

  // Mobile drawer
  var drawer=document.getElementById('drawer'),burger=document.querySelector('.burger');
  function setDrawer(o){drawer.classList.toggle('open',o);drawer.setAttribute('aria-hidden',!o);burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''}
  burger.addEventListener('click',function(){setDrawer(true)});
  drawer.querySelector('.drawer__close').addEventListener('click',function(){setDrawer(false)});
  drawer.addEventListener('click',function(e){if(e.target===drawer||e.target.closest('a'))setDrawer(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setDrawer(false)});

  // Toast
  var toast=document.querySelector('.toast'),tt;
  function say(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},3800)}

  // Eligibility widget (demo)
  document.getElementById('hero-form').addEventListener('submit',function(e){
    e.preventDefault();var f=e.target;
    say('Demo: this opens the Eligibility Check pre-filled with “'+f.elements['type'].value+' · '+f.elements['country'].value+'”.');
  });
  // Call-back form (demo)
  document.getElementById('callback').addEventListener('submit',function(e){
    e.preventDefault();say('Demo only: on the live site this request goes to your team and CRM.');
  });

  // Carousel
  document.querySelectorAll('[data-carousel]').forEach(function(c){
    var track=c.querySelector('.car-track');
    var step=function(){var card=track.querySelector('.review');return card?card.getBoundingClientRect().width+24:300};
    c.querySelector('.car-btn--prev').addEventListener('click',function(){track.scrollBy({left:-step()})});
    c.querySelector('.car-btn--next').addEventListener('click',function(){
      if(track.scrollLeft+track.clientWidth>=track.scrollWidth-4)track.scrollTo({left:0});else track.scrollBy({left:step()});
    });
  });

  // Only one FAQ open at a time
  var faqs=document.querySelectorAll('.faq');
  faqs.forEach(function(d){d.addEventListener('toggle',function(){if(d.open)faqs.forEach(function(o){if(o!==d)o.open=false})})});

  // Scroll reveal (subtle)
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    els.forEach(function(el,i){el.style.transitionDelay=((i%3)*80)+'ms';io.observe(el)});
  } else els.forEach(function(el){el.classList.add('in')});
})();
