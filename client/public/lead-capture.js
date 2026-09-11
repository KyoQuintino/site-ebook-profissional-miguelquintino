(function () {
  'use strict';
  var WEBHOOK_URL = 'https://hook.us2.make.com/6c0sqiuihye98wiywoqp3kct277ha6j0';

  function mount() {
    if (document.getElementById('digitalquintino-lead-capture')) return true;
    var faq = document.getElementById('duvidas');
    if (!faq) return false;

    var section = document.createElement('section');
    section.id = 'digitalquintino-lead-capture';
    section.setAttribute('aria-labelledby', 'lead-capture-title');
    section.innerHTML = '<div class="lead-capture-inner"><div><p class="lead-capture-kicker">Receba novidades da coleção</p><h2 class="lead-capture-title" id="lead-capture-title">Uma leitura certa pode chegar no seu <em>momento.</em></h2><p class="lead-capture-copy">Deixe seu contato para receber novidades, lançamentos e conteúdos selecionados da DigitalQuintino.</p></div><form class="lead-capture-form" novalidate><label for="lead-name">Seu nome</label><input id="lead-name" name="name" type="text" autocomplete="name" placeholder="Como podemos chamar você?" required minlength="2"><label for="lead-email">Seu melhor e-mail</label><input id="lead-email" name="email" type="email" autocomplete="email" placeholder="voce@email.com" required><button class="lead-capture-submit" type="submit">Quero receber novidades</button><p class="lead-capture-privacy">Seus dados serão usados apenas para comunicação da DigitalQuintino.</p><p class="lead-capture-status" role="status" aria-live="polite"></p></form></div>';
    faq.parentNode.insertBefore(section, faq);

    var form = section.querySelector('form');
    var status = section.querySelector('.lead-capture-status');
    var button = section.querySelector('button');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      status.className = 'lead-capture-status';
      if (name.length < 2) { status.textContent = 'Digite seu nome para continuar.'; status.classList.add('error'); form.elements.name.focus(); return; }
      if (!/^\S+@\S+\.\S+$/.test(email)) { status.textContent = 'Digite um e-mail válido para continuar.'; status.classList.add('error'); form.elements.email.focus(); return; }
      button.disabled = true;
      button.textContent = 'Enviando…';
      var payload = { name: name, email: email, source: 'DigitalQuintino', page: window.location.href, created_at: new Date().toISOString() };
      fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(payload), mode: 'no-cors' })
        .then(function () { return true; })
        .then(function () { status.textContent = 'Pronto. Seu contato foi recebido com sucesso.'; status.classList.add('success'); form.reset(); if (window.digitalQuintinoTrack) window.digitalQuintinoTrack('lead_submit', { source: 'make_webhook' }); })
        .catch(function () { status.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.'; status.classList.add('error'); if (window.digitalQuintinoTrack) window.digitalQuintinoTrack('lead_submit_error', { source: 'make_webhook' }); })
        .finally(function () { button.disabled = false; button.textContent = 'Quero receber novidades'; });
    });
    return true;
  }

  if (!mount()) {
    var observer = new MutationObserver(function () { if (mount()) observer.disconnect(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
