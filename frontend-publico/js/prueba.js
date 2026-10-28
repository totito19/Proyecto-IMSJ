/** Preguntas aleatorias, corrección en servidor y devolución antes de avanzar. */
let preguntasSimulacion = [];
let indicePregunta = 0;
let respuestasSimulacion = [];
let comprobandoRespuesta = false;
let versionSimulacion = 0;

function escQuiz(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) =>
    ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));
}

function renderSimulacion() {
  const item = preguntasSimulacion[indicePregunta];
  document.getElementById('form-prueba').reset();
  document.getElementById('prueba-progreso-texto').textContent = `Pregunta ${indicePregunta + 1} de ${preguntasSimulacion.length}`;
  const progress = document.getElementById('prueba-progreso');
  progress.max = preguntasSimulacion.length;
  progress.value = respuestasSimulacion.length;
  document.getElementById('preguntas-prueba').innerHTML = `
    <section class="quiz-question" role="group" aria-labelledby="pregunta-actual" data-pregunta-id="${escQuiz(item.id)}">
      <h2 class="quiz-question-title" id="pregunta-actual" tabindex="-1">${escQuiz(item.pregunta)}</h2>
      ${item.imagen ? `<img class="quiz-question-image" src="${escQuiz(item.imagen)}" alt="Material gráfico para responder la pregunta">` : ''}
      <div class="quiz-options">${Object.entries(item.opciones).map(([key, option]) => `
        <label class="quiz-answer" data-opcion="${escQuiz(key)}">
          <input type="radio" name="respuesta-actual" value="${escQuiz(key)}" required>
          <span><strong>${escQuiz(key)}.</strong> ${escQuiz(option)}</span>
        </label>`).join('')}</div>
    </section>`;
  document.getElementById('prueba-feedback').hidden = true;
  document.getElementById('btn-corregir').hidden = false;
  document.getElementById('btn-corregir').disabled = false;
  document.getElementById('btn-siguiente-pregunta').hidden = true;
}

async function cargarSimulacion() {
  const version = ++versionSimulacion;
  const status = document.getElementById('prueba-status');
  const restart = document.getElementById('btn-nueva-simulacion');
  status.hidden = false;
  status.classList.remove('is-error');
  status.textContent = 'Cargando preguntas...';
  document.getElementById('form-prueba').hidden = true;
  document.getElementById('prueba-resultado').hidden = true;
  restart.hidden = true;
  restart.disabled = true;
  preguntasSimulacion = [];
  respuestasSimulacion = [];
  indicePregunta = 0;
  comprobandoRespuesta = false;
  try {
    // El servidor mezcla el banco con ORDER BY RAND() y devuelve hasta diez preguntas sin soluciones.
    const payload = await ImsjApi.request('/portal/prueba');
    if (version !== versionSimulacion) return;
    preguntasSimulacion = Array.isArray(payload.preguntas) ? payload.preguntas : [];
    if (!preguntasSimulacion.length) throw new Error('Todavía no hay preguntas disponibles. Volvé a intentarlo más tarde.');
    renderSimulacion();
    status.hidden = true;
    document.getElementById('form-prueba').hidden = false;
  } catch (error) {
    if (version !== versionSimulacion) return;
    status.textContent = error.message;
    status.classList.add('is-error');
    restart.textContent = 'Volver a intentar';
    restart.hidden = false;
  } finally {
    if (version === versionSimulacion) restart.disabled = false;
  }
}

async function corregirSimulacion(event) {
  event.preventDefault();
  if (comprobandoRespuesta || respuestasSimulacion[indicePregunta]) return;
  if (!ImsjForms.validate(event.currentTarget)) return;
  const item = preguntasSimulacion[indicePregunta];
  const version = versionSimulacion;
  const selected = document.querySelector('[name="respuesta-actual"]:checked').value;
  const inputs = [...document.querySelectorAll('[name="respuesta-actual"]')];
  const button = document.getElementById('btn-corregir');
  comprobandoRespuesta = true;
  button.disabled = true;
  button.textContent = 'Comprobando...';
  inputs.forEach((input) => { input.disabled = true; });
  try {
    const payload = await ImsjApi.request('/portal/prueba/corregir', {
      method: 'POST', body: {respuestas: [{pregunta_id: item.id, opcion: selected}]},
    });
    if (version !== versionSimulacion) return;
    const result = payload.resultados?.find((answer) => Number(answer.pregunta_id) === Number(item.id));
    if (!result || typeof result.correcta !== 'boolean' || !Object.hasOwn(item.opciones, result.respuesta_correcta)) {
      throw new Error('No se pudo comprobar esta respuesta. Volvé a intentarlo.');
    }
    respuestasSimulacion.push(result);
    inputs.forEach((input) => {
      const answer = input.closest('.quiz-answer');
      if (input.value === result.respuesta_correcta) answer.classList.add('is-correct');
      if (input.value === selected && !result.correcta) answer.classList.add('is-wrong');
    });
    const feedback = document.getElementById('prueba-feedback');
    feedback.className = `quiz-feedback ${result.correcta ? 'quiz-feedback--correct' : 'quiz-feedback--wrong'}`;
    feedback.innerHTML = `<strong>${result.correcta ? '¡Respuesta correcta!' : 'Esta vez no fue correcta.'}</strong><p>La respuesta correcta es <strong>${escQuiz(result.respuesta_correcta)}. ${escQuiz(item.opciones[result.respuesta_correcta])}</strong>.</p>`;
    feedback.hidden = false;
    document.getElementById('prueba-progreso').value = respuestasSimulacion.length;
    button.hidden = true;
    const next = document.getElementById('btn-siguiente-pregunta');
    next.textContent = indicePregunta === preguntasSimulacion.length - 1 ? 'Ver resultado final' : 'Siguiente pregunta';
    next.hidden = false;
    feedback.focus({preventScroll: true});
    feedback.scrollIntoView({block: 'nearest', behavior: 'instant'});
  } catch (error) {
    if (version !== versionSimulacion) return;
    inputs.forEach((input) => { input.disabled = false; });
    ImsjForms.notify(error.message);
  } finally {
    if (version === versionSimulacion) {
      comprobandoRespuesta = false;
      button.disabled = false;
      button.textContent = 'Comprobar respuesta';
    }
  }
}

function siguientePregunta() {
  if (comprobandoRespuesta || !respuestasSimulacion[indicePregunta]) return;
  if (indicePregunta < preguntasSimulacion.length - 1) {
    indicePregunta++;
    renderSimulacion();
    document.getElementById('pregunta-actual').focus();
    return;
  }
  const correctas = respuestasSimulacion.filter((answer) => answer.correcta).length;
  const result = document.getElementById('prueba-resultado');
  result.innerHTML = `<strong>${correctas} de ${preguntasSimulacion.length} respuestas correctas</strong><p>${correctas === preguntasSimulacion.length ? '¡Excelente! Todas las respuestas son correctas.' : 'Seguí practicando con una nueva selección de preguntas.'}</p>`;
  result.hidden = false;
  result.tabIndex = -1;
  document.getElementById('form-prueba').hidden = true;
  const restart = document.getElementById('btn-nueva-simulacion');
  restart.textContent = 'Nueva simulación';
  restart.hidden = false;
  result.focus();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form-prueba').addEventListener('submit', corregirSimulacion);
  document.getElementById('btn-siguiente-pregunta').addEventListener('click', siguientePregunta);
  document.getElementById('btn-nueva-simulacion').addEventListener('click', cargarSimulacion);
  cargarSimulacion();
});
