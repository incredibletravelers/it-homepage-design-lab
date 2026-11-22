(function(){
  var burger=document.querySelector('.burger'), sheet=document.getElementById('sheet');
  function setSheet(o){sheet.hidden=!o;burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''}
  burger.addEventListener('click',function(){setSheet(true)});
  sheet.querySelector('.sheet__x').addEventListener('click',function(){setSheet(false)});
  sheet.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setSheet(false)})});

  var widget=document.getElementById('widget');
  var state={country:'',type:''};
  function panel(n){
    widget.setAttribute('data-step',n);
    widget.querySelectorAll('.panel').forEach(function(p){p.hidden=p.getAttribute('data-panel')!==String(n)});
    widget.querySelectorAll('.progress li').forEach(function(li){
      var g=+li.getAttribute('data-goto');
      li.classList.toggle('is-on',g===n);
      li.classList.toggle('is-done',g<n);
    });
  }
  widget.querySelectorAll('.progress li').forEach(function(li){
    li.addEventListener('click',function(){
      var g=+li.getAttribute('data-goto');
      if(g===1) panel(1);
      else if(g===2 && state.country) panel(2);
      else if(g===3 && state.country && state.type) panel(3);
    });
  });
  widget.querySelectorAll('[data-back]').forEach(function(b){
    b.addEventListener('click',function(){panel(Math.max(1,(+widget.getAttribute('data-step')||2)-1))});
  });
  widget.querySelector('[data-panel="1"]').addEventListener('click',function(e){
    var btn=e.target.closest('[data-country]'); if(!btn) return;
    state.country=btn.getAttribute('data-country');
    widget.querySelectorAll('[data-country]').forEach(function(c){c.classList.toggle('is-on',c===btn)});
    document.getElementById('countryLabel').textContent=state.country;
    panel(2);
  });
  widget.querySelector('[data-panel="2"]').addEventListener('click',function(e){
    var btn=e.target.closest('[data-type]'); if(!btn) return;
    state.type=btn.getAttribute('data-type');
    widget.querySelectorAll('[data-type]').forEach(function(c){c.classList.toggle('is-on',c===btn)});
    document.getElementById('summaryLine').textContent=state.type+' · '+state.country;
    panel(3);
  });

  var waToggle=document.getElementById('waToggle'), waCard=document.getElementById('waCard');
  waToggle.addEventListener('click',function(){
    var open=waCard.hidden;
    waCard.hidden=!open;
    waToggle.setAttribute('aria-expanded',open);
  });

  var toast=document.querySelector('.toast'), tt;
  function say(m){toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},3600)}
  document.getElementById('callback').addEventListener('submit',function(e){
    e.preventDefault();say('Demo only — on the live site this reaches the Delhi team.');
  });
})();
