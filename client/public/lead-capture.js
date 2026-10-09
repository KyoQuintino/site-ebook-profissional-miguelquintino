(function () {
  'use strict';
  var WEBHOOK_URL = 'https://hook.us2.make.com/6c0sqiuihye98wiywoqp3kct277ha6j0';

  function mount() {
    var section = document.getElementById('digitalquintino-lead-capture');
    if (section) {
      var form = section.querySelector('form');
      if (!form || form.dataset.webhookBound === 'true') return true;

      var nameField = form.querySelector('#lead-name');
      var emailField = form.querySelector('#lead-email');
      var button = form.querySelector('button[type="submit"]');
      if (!nameField || !emailField || !button) return true;
      nameField.name = 'name';
      emailField.name = 'email';

      var status = section.querySelector('.lead-capture-status');
      if (!status) {
        status = document.createElement('span');
        status.className = 'lead-capture-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        form.appendChild(status);
      }

      var defaultButtonHtml = button.innerHTML;
      form.dataset.webhookBound = 'true';
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        var name = nameField.value.trim();
        var email = emailField.value.trim();
        status.className = 'lead-capture-status';

        if (name.length < 2) {
          status.textContent = 'Digite seu nome para continuar.';
          status.classList.add('error');
          nameField.focus();
          return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          status.textContent = 'Digite um e-mail válido para continuar.';
          status.classList.add('error');
          emailField.focus();
          return;
        }

        button.disabled = true;
        button.textContent = 'Enviando…';
        var payload = {
          name: name,
          email: email,
          source: 'DigitalQuintino',
          page: window.location.href,
          created_at: new Date().toISOString()
        };
        fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          body: JSON.stringify(payload),
          mode: 'no-cors'
        })
          .then(function () {
            // no-cors hides the response status, so this confirms an attempt, not webhook acceptance.
            status.textContent = 'Pronto. Sua solicitação foi enviada. Se não receber retorno, fale com a gente pelo WhatsApp.';
            status.classList.add('success');
            form.reset();
            if (window.digitalQuintinoTrack) {
              window.digitalQuintinoTrack('lead_submit_attempt', { source: 'make_webhook' });
            }
          })
          .catch(function () {
            status.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.';
            status.classList.add('error');
            if (window.digitalQuintinoTrack) {
              window.digitalQuintinoTrack('lead_submit_error', { source: 'make_webhook' });
            }
          })
          .finally(function () {
            button.disabled = false;
            button.innerHTML = defaultButtonHtml;
          });
      }, true);
      return true;
    }

    var faq = document.getElementById('duvidas');
    if (!faq) return false;

    var fallback = document.createElement('section');
    fallback.id = 'digitalquintino-lead-capture';
    fallback.setAttribute('aria-labelledby', 'lead-capture-title');
    fallback.innerHTML = '<div class="lead-capture-inner"><div><p class="lead-capture-kicker">Receba novidades da coleção</p><h2 class="lead-capture-title" id="lead-capture-title">Uma leitura certa pode chegar no seu <em>momento.</em></h2><p class="lead-capture-copy">Deixe seu contato para receber novidades, lançamentos e conteúdos selecionados da DigitalQuintino.</p></div><form class="lead-capture-form" novalidate><label for="lead-name">Seu nome</label><input id="lead-name" name="name" type="text" autocomplete="name" placeholder="Como podemos chamar você?" required minlength="2"><label for="lead-email">Seu melhor e-mail</label><input id="lead-email" name="email" type="email" autocomplete="email" placeholder="voce@email.com" required><button class="lead-capture-submit" type="submit">Quero receber novidades</button><p class="lead-capture-privacy">Seus dados serão usados apenas para comunicação da DigitalQuintino.</p><p class="lead-capture-status" role="status" aria-live="polite"></p></form></div>';
    faq.parentNode.insertBefore(fallback, faq);
    return mount();
  }

  if (!mount()) {
    var observer = new MutationObserver(function () { if (mount()) observer.disconnect(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
