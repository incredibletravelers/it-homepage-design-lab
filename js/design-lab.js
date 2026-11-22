(function(){
  var KEY='it-design-lab-v1';
  var DEFAULTS={theme:'passport',font:'fraunces',btn:'pill',corners:'rounded',hero:'split',density:'comfortable'};
  var ALLOWED={
    theme:['passport','royal','emerald','maroon','midnight','teal'],
    font:['fraunces','playfair','poppins','dm'],
    btn:['pill','soft','sharp'],
    corners:['rounded','flat','glass'],
    hero:['split','centered','search'],
    density:['comfortable','compact']
  };
  var LABELS={
    theme:{passport:'Passport Navy & Saffron',royal:'Royal Blue & Gold',emerald:'Emerald & Sand',maroon:'Maroon & Cream',midnight:'Midnight Dark',teal:'Clean White & Teal'},
    font:{fraunces:'Fraunces + Inter',playfair:'Playfair Display + Poppins',poppins:'Poppins only',dm:'DM Serif Display + DM Sans'},
    btn:{pill:'Pill',soft:'Soft rounded',sharp:'Sharp'},
    corners:{rounded:'Rounded soft shadows',flat:'Flat bordered',glass:'Glass'},
    hero:{split:'Image right',centered:'Centered full-bleed image',search:'Split with search card'},
    density:{comfortable:'Comfortable',compact:'Compact'}
  };

  function valid(k,v){return ALLOWED[k] && ALLOWED[k].indexOf(v)!==-1}
  function readStore(){
    try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return {}}
  }
  function currentFromDom(){
    var c={}; Object.keys(DEFAULTS).forEach(function(k){
      var v=document.documentElement.getAttribute('data-'+k);
      c[k]=valid(k,v)?v:DEFAULTS[k];
    });
    return c;
  }
  function apply(state, pushUrl){
    Object.keys(DEFAULTS).forEach(function(k){
      var v=valid(k,state[k])?state[k]:DEFAULTS[k];
      state[k]=v;
      document.documentElement.setAttribute('data-'+k,v);
    });
    try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}
    var qs=Object.keys(DEFAULTS).map(function(k){return k+'='+encodeURIComponent(state[k])}).join('&');
    var url=location.pathname+location.hash.replace(/$/,'')+'?'+qs+location.hash;
    // keep hash after query? standard is path?query#hash
    url=location.pathname+'?'+qs+(location.hash||'');
    if(pushUrl!==false){
      try{history.replaceState(null,'',url)}catch(e){}
    }
    syncPanel(state);
    return state;
  }
  function shareUrl(state){
    var qs=Object.keys(DEFAULTS).map(function(k){return k+'='+encodeURIComponent(state[k])}).join('&');
    return location.origin+location.pathname+'?'+qs;
  }
  function summary(state){
    return [
      'Incredible Travellers — my design selection',
      'Theme: '+LABELS.theme[state.theme],
      'Font: '+LABELS.font[state.font],
      'Buttons: '+LABELS.btn[state.btn],
      'Corners: '+LABELS.corners[state.corners],
      'Hero: '+LABELS.hero[state.hero],
      'Density: '+LABELS.density[state.density],
      '',
      'Share this look:',
      shareUrl(state)
    ].join('\n');
  }

  function boot(){
    var stored=readStore();
    var q=new URLSearchParams(location.search);
    var state={};
    Object.keys(DEFAULTS).forEach(function(k){
      var fromQ=q.get(k), fromS=stored[k];
      if(valid(k,fromQ)) state[k]=fromQ;
      else if(valid(k,fromS)) state[k]=fromS;
      else state[k]=DEFAULTS[k];
    });
    apply(state, true);
  }

  function toast(msg){
    var el=document.querySelector('.toast');
    if(!el){return}
    el.textContent=msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t=setTimeout(function(){el.classList.remove('show')},3800);
  }

  function syncPanel(state){
    var root=document.getElementById('dlab-panel');
    if(!root) return;
    root.querySelectorAll('[data-opt]').forEach(function(btn){
      var k=btn.getAttribute('data-opt'), v=btn.getAttribute('data-val');
      btn.setAttribute('aria-pressed', state[k]===v ? 'true' : 'false');
    });
  }

  function setOpen(open){
    document.documentElement.classList.toggle('is-dlab-open',open);
    var t=document.querySelector('.dlab-toggle');
    var p=document.getElementById('dlab-panel');
    if(t) t.setAttribute('aria-expanded',open);
    if(p) p.setAttribute('aria-hidden',!open);
    if(open && p){
      var close=p.querySelector('.dlab__close');
      if(close) close.focus();
    } else if(t) t.focus();
  }

  function bind(){
    var toggle=document.querySelector('.dlab-toggle');
    var panel=document.getElementById('dlab-panel');
    var backdrop=document.querySelector('.dlab-backdrop');
    if(!toggle||!panel) return;
    toggle.addEventListener('click',function(){setOpen(!document.documentElement.classList.contains('is-dlab-open'))});
    panel.querySelector('.dlab__close').addEventListener('click',function(){setOpen(false)});
    if(backdrop) backdrop.addEventListener('click',function(){setOpen(false)});
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape' && document.documentElement.classList.contains('is-dlab-open')) setOpen(false);
    });
    panel.addEventListener('click',function(e){
      var btn=e.target.closest('[data-opt]');
      if(!btn) return;
      var k=btn.getAttribute('data-opt'), v=btn.getAttribute('data-val');
      if(!valid(k,v)) return;
      var state=currentFromDom();
      state[k]=v;
      apply(state,true);
    });
    panel.querySelector('.dlab__reset').addEventListener('click',function(){
      apply(Object.assign({},DEFAULTS),true);
      toast('Reset to the default look.');
    });
    panel.querySelector('.dlab__copy').addEventListener('click',function(){
      var text=summary(currentFromDom());
      function ok(){toast('Selection copied — paste it in WhatsApp to share with us.')}
      function fail(){
        window.prompt('Copy your selection:',text);
      }
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(ok).catch(fail);
      } else fail();
    });
  }

  boot();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind);
  else bind();
})();
