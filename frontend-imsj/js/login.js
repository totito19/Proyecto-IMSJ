/* ARCHIVO LEGADO, NO CARGADO POR EL PANEL ACTUAL.
 *
 * frontend-imsj/index.html redirige al login público conectado con la API.
 * Este formulario simulado se conserva temporalmente junto con data.js.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const submit = document.getElementById('login-submit');
  if (!form) return;

  // Sesión nueva: se descartan los cambios de la sesión anterior.
  if (typeof Store !== 'undefined') Store.reset();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    submit.disabled = true;
    submit.textContent = 'Verificando...';

    setTimeout(() => {
      window.location.href = 'agenda.html';
    }, 900);
  });
});
