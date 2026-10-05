const nav=document.getElementById('nav');
if(nav)addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40),{passive:true});
const burger=document.getElementById('burger'),menu=document.getElementById('menu');
if(burger&&menu){
burger.addEventListener('click',()=>{menu.classList.toggle('open');burger.classList.toggle('x')});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger.classList.remove('x')}));
}
document.querySelectorAll('.drop-toggle').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.has-drop');const open=item.classList.toggle('open');btn.setAttribute('aria-expanded',open)}));
// titlu hero: al 2-lea cuvant auriu (ca "victimele" pe homepage)
document.querySelectorAll('.page-hero h1, .post-hero h1').forEach(h=>{if(h.children.length)return;const p=h.textContent.trim().split(/\s+/);if(p.length<2)return;const sk=['de','pentru','si','și','in','în','la','cu','al','ale','unui','unei','o','un','a'];let i=1;if(sk.includes(p[i].toLowerCase())&&p.length>i+1)i=2;p[i]='<span class="t-gold">'+p[i]+'</span>';h.innerHTML=p.join(' ')});
// Hero deco pe mobil: centreaza vertical animatia pe titlu (robust, orice rezolutie)
function centerHeroDeco(){const mob=window.innerWidth<=680;document.querySelectorAll('.page-hero .hero-deco').forEach(d=>{if(!mob){d.style.top='';d.style.bottom='';d.style.transform='';return;}const hero=d.closest('.page-hero'),h1=hero&&hero.querySelector('h1');if(!h1)return;const hr=hero.getBoundingClientRect(),h1r=h1.getBoundingClientRect(),c=(h1r.top+h1r.bottom)/2-hr.top,dh=d.getBoundingClientRect().height;d.style.top=Math.round(c-dh/2)+'px';d.style.bottom='auto';d.style.transform='none';});}
centerHeroDeco();addEventListener('resize',centerHeroDeco);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(centerHeroDeco);
// Carduri echipa pe mobil: activeaza efectul (zoom+culoare) cand cardul e centrat la scroll
const mvObs=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting)),{rootMargin:'-34% 0px -34% 0px'});
document.querySelectorAll('.member,.elig').forEach(m=>mvObs.observe(m));
const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14});
document.querySelectorAll('.reveal, .rule').forEach(el=>io.observe(el));
// count-up
const cio=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){const el=e.target,to=+el.dataset.to,dur=1500,t0=performance.now();(function tick(now){const p=Math.min(1,(now-t0)/dur),eased=1-Math.pow(1-p,3);el.textContent=Math.round(to*eased);if(p<1)requestAnimationFrame(tick)})(t0);cio.unobserve(el)}}),{threshold:.6});
document.querySelectorAll('.count').forEach(el=>cio.observe(el));
// reviews carousel
(function(){
  const track=document.getElementById('rvTrack');if(!track)return;
  const cards=[...track.children],dotsC=document.getElementById('rvDots');
  let idx=0,timer;
  const perView=()=>innerWidth<=720?1:(innerWidth<=1000?2:3);
  const maxIdx=()=>Math.max(0,cards.length-perView());
  function go(i){idx=Math.max(0,Math.min(i,maxIdx()));const cw=cards[0].getBoundingClientRect().width;track.style.transform='translateX('+(-idx*(cw+24))+'px)';[...dotsC.children].forEach((d,j)=>d.classList.toggle('active',j===idx))}
  function dots(){dotsC.innerHTML='';for(let i=0;i<=maxIdx();i++){const d=document.createElement('button');d.className='rv-dot';d.setAttribute('aria-label','Recenzia '+(i+1));d.onclick=()=>{go(i);restart()};dotsC.appendChild(d)}go(Math.min(idx,maxIdx()))}
  function restart(){clearInterval(timer);timer=setInterval(()=>go(idx>=maxIdx()?0:idx+1),5500)}
  document.getElementById('rvPrev').onclick=()=>{go(idx-1);restart()};
  document.getElementById('rvNext').onclick=()=>{go(idx+1);restart()};
  document.querySelector('.rv-carousel').addEventListener('mouseenter',()=>clearInterval(timer));
  document.querySelector('.rv-carousel').addEventListener('mouseleave',restart);
  dots();restart();
  let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(dots,200)});
})();
// Web3Forms contact forms (progressive enhancement — ramane pe pagina)
document.querySelectorAll('form.cbox[action*="web3forms.com"]').forEach(form=>{
  form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const btn=form.querySelector('button[type=submit]'),orig=btn.innerHTML;
    btn.disabled=true;btn.textContent='Se trimite…';
    try{
      const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
      if(!res.ok)throw new Error('http');
      if(typeof gtag==='function'){gtag('event','conversion',{'send_to':'AW-1033380525/ydR9CLHCoYwCEK3F4OwD'});}
      form.innerHTML='<div class="form-ok"><b>Mulțumim!</b>Am primit solicitarea și vă sunăm în cel mai scurt timp. Pentru urgențe, sunați direct la +40 788 55 00 57.</div>';
    }catch(err){
      btn.disabled=false;btn.innerHTML=orig;
      alert('A apărut o eroare la trimitere. Vă rugăm sunați direct la +40 788 55 00 57.');
    }
  });
});
// Popup de call pe desktop (QR + WhatsApp + formular). Pe mobil/touch, tel: suna direct.
(function(){
  var modal=document.getElementById('call-modal'); if(!modal) return;
  var isDesktop=function(){ return matchMedia('(min-width:981px) and (pointer:fine)').matches; };
  function open(){ modal.hidden=false; document.body.style.overflow='hidden'; }
  function close(){ modal.hidden=true; document.body.style.overflow=''; }
  document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
    if(a.closest('#call-modal')) return;
    a.addEventListener('click',function(e){ if(isDesktop()){ e.preventDefault(); open(); } });
  });
  modal.querySelectorAll('[data-close]').forEach(function(el){ el.addEventListener('click',close); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && !modal.hidden) close(); });
})();
// Conversii Ads (secundare) + key events GA4 (suna_acum / wapp) pentru clic pe telefon / WhatsApp de pe site (24.09.2026).
// Pe desktop tel: deschide popup-ul (nu suna) -> nu numaram; pe mobil/touch numaram la clic.
(function(){
  var TEL='AW-1033380525/fDX9CPqRvIMdEK3F4OwD', WA='AW-1033380525/_dL9CJOTvIMdEK3F4OwD';
  var isDesktop=function(){ return matchMedia('(min-width:981px) and (pointer:fine)').matches; };
  function fire(label,ev){ if(typeof gtag!=='function') return; gtag('event','conversion',{'send_to':label}); gtag('event',ev,{'event_category':'contact','event_label':location.pathname}); }
  document.querySelectorAll('a[href^="tel:"]').forEach(function(a){ a.addEventListener('click',function(){ if(!isDesktop()) fire(TEL,'suna_acum'); }); });
  document.querySelectorAll('a[href*="wa.me/"],a[href*="whatsapp.com/"]').forEach(function(a){ a.addEventListener('click',function(){ fire(WA,'wapp'); }); });
})();
// Cost prima consultatie: 500 -> 100 (incetineste/pauza) -> coboara animat la 0
(function(){
  var el=document.querySelector('.cost-count'); if(!el) return;
  el.textContent='500'; // HTML-ul static spune 0 (pentru crawlere/LLM); animatia porneste de la 500
  var done=false;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting && !done){
      done=true; io.unobserve(e.target);
      var t0=performance.now(), dur=1500, from=500, to=100;
      (function tick(now){
        var p=Math.min(1,(now-t0)/dur), eased=1-Math.pow(1-p,3);
        el.textContent=Math.round(from+(to-from)*eased);
        if(p<1){ requestAnimationFrame(tick); }
        else { setTimeout(function(){
          var s0=performance.now(), d2=560, f2=100;
          (function drop(n){
            var q=Math.min(1,(n-s0)/d2), e2=1-Math.pow(1-q,3);
            el.textContent=Math.round(f2*(1-e2));
            if(q<1){ requestAnimationFrame(drop); } else { el.textContent='0'; }
          })(s0);
        }, 420); }
      })(t0);
    }
  });},{threshold:.6});
  io.observe(el);
})();
// Hero home: aprinde V + rombul mic DOAR cand masina (dash auriu) chiar trece pe langa rombul mic.
// Detectie reala de proximitate (nu sincronizare pe timp), ca sa nu se aprinda cand romburile au driftat departe.
(function(){
  if(!matchMedia('(min-width:601px) and (pointer:fine)').matches) return;
  var big=document.querySelector('.hero .shape'); var sm=document.querySelector('.hero .shape.sm');
  if(!big||!sm) return;
  var rect=big.querySelector('.shape-run rect');
  if(!rect||!rect.getTotalLength) return;
  var total=rect.getTotalLength();
  var THRESH=118;            // px: sub atat = "intersectie"
  var prev=Infinity, armed=true, last=0, lastSparkT=-9999;
  function dashPt(){
    var a=rect.getAnimations&&rect.getAnimations()[0];
    var t=a?(Number(a.currentTime)/1000)%10:0;
    var Pc=(10*t+2.25)%100;          // centrul dash-ului in unitati de pathLength
    var ctm=rect.getScreenCTM(); if(!ctm) return null;
    var p=rect.getPointAtLength(Pc/100*total).matrixTransform(ctm);
    return [p.x,p.y];
  }
  var spTimer;
  function spark(){ sm.classList.remove('spark'); void sm.offsetWidth; sm.classList.add('spark'); clearTimeout(spTimer); spTimer=setTimeout(function(){ sm.classList.remove('spark'); }, 470); }
  function loop(ts){
    if(ts-last>=32){ last=ts;
      var d=dashPt();
      if(d){
        var r=sm.getBoundingClientRect();
        var dist=Math.hypot(d[0]-(r.left+r.width/2), d[1]-(r.top+r.height/2));
        if(dist<THRESH){ if(dist>prev && armed && ts-lastSparkT>4500){ spark(); lastSparkT=ts; armed=false; } }
        else { armed=true; }
        prev=dist;
      }
    }
    requestAnimationFrame(loop);
  }
  addEventListener('resize',function(){ total=rect.getTotalLength(); });
  requestAnimationFrame(loop);
})();
