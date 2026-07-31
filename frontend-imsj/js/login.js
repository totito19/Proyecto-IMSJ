/* ═══════════════════════════════════════════════════════════════════════════
   login.js — pantalla de ingreso.
   Sin backend: valida el formulario, muestra el estado "Verificando..."
   (900 ms, igual que el prototipo) y redirige a la agenda.
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('login-form');
  const submit = document.getElementById('login-submit');
  if (!form) return;

  // Sesión nueva: se descartan los cambios de la sesión anterior.
  if (typeof Store !== 'undefined') Store.reset();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    submit.disabled = true;
    submit.textContent = 'Verificando...';

    setTimeout(() => { window.location.href = 'agenda.html'; }, 900);
  });
});
