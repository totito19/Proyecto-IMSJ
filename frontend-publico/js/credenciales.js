/** Comprobaciones locales: no consultan ni confirman la identidad de una persona. */
(function () {
  'use strict';

  function cedula(raw) {
    const value = raw.trim();
    if (!value) return { valid: false, message: 'Ingresá tu cédula.' };
    if (!/^[-0-9. ]+$/.test(value)) {
      return { valid: false, message: 'Usá solo números, puntos, espacios o guion.' };
    }
    const digits = value.replace(/\D/g, '');
    if (!/^\d{7,8}$/.test(digits)) {
      return { valid: false, message: 'Ingresá 7 u 8 dígitos.' };
    }
    // Los documentos de siete dígitos completan el cuerpo con un cero a la izquierda.
    const body = digits.slice(0, -1).padStart(7, '0');
    const weights = [2, 9, 8, 7, 6, 3, 4];
    const sum = [...body].reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
    if (/^0+$/.test(body) || (10 - (sum % 10)) % 10 !== Number(digits.at(-1))) {
      return { valid: false, message: 'La cédula no existe, revisala.' };
    }
    return { valid: true, digits, message: 'Cédula válida.' };
  }

  /** Orientación de composición, sin sustituir la autenticación ni cambiar su política. */
  function password(value) {
    return [
      { label: 'Al menos 8 caracteres', met: [...value].length >= 8 },
      { label: 'Una letra mayúscula', met: /\p{Lu}/u.test(value) },
      { label: 'Una letra minúscula', met: /\p{Ll}/u.test(value) },
      { label: 'Un número', met: /[0-9]/.test(value) },
      { label: 'Un símbolo (por ejemplo, ! o #)', met: /[^\p{L}\p{N}\s]/u.test(value) },
    ];
  }

  window.ImsjCredenciales = { cedula, password };
})();
