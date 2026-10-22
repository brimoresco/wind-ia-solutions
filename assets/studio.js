// Moresco IA — interacciones del sitio principal (sin dependencias)
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');

  // Borde del encabezado al hacer scroll
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil
  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Cerrar menú' : 'Abrir menú';
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // "Qué podemos construir": al pasar por una referencia se resaltan sus capacidades
  var sentence = document.querySelector('.build-sentence');
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

  // Formulario: arma el mensaje y lo abre en WhatsApp
  var form = document.getElementById('contact-form');
  var error = document.getElementById('form-error');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var nombre = (d.get('nombre') || '').trim();
    var nameInput = form.querySelector('#f-nombre');
    if (!nombre) {
      error.hidden = false; nameInput.setAttribute('aria-invalid', 'true'); nameInput.focus();
      return;
    }
    error.hidden = true; nameInput.removeAttribute('aria-invalid');
    var negocio = (d.get('negocio') || '').trim();
    var servicios = d.getAll('servicio');
    var mensaje = (d.get('mensaje') || '').trim();
    var texto = 'Hola Moresco IA, soy ' + nombre + (negocio ? ' de ' + negocio : '') + '.';
    if (servicios.length) texto += '\nMe interesa: ' + servicios.join(', ') + '.';
    if (mensaje) texto += '\n' + mensaje;
    window.open('https://wa.me/5493416124787?text=' + encodeURIComponent(texto), '_blank', 'noopener');
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
