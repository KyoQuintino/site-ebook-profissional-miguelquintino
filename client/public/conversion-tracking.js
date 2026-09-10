(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  function emit(name, payload) {
    var event = Object.assign({ event: name, page_location: window.location.href, timestamp: new Date().toISOString() }, payload || {});
    window.dataLayer.push(event);
    if (typeof window.gtag === 'function') window.gtag('event', name, event);
    if (typeof window.plausible === 'function') window.plausible(name, { props: event });
    window.dispatchEvent(new CustomEvent('digitalquintino:conversion', { detail: event }));
  }

  window.digitalQuintinoTrack = emit;

  document.addEventListener('click', function (clickEvent) {
    var link = clickEvent.target && clickEvent.target.closest ? clickEvent.target.closest('a') : null;
    if (!link) return;
    var href = link.href || '';
    var label = (link.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);
    var section = link.closest('section, footer, header');
    var sectionId = section && (section.id || section.className || 'page') || 'page';

    if (/go\.hotmart\.com/i.test(href)) {
      emit('hotmart_checkout_click', { destination: href, cta_label: label, section: sectionId });
    } else if (/wa\.me|api\.whatsapp\.com/i.test(href)) {
      emit('whatsapp_click', { destination: href, cta_label: label, section: sectionId });
    } else if (/^#/.test(link.getAttribute('href') || '')) {
      emit('cta_click', { destination: link.getAttribute('href'), cta_label: label, section: sectionId });
    }
  }, { passive: true });

  // Supports Google Tag Manager / GA4 when their snippets are added later.
  emit('page_view', { page_title: document.title });
})();
