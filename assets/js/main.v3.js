
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
      if(e.key==='Tab'){
        var f=drawer.querySelectorAll('a,button');if(!f.length)return;
        var first=f[0],last=f[f.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
    window.addEventListener('resize',function(){if(window.innerWidth>1180&&drawer.dataset.open==='true')closeD();});
  }
  document.querySelectorAll('.strip__in a').forEach(function(a){
    if(a.hasAttribute('aria-current')){try{a.scrollIntoView({block:'nearest',inline:'center'});}catch(e){}}
  });

  /* Контент не скрывается: появление блоков реализовано в CSS без вероятности «белых полос» */

  var calc=document.getElementById('calc');
  if(calc){
    var range=document.getElementById('calc-range'),
        outHours=document.getElementById('calc-hours'),
        outSum=document.getElementById('calc-sum'),
        hint=document.getElementById('calc-hint'),
        packs=calc.querySelectorAll('[data-pack]'),
        RATE=70;
    function paint(){
      var h=parseInt(range.value,10)||1, sum=h*RATE;
      outHours.textContent=h;
      outSum.textContent=sum;
      var best=null,diff=1e9,bestName='';
      packs.forEach(function(p){
        var v=parseInt(p.getAttribute('data-pack'),10),d=Math.abs(v-sum);
        if(d<diff){diff=d;best=v;bestName=p.getAttribute('data-name');}
      });
      packs.forEach(function(p){p.classList.toggle('is-near',parseInt(p.getAttribute('data-pack'),10)===best);});
      hint.textContent='Ближе всего по сумме — пакет «'+bestName+'» за '+best+' BYN в месяц. Если часов нужно меньше, берём разовые услуги по прайсу.';
    }
    range.addEventListener('input',paint);
    paint();
  }

  var chk=document.getElementById('chk');
  if(chk){
    var boxes=chk.querySelectorAll('input[type=checkbox]'),
        score=document.getElementById('chk-score'),
        title=document.getElementById('chk-title'),
        text=document.getElementById('chk-text'),
        cta=document.getElementById('chk-cta');
    function paintChk(){
      var n=0;boxes.forEach(function(b){if(b.checked)n++;});
      score.textContent=n+' / '+boxes.length;
      var t,x,c;
      if(n===0){t='Учёт в порядке';x='Базовые вещи закрыты. Если появятся новые направления или сотрудники — пересчитаем нагрузку заранее.';c='Обсудить сопровождение';}
      else if(n<=2){t='Есть что подтянуть';x='Один-два пробела обычно закрываются за месяц ведения: сверка расчётов, календарь отчётности, порядок в первичке.';c='Записаться на консультацию';}
      else if(n<=4){t='Нужен порядок в учёте';x='Похоже на восстановление учёта: сначала сверяем расчёты с ИМНС и фондами, затем ставим учёт на рельсы.';c='Обсудить восстановление';}
      else {t='Срочно к бухгалтеру';x='При таком наборе рисков начинать нужно с аудита документов и восстановления учёта, чтобы не получить штраф за следующий период.';c='Срочно на консультацию';}
      title.textContent=t;text.textContent=x;cta.textContent=c;
    }
    boxes.forEach(function(b){b.addEventListener('change',paintChk);});
    paintChk();
  }

  document.querySelectorAll('.faq__q').forEach(function(q){
    q.addEventListener('click',function(){
      var item=q.closest('.faq__i'),open=item.classList.contains('is-open'),grp=item.parentNode;
      grp.querySelectorAll('.faq__i').forEach(function(i){
        i.classList.remove('is-open');
        var b=i.querySelector('.faq__q');if(b)b.setAttribute('aria-expanded','false');
      });
      if(!open){item.classList.add('is-open');q.setAttribute('aria-expanded','true');}
    });
  });

  var form=document.getElementById('leadForm');
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
      window.location.href='mailto:buhgalteru@list.ru?subject='+encodeURIComponent('Заявка с сайта')+'&body='+encodeURIComponent(txt);
    });
  }
})();
