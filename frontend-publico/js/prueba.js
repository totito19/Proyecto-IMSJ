let preguntasSimulacion = [];

function escQuiz(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[character]));
}

function renderSimulacion() {
    const container = document.getElementById('preguntas-prueba');
    container.innerHTML = preguntasSimulacion.map((item, index) => `
        <fieldset class="quiz-question" data-pregunta-id="${item.id}">
            <legend><span class="quiz-number">${index + 1}.</span> ${escQuiz(item.pregunta)}</legend>
            <div class="quiz-options">
                ${Object.entries(item.opciones).map(([key, option]) => `
                    <label class="quiz-answer" data-opcion="${key}">
                        <input type="radio" name="pregunta-${item.id}" value="${key}" required>
                        <span><strong>${key}.</strong> ${escQuiz(option)}</span>
                    </label>`).join('')}
            </div>
        </fieldset>`).join('');
}

async function cargarSimulacion() {
    const status = document.getElementById('prueba-status');
    const form = document.getElementById('form-prueba');
    const result = document.getElementById('prueba-resultado');
    status.hidden = false;
    status.classList.remove('is-error');
    status.textContent = 'Cargando preguntas...';
    form.hidden = true;
    result.hidden = true;

    try {
        const payload = await ImsjApi.request('/portal/prueba');
        preguntasSimulacion = Array.isArray(payload.preguntas) ? payload.preguntas : [];
        if (!preguntasSimulacion.length) {
            status.textContent = 'Todavía no hay preguntas disponibles.';
            return;
        }
        renderSimulacion();
        status.hidden = true;
        form.hidden = false;
        document.getElementById('btn-corregir').hidden = false;
        document.getElementById('btn-nueva-simulacion').hidden = true;
    } catch (error) {
        status.textContent = error.message;
        status.classList.add('is-error');
    }
}

async function corregirSimulacion(event) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;

    const respuestas = preguntasSimulacion.map((item) => ({
        pregunta_id: item.id,
        opcion: document.querySelector(`[name="pregunta-${item.id}"]:checked`).value,
    }));
    const button = document.getElementById('btn-corregir');
    button.disabled = true;

    try {
        const payload = await ImsjApi.request('/portal/prueba/corregir', {
            method: 'POST',
            body: { respuestas },
        });
        const resultados = new Map(payload.resultados.map((item) => [item.pregunta_id, item]));
        preguntasSimulacion.forEach((item) => {
            const resultado = resultados.get(item.id);
            const selected = document.querySelector(`[name="pregunta-${item.id}"]:checked`).value;
            document.querySelectorAll(`[name="pregunta-${item.id}"]`).forEach((input) => {
                input.disabled = true;
                const answer = input.closest('.quiz-answer');
                if (input.value === resultado.respuesta_correcta) answer.classList.add('is-correct');
                if (input.value === selected && !resultado.correcta) answer.classList.add('is-wrong');
            });
        });

        const result = document.getElementById('prueba-resultado');
        result.innerHTML = `<strong>${payload.correctas} de ${payload.total}</strong><p>${payload.correctas === payload.total ? '¡Excelente! Todas las respuestas son correctas.' : 'Revisá las respuestas marcadas y volvé a intentarlo.'}</p>`;
        result.hidden = false;
        button.hidden = true;
        document.getElementById('btn-nueva-simulacion').hidden = false;
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
        alert(error.message);
    } finally {
        button.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('form-prueba').addEventListener('submit', corregirSimulacion);
    document.getElementById('btn-nueva-simulacion').addEventListener('click', cargarSimulacion);
    cargarSimulacion();
});
