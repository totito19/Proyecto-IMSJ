/** Validación y avisos compartidos por el portal público y el panel IMSJ. */
(function () {
  'use strict';
  let sequence = 0;
  const errors = new Map();
  const attempted = new WeakSet();
  const controls = (form) => Array.from(form.elements).filter((field) => field.willValidate);
  const group = (field) => field.type === 'radio'
    ? controls(field.form).filter((other) => other.type === 'radio' && other.name === field.name)
    : [field];

  function message(field) {
    const value = field.value || '';
    const validity = field.validity;
    if (validity.valueMissing || (field.required && !['radio', 'checkbox', 'file', 'password'].includes(field.type) && !value.trim())) {
      return field.type === 'radio' || field.tagName === 'SELECT' ? 'Seleccioná una opción para continuar.'
        : field.type === 'checkbox' ? 'Marcá esta opción para continuar.' : 'Completá este campo para continuar.';
    }
    if (field.dataset.validate === 'name' && value && (!/^[\p{L}\p{M} .'-]+$/u.test(value.trim()) || !/\p{L}/u.test(value))) {
      return 'Ingresá un nombre con letras. Podés usar espacios, puntos, apóstrofes y guiones.';
    }
    if (validity.customError) return field.validationMessage;
    if (validity.typeMismatch) return field.type === 'email' ? 'Ingresá un correo válido, por ejemplo: nombre@correo.com.' : 'Ingresá una dirección válida.';
    if (validity.badInput) return 'Ingresá un número válido.';
    if (validity.tooShort) return `Usá al menos ${field.minLength} caracteres.`;
    if (validity.tooLong) return `Usá como máximo ${field.maxLength} caracteres.`;
    if (validity.rangeUnderflow) return `El valor mínimo permitido es ${field.min}.`;
    if (validity.rangeOverflow) return `El valor máximo permitido es ${field.max}.`;
    if (validity.stepMismatch) return 'Ingresá un valor dentro de los incrementos permitidos.';
    if (validity.patternMismatch) return field.title || 'Revisá el formato de este campo.';
    return validity.valid ? '' : 'Revisá el valor de este campo.';
  }

  function clear(field) {
    const fields = group(field);
    const node = fields.map((item) => errors.get(item)).find(Boolean);
    fields.forEach((item) => {
      item.removeAttribute('aria-invalid');
      if (node) {
        const ids = (item.getAttribute('aria-describedby') || '').split(/\s+/).filter((id) => id && id !== node.id);
        if (ids.length) item.setAttribute('aria-describedby', ids.join(' '));
        else item.removeAttribute('aria-describedby');
      }
      errors.delete(item);
    });
    node?.remove();
  }

  function show(field, text) {
    clear(field);
    if (!text) return;
    const node = document.createElement('span');
    node.id = `imsj-field-error-${++sequence}`;
    node.className = 'validation-error';
    node.textContent = text;
    group(field).forEach((item) => {
      item.setAttribute('aria-invalid', 'true');
      item.setAttribute('aria-describedby', [item.getAttribute('aria-describedby'), node.id].filter(Boolean).join(' '));
      errors.set(item, node);
    });
    const radioGroup = field.type === 'radio' && field.closest('.quiz-question, fieldset, [role="group"]');
    if (radioGroup) radioGroup.appendChild(node);
    else (field.closest('.password-wrap, .input-wrap') || field).insertAdjacentElement('afterend', node);
  }

  function validate(form) {
    attempted.add(form);
    let first = null;
    const radios = new Set();
    for (const field of controls(form)) {
      if (field.type === 'radio') {
        if (radios.has(field.name)) continue;
        radios.add(field.name);
      }
      const text = message(field);
      show(field, text);
      if (text && !first) first = field;
    }
    let summary = form.querySelector('.validation-summary');
    if (first) {
      if (!summary) {
        summary = document.createElement('p');
        summary.className = 'validation-summary';
        summary.setAttribute('role', 'alert');
        form.prepend(summary);
      }
      summary.textContent = 'Revisá los campos marcados para continuar.';
      first.focus();
      first.scrollIntoView({block: 'center', behavior: 'instant'});
    } else summary?.remove();
    return !first;
  }

  function notify(text, type = 'error') {
    document.querySelector('.app-notice')?.remove();
    const notice = document.createElement('div');
    notice.className = `app-notice${type === 'success' ? ' app-notice--success' : ''}`;
    notice.setAttribute('role', type === 'success' ? 'status' : 'alert');
    const content = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = type === 'success' ? 'Listo' : 'Revisá esta información';
    const body = document.createElement('p');
    body.textContent = text;
    content.append(title, body);
    const close = document.createElement('button');
    close.type = 'button';
    close.setAttribute('aria-label', 'Cerrar aviso');
    close.textContent = '×';
    close.addEventListener('click', () => notice.remove());
    notice.append(content, close);
    document.body.appendChild(notice);
  }

  function confirmAction(text) {
    return new Promise((resolve) => {
      const dialog = document.createElement('dialog');
      dialog.className = 'app-confirm';
      const title = document.createElement('h2');
      title.id = `imsj-confirm-${++sequence}`;
      title.textContent = 'Confirmar acción';
      const content = document.createElement('p');
      content.id = `${title.id}-message`;
      content.textContent = text;
      dialog.setAttribute('aria-labelledby', title.id);
      dialog.setAttribute('aria-describedby', content.id);
      const actions = document.createElement('div');
      actions.className = 'app-confirm__actions';
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'app-confirm__cancel';
      cancel.textContent = 'Cancelar';
      cancel.autofocus = true;
      cancel.addEventListener('click', () => dialog.close('cancel'));
      const accept = document.createElement('button');
      accept.type = 'button';
      accept.className = 'app-confirm__accept';
      accept.textContent = 'Confirmar';
      accept.addEventListener('click', () => dialog.close('confirm'));
      actions.append(cancel, accept);
      dialog.append(title, content, actions);
      dialog.addEventListener('close', () => {
        const confirmed = dialog.returnValue === 'confirm';
        dialog.remove();
        resolve(confirmed);
      }, {once: true});
      document.body.appendChild(dialog);
      dialog.showModal();
    });
  }

  function init() {
    const prepare = () => document.querySelectorAll('form').forEach((form) => { form.noValidate = true; });
    prepare();
    new MutationObserver(prepare).observe(document.body, {childList: true, subtree: true});
    document.addEventListener('submit', (event) => {
      if (event.target instanceof HTMLFormElement && !validate(event.target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    document.addEventListener('input', (event) => {
      const field = event.target;
      if (!field.form || !field.willValidate) return;
      if (errors.has(field) || attempted.has(field.form)) show(field, message(field));
      if (!controls(field.form).some((item) => message(item))) field.form.querySelector('.validation-summary')?.remove();
    });
    document.addEventListener('change', (event) => {
      const field = event.target;
      if (field.form && field.willValidate && (errors.has(field) || attempted.has(field.form))) show(field, message(field));
    });
    document.addEventListener('blur', (event) => {
      const field = event.target;
      if (field.form && field.willValidate && field.dataset.validate === 'name' && field.value) show(field, message(field));
    }, true);
    document.addEventListener('reset', (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      controls(form).forEach(clear);
      attempted.delete(form);
      form.querySelector('.validation-summary')?.remove();
    });
  }
  window.ImsjForms = {validate, notify, confirm: confirmAction};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
