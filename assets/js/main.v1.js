
(function(){
  'use strict';
  var burger=document.getElementById('burger'), drawer=document.getElementById('drawer'), closeBtn=document.getElementById('drawerClose');
  function lock(on){document.body.classList.toggle('is-locked',on);}
  function openD(){if(!drawer)return;drawer.dataset.open='true';burger.setAttribute('aria-expanded','true');lock(true);
    var f=drawer.querySelector('a,button');if(f)f.focus();}
  function closeD(){if(!drawer)return;drawer.dataset.open='false';burger.setAttribute('aria-expanded','false');lock(false);burger.focus();}
  if(burger&&drawer){
    burger.addEventListener('click',function(){drawer.dataset.open==='true'?closeD():openD();});
    if(closeBtn)closeBtn.addEventListener('click',closeD);
    drawer.addEventListener('click',function(e){if(e.target===drawer)closeD();});
    document.addEventListener('keydown',function(e){
      if(drawer.dataset.open!=='true')return;
      if(e.key==='Escape'){closeD();return;}
      if(e.key==='Tab'){var f=drawer.querySelectorAll('a,button');if(!f.length)return;
        var first=f[0],last=f[f.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
    });
    window.addEventListener('resize',function(){if(window.innerWidth>1180&&drawer.dataset.open==='true')closeD();});
  }
  document.querySelectorAll('.navbar__in a').forEach(function(a){
    if(a.hasAttribute('aria-current')){try{a.scrollIntoView({block:'nearest',inline:'center'});}catch(e){}}
  });

  // калькулятор нормо-часов
  var calc=document.getElementById('calc');
  if(calc){
    var range=document.getElementById('calc-range'), outHours=document.getElementById('calc-hours'),
        outSum=document.getElementById('calc-sum'), hint=document.getElementById('calc-hint'),
        packs=calc.querySelectorAll('[data-pack]'), RATE=70;
    function paint(){
      var h=parseInt(range.value,10)||1, sum=h*RATE;
      outHours.textContent=h;
      outSum.textContent=sum;
      var best=null, diff=1e9;
      packs.forEach(function(p){
        var v=parseInt(p.getAttribute('data-pack'),10), d=Math.abs(v-sum);
        if(d<diff){diff=d;best=v;}
      });
      packs.forEach(function(p){p.classList.toggle('is-near',parseInt(p.getAttribute('data-pack'),10)===best);});
      var name='';
      packs.forEach(function(p){if(parseInt(p.getAttribute('data-pack'),10)===best)name=p.getAttribute('data-name');});
      hint.textContent='Ближе всего по сумме — пакет «'+name+'» за '+best+' BYN. Если нужно меньше часов, берём разовые услуги по прайсу.';
    }
    range.addEventListener('input',paint);
    paint();
  }

  // чек-лист учёта
  var chk=document.getElementById('chk');
  if(chk){
    var boxes=chk.querySelectorAll('input[type=checkbox]'),
        score=document.getElementById('chk-score'), title=document.getElementById('chk-title'),
        text=document.getElementById('chk-text'), cta=document.getElementById('chk-cta');
    function paintChk(){
      var n=0; boxes.forEach(function(b){if(b.checked)n++;});
      score.textContent=n+' / '+boxes.length;
      var t,x;
      if(n===0){t='Учёт в порядке';x='Все базовые вещи закрыты. Если появятся новые направления или сотрудники — пересчитаем нагрузку заранее.';}
      else if(n<=2){t='Есть что подтянуть';x='Один-два пробела обычно закрываются за месяц ведения: сверка, календарь отчётности, порядок в первичке.';}
      else if(n<=4){t='Нужен порядок в учёте';x='Похоже на восстановление учёта: сначала сверяем расчёты с ИМНС и фондами, затем ставим учёт на рельсы.';}
      else {t='Срочно к бухгалтеру';x='При таком наборе рисков лучше начать с аудита документов и восстановления учёта, чтобы не получить штраф за следующий период.';}
      title.textContent=t; text.textContent=x;
      cta.textContent = n===0 ? 'Обсудить сопровождение' : 'Записаться на консультацию';
    }
    boxes.forEach(function(b){b.addEventListener('change',paintChk);});
    paintChk();
  }

  // аккордеон
  document.querySelectorAll('.acc__q').forEach(function(q){
    q.addEventListener('click',function(){
      var item=q.closest('.acc__i'), open=item.classList.contains('is-open'), grp=item.parentNode;
      grp.querySelectorAll('.acc__i').forEach(function(i){i.classList.remove('is-open');
        var b=i.querySelector('.acc__q'); if(b)b.setAttribute('aria-expanded','false');});
      if(!open){item.classList.add('is-open'); q.setAttribute('aria-expanded','true');}
    });
  });

  // форма
  var form=document.getElementById('form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var g=function(id){var el=document.getElementById(id);return el?el.value.trim():'';};
      var out=document.getElementById('formout');
      var lines=['Заявка с сайта «Бухгалтерский успех»',
        'Имя: '+(g('f-name')||'—'),
        'Телефон: '+(g('f-tel')||'—'),
        'Компания или ИП: '+(g('f-org')||'—'),
        'Что нужно: '+(g('f-what')||'—'),
        'Комментарий: '+(g('f-note')||'—')];
      var txt=lines.join(String.fromCharCode(10));
      if(out){out.textContent='Текст заявки готов — открываю почту. Его можно скопировать и отправить в мессенджер.';}
      window.location.href='mailto:'+'buhgalteru@list.ru'+'?subject='+encodeURIComponent('Заявка с сайта')+'&body='+encodeURIComponent(txt);
    });
  }
})();
