// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    cargarNoticias();
    cargarMateriales();
    cargarPreguntas();
    configurarFormularios();
    cargarFranjasDisponibles();
});

// Cargar noticias publicadas
async function cargarNoticias() {
    try {
        const response = await fetch(`${API_BASE_URL}/noticias/publicadas`);
        const noticias = await response.json();
        const container = document.getElementById('noticias-container');
        
        container.innerHTML = noticias.map(noticia => `
            <div class="noticia-card">
                <img src="${noticia.imagen_portada || 'placeholder.jpg'}" alt="${noticia.titulo}">
                <div class="noticia-content">
                    <h3>${noticia.titulo}</h3>
                    <p>${noticia.cuerpo.substring(0, 100)}...</p>
                    <small>${new Date(noticia.fecha_inicio_vigencia).toLocaleDateString()}</small>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error cargando noticias:', error);
        document.getElementById('noticias-container').innerHTML = '<p>Error al cargar las noticias</p>';
    }
}

// Cargar materiales de estudio
async function cargarMateriales() {
    try {
        const response = await fetch(`${API_BASE_URL}/materiales/publicados`);
        const materiales = await response.json();
        const container = document.getElementById('materiales-container');
        
        container.innerHTML = materiales.map(material => `
            <div class="material-card">
                <div class="material-content">
                    <h3>${material.titulo}</h3>
                    <p>${material.descripcion}</p>
                    ${material.enlace ? `<a href="${material.enlace}" target="_blank">Ver recurso</a>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error cargando materiales:', error);
    }
}

// Cargar preguntas frecuentes
async function cargarPreguntas() {
    try {
        const response = await fetch(`${API_BASE_URL}/preguntas-frecuentes/publicadas`);
        const preguntas = await response.json();
        const container = document.getElementById('faq-container');
        
        container.innerHTML = preguntas.map((pregunta, index) => `
            <div class="faq-item">
                <div class="faq-question" onclick="toggleFAQ(${index})">
                    <span>${pregunta.pregunta}</span>
                    <span>+</span>
                </div>
                <div class="faq-answer" id="faq-${index}">
                    <p>${pregunta.respuesta}</p>
                    ${pregunta.enlace ? `<a href="${pregunta.enlace}" target="_blank">Ver más</a>` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error cargando preguntas:', error);
    }
}

// Toggle FAQ
function toggleFAQ(index) {
    const answer = document.getElementById(`faq-${index}`);
    answer.classList.toggle('active');
}

// Cargar franjas disponibles
async function cargarFranjasDisponibles() {
    try {
        const response = await fetch(`${API_BASE_URL}/franjas/disponibles`);
        const franjas = await response.json();
        
        // Actualizar selects de fechas
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Seleccionar fecha</option>';
            franjas.forEach(franja => {
                const option = document.createElement('option');
                option.value = franja.id;
                option.textContent = new Date(franja.fecha).toLocaleDateString();
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error cargando franjas:', error);
    }
}

// Configurar formularios
function configurarFormularios() {
    document.getElementById('form-agenda-manejo').addEventListener('submit', enviarAgenda);
    document.getElementById('form-renovacion-normal').addEventListener('submit', enviarAgenda);
    document.getElementById('form-renovacion-urgente').addEventListener('submit', enviarAgenda);
}

// Enviar agenda
async function enviarAgenda(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const datos = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/agendas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        if (response.ok) {
            alert('¡Agenda creada exitosamente!');
            e.target.reset();
        } else {
            alert('Error al crear la agenda');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}
