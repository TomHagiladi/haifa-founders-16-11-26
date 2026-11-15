/* Practice guide - shared script for the English, Hebrew and Arabic pages.
   Adds "Copy" and "Back to the original" under every prompt box, in the page's language. */
(function () {
  var T = {
    en: { copy: 'Copy', copyAria: 'Copy the text in this box', reset: 'Back to the original', done: 'Copied - now paste it into the chat' },
    he: { copy: 'העתקה', copyAria: 'העתקת הטקסט שבתיבה', reset: 'חזרה לנוסח המקורי', done: 'הועתק - עכשיו הדביקו בצ׳אט' },
    ar: { copy: 'نسخ', copyAria: 'نسخ النص في هذا المربع', reset: 'العودة إلى النص الأصلي', done: 'تم النسخ - الصقوه الآن في المحادثة' }
  };
  var t = T[(document.documentElement.lang || 'en').slice(0, 2)] || T.en;

  function fit(ta) { if (!ta.offsetParent) return; ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight + 6) + 'px'; }

  document.querySelectorAll('textarea.prompt').forEach(function (ta) {
    ta.dataset.orig = ta.value;
    var box = document.createElement('div');
    box.className = 'btns';
    var copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = t.copy;
    copy.setAttribute('aria-label', t.copyAria);
    var ok = document.createElement('span');
    ok.className = 'ok';
    ok.setAttribute('role', 'status');
    copy.addEventListener('click', function () {
      var done = function () { ok.textContent = t.done; setTimeout(function () { ok.textContent = ''; }, 2600); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(ta.value).then(done, function () { ta.select(); document.execCommand('copy'); done(); });
      } else { ta.select(); document.execCommand('copy'); done(); }
    });
    box.appendChild(copy);
    var reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'sec';
    reset.textContent = t.reset;
    reset.addEventListener('click', function () { ta.value = ta.dataset.orig; fit(ta); });
    box.appendChild(reset);
    box.appendChild(ok);
    ta.parentNode.appendChild(box);
    fit(ta);
    ta.addEventListener('input', function () { fit(ta); });
  });
  addEventListener('load', function () { document.querySelectorAll('textarea.prompt').forEach(fit); });
  document.querySelectorAll('details.fw').forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) d.querySelectorAll('textarea.prompt').forEach(fit); });
  });

  // Language switch keeps your place: the same section opens in the other language.
  document.querySelectorAll('nav.langbar a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (location.hash) a.setAttribute('href', a.getAttribute('href').split('#')[0] + location.hash);
    });
  });
})();
