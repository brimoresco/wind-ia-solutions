// Moresco IA — interacciones del sitio (sin dependencias)
(function () {
  var WA = 'https://wa.me/5493416124787?text=';
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');

  // Borde del encabezado al hacer scroll
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Menú móvil
  if (toggle && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.sr-only').textContent = open ? 'Cerrar menú' : 'Abrir menú';
    };
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // "Qué podemos construir": al pasar por una referencia se resaltan sus capacidades
  var sentence = document.querySelector('.build-sentence');
  if (sentence) {
    document.querySelectorAll('.legend li').forEach(function (item) {
      item.tabIndex = 0;
      var area = item.dataset.area;
      var on = function () {
        sentence.classList.add('filtering'); item.classList.add('on');
        sentence.querySelectorAll('.cap').forEach(function (c) { c.classList.toggle('on', c.dataset.area === area); });
      };
      var off = function () {
        sentence.classList.remove('filtering'); item.classList.remove('on');
        sentence.querySelectorAll('.cap').forEach(function (c) { c.classList.remove('on'); });
      };
      item.addEventListener('mouseenter', on); item.addEventListener('focus', on);
      item.addEventListener('mouseleave', off); item.addEventListener('blur', off);
    });
  }

  // Portfolio: filtro por tipo de proyecto
  var filters = document.querySelectorAll('.filters button');
  if (filters.length) {
    var cards = document.querySelectorAll('.cards .card[data-cat]');
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.filter;
        filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        cards.forEach(function (c) {
          c.hidden = cat !== 'todos' && c.dataset.cat.split(' ').indexOf(cat) === -1;
        });
      });
    });
  }

  // Formulario de contacto: envío por Netlify Forms, con alternativa por WhatsApp
  var form = document.getElementById('contact-form');
  if (form) {
    var error = document.getElementById('form-error');
    var ok = document.getElementById('form-ok');
    var sendBtn = form.querySelector('button[type=submit]');
    var waBtn = document.getElementById('form-wa');

    var fail = function (input, msg) {
      error.textContent = msg; error.hidden = false;
      if (input) { input.setAttribute('aria-invalid', 'true'); input.focus(); }
    };
    var clear = function () {
      error.hidden = true;
      form.querySelectorAll('[aria-invalid]').forEach(function (i) { i.removeAttribute('aria-invalid'); });
    };
    var read = function () {
      var d = new FormData(form);
      return {
        data: d,
        nombre: (d.get('nombre') || '').trim(),
        empresa: (d.get('empresa') || '').trim(),
        email: (d.get('email') || '').trim(),
        telefono: (d.get('telefono') || '').trim(),
        servicios: d.getAll('servicio'),
        mensaje: (d.get('mensaje') || '').trim()
      };
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault(); clear();
      var v = read();
      if (!v.nombre) return fail(form.querySelector('#f-nombre'), 'Escribí tu nombre para poder enviar el mensaje.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return fail(form.querySelector('#f-email'), 'Escribí un email válido para que podamos responderte.');
      sendBtn.disabled = true;
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(v.data).toString()
      }).then(function (r) {
        if (!r.ok) throw new Error('envío');
        form.reset(); ok.hidden = false; ok.focus();
      }).catch(function () {
        fail(null, 'No pudimos enviar el formulario. Probá de nuevo o escribinos por WhatsApp con el botón de abajo.');
      }).then(function () { sendBtn.disabled = false; });
    });

    if (waBtn) {
      waBtn.addEventListener('click', function () {
        clear();
        var v = read();
        if (!v.nombre) return fail(form.querySelector('#f-nombre'), 'Escribí tu nombre para armar el mensaje de WhatsApp.');
        var texto = 'Hola Moresco IA, soy ' + v.nombre + (v.empresa ? ' de ' + v.empresa : '') + '.';
        if (v.servicios.length) texto += '\nMe interesa: ' + v.servicios.join(', ') + '.';
        if (v.mensaje) texto += '\n' + v.mensaje;
        window.open(WA + encodeURIComponent(texto), '_blank', 'noopener');
      });
    }
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
