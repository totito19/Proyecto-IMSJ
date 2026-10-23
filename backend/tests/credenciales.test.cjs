const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');

const context = { window: {} };
vm.runInNewContext(readFileSync(resolve(__dirname, '../../frontend-publico/js/credenciales.js'), 'utf8'), context);
const { cedula, password } = context.window.ImsjCredenciales;
const cases = JSON.parse(readFileSync(resolve(__dirname, 'cedula-casos.json'), 'utf8'));

test('Cédulas con y sin formato, siete dígitos y verificador cero', () => {
  for (const value of cases.valid) assert.equal(cedula(value).valid, true, value);
  assert.equal(cedula('1.234.567-2').digits, '12345672');
});

test('Rechaza verificadores incorrectos, documentos nulos, letras y longitudes inválidas', () => {
  for (const value of cases.invalid) assert.equal(cedula(value).valid, false, value);
});

test('Rechaza un incremento de uno en cada posición de una cédula válida', () => {
  // Cambiar en uno cualquier posición de esta cédula debe alterar el verificador.
  for (let index = 0; index < 8; index++) {
    const digits = [...'12345672'];
    digits[index] = String((Number(digits[index]) + 1) % 10);
    assert.equal(cedula(digits.join('')).valid, false, digits.join(''));
  }
});

test('El analizador identifica las recomendaciones que faltan', () => {
  assert.deepEqual(Array.from(password('abc'), (item) => item.met), [false, false, true, false, false]);
  assert.deepEqual(Array.from(password('Abcdef1!'), (item) => item.met), [true, true, true, true, true]);
  assert.deepEqual(Array.from(password('Árboles2!'), (item) => item.met), [true, true, true, true, true]);
  assert.equal(password('Abcdef1 ')[4].met, false, 'Un espacio no cuenta como símbolo');
  assert.ok(password('').every((item) => !item.met));
});
