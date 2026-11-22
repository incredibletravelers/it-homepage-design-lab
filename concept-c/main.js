(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var burger=document.querySelector('.burger'), menu=document.getElementById('menu');
  function setMenu(o){menu.hidden=!o;burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''}
  burger.addEventListener('click',function(){setMenu(true)});
  menu.querySelector('.menu__x').addEventListener('click',function(){setMenu(false)});
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});

  var stage=document.getElementById('stage');
  var pp=stage.querySelector('.passport'), pass=stage.querySelector('.pass');
  if(!reduce && window.matchMedia('(pointer:fine)').matches){
    stage.addEventListener('mousemove',function(e){
      var r=stage.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width - .5;
      var y=(e.clientY-r.top)/r.height - .5;
      stage.classList.add('is-tilt');
      pp.style.transform='rotateY('+(18+x*16)+'deg) rotateX('+(8-y*10)+'deg) rotateZ(-8deg)';
      pass.style.transform='rotateY('+(-16+x*14)+'deg) rotateX('+(6-y*8)+'deg) rotateZ(7deg)';
    });
    stage.addEventListener('mouseleave',function(){
      stage.classList.remove('is-tilt');
      pp.style.transform=''; pass.style.transform='';
    });
  }

  var toast=document.querySelector('.toast'), tt;
  function say(m){toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},3600)}
  document.getElementById('form').addEventListener('submit',function(e){
    e.preventDefault();say('Demo only — on the live site this reaches the Delhi team.');
  });
})();
