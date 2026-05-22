// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    verificarAutenticacion();
    
    // Cargar datos iniciales
    cargarDashboard();
    cargarNoticias();
    cargarAgendas();
    cargarFranjas();
    cargarMateriales();
    cargarPreguntas();
    
    // Event listeners para navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', manejarNavegacion);
    });
    
    // Event listeners para formularios
    document.getElementById('form-noticia')?.addEventListener('submit', guardarNoticia);
    document.getElementById('form-franja')?.addEventListener('submit', guardarFranja);
    document.getElementById('form-material')?.addEventListener('submit', guardarMaterial);
    document.getElementById('form-pregunta')?.addEventListener('submit', guardarPregunta);
    
    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', logout);
});

// Verificar autenticación
async function verificarAutenticacion() {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const usuario = await response.json();
            document.getElementById('user-name').textContent = usuario.nombre;
        } else {
            logout();
        }
    } catch (error) {
        console.error('Error verificando autenticación:', error);
    }
}

// Manejar navegación
function manejarNavegacion(e) {
    e.preventDefault();
    
    // Remover clase active de todas las secciones
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Remover clase active de todos los links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Agregar clase active al link clickeado
    e.target.classList.add('active');
    
    // Mostrar sección correspondiente
    const target = e.target.getAttribute('href').substring(1);
    const section = document.getElementById(target);
    if (section) {
        section.classList.add('active');
    }
}

// Dashboard
async function cargarDashboard() {
    try {
        const token = localStorage.getItem('auth_token');
        
        // Cargar estadísticas
        const response = await fetch(`${API_BASE_URL}/agendas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const agendas = await response.json();
            document.getElementById('agendas-pendientes').textContent = agendas.length;
        }
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
}

// Noticias
function mostrarFormularioNoticia() {
    document.getElementById('form-noticia').style.display = 'flex';
}

function ocultarFormularioNoticia() {
    document.getElementById('form-noticia').style.display = 'none';
}

async function cargarNoticias() {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/noticias`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const noticias = await response.json();
            const container = document.getElementById('noticias-list');
            
            container.innerHTML = noticias.map(noticia => `
                <div class="list-item">
                    <div class="list-item-content">
                        <h4>${noticia.titulo}</h4>
                        <p>${noticia.estado === 'publicada' ? '✓ Publicada' : '◯ No publicada'}</p>
                        <small>${new Date(noticia.fecha_inicio_vigencia).toLocaleDateString()}</small>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn-edit" onclick="editarNoticia(${noticia.id})">Editar</button>
                        <button class="btn-delete" onclick="eliminarNoticia(${noticia.id})">Eliminar</button>
                    </div>
                </div>
            `).join('');
            
            document.getElementById('noticias-publicadas').textContent = 
                noticias.filter(n => n.estado === 'publicada').length;
        }
    } catch (error) {
        console.error('Error cargando noticias:', error);
    }
}

async function guardarNoticia(e) {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch(`${API_BASE_URL}/noticias`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (response.ok) {
            alert('Noticia guardada exitosamente');
            ocultarFormularioNoticia();
            e.target.reset();
            cargarNoticias();
        }
    } catch (error) {
        console.error('Error guardando noticia:', error);
    }
}

// Agendas
async function cargarAgendas() {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/agendas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const agendas = await response.json();
            const container = document.getElementById('agenda-list');
            
            container.innerHTML = agendas.map(agenda => `
                <div class="list-item">
                    <div class="list-item-content">
                        <h4>${agenda.ciudadano_nombre}</h4>
                        <p>Tipo: ${agenda.tipo_tramite} | Estado: ${agenda.estado}</p>
                        <small>${agenda.ciudadano_email} | ${agenda.ciudadano_telefono}</small>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn-edit" onclick="confirmarAgenda(${agenda.id})">Confirmar</button>
                        <button class="btn-delete" onclick="cancelarAgenda(${agenda.id})">Cancelar</button>
                    </div>
                </div>
            `).join('');
            
            document.getElementById('agendas-pendientes').textContent = 
                agendas.filter(a => a.estado === 'pendiente').length;
        }
    } catch (error) {
        console.error('Error cargando agendas:', error);
    }
}

// Franjas
function mostrarFormularioFranja() {
    document.getElementById('form-franja').style.display = 'flex';
}

function ocultarFormularioFranja() {
    document.getElementById('form-franja').style.display = 'none';
}

async function cargarFranjas() {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/franjas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const franjas = await response.json();
            const container = document.getElementById('franjas-list');
            
            container.innerHTML = franjas.map(franja => `
                <div class="list-item">
                    <div class="list-item-content">
                        <h4>${franja.tipo_tramite}</h4>
                        <p>${new Date(franja.fecha).toLocaleDateString()} | ${franja.hora_inicio} - ${franja.hora_fin}</p>
                        <small>Cupos disponibles: ${franja.cupos}</small>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn-delete" onclick="eliminarFranja(${franja.id})">Eliminar</button>
                    </div>
                </div>
            `).join('');
            
            document.getElementById('franjas-disponibles').textContent = franjas.length;
        }
    } catch (error) {
        console.error('Error cargando franjas:', error);
    }
}

async function guardarFranja(e) {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    const formData = new FormData(e.target);
    const datos = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/franjas`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        if (response.ok) {
            alert('Franja guardada exitosamente');
            ocultarFormularioFranja();
            e.target.reset();
            cargarFranjas();
        }
    } catch (error) {
        console.error('Error guardando franja:', error);
    }
}

// Materiales
function mostrarFormularioMaterial() {
    document.getElementById('form-material').style.display = 'flex';
}

function ocultarFormularioMaterial() {
    document.getElementById('form-material').style.display = 'none';
}

async function cargarMateriales() {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/materiales`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const materiales = await response.json();
            const container = document.getElementById('materiales-list');
            
            container.innerHTML = materiales.map(material => `
                <div class="list-item">
                    <div class="list-item-content">
                        <h4>${material.titulo}</h4>
                        <p>${material.estado === 'publicado' ? '✓ Publicado' : '◯ No publicado'}</p>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn-delete" onclick="eliminarMaterial(${material.id})">Eliminar</button>
                    </div>
                </div>
            `).join('');
            
            document.getElementById('materiales-publicados').textContent = 
                materiales.filter(m => m.estado === 'publicado').length;
        }
    } catch (error) {
        console.error('Error cargando materiales:', error);
    }
}

async function guardarMaterial(e) {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch(`${API_BASE_URL}/materiales`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (response.ok) {
            alert('Material guardado exitosamente');
            ocultarFormularioMaterial();
            e.target.reset();
            cargarMateriales();
        }
    } catch (error) {
        console.error('Error guardando material:', error);
    }
}

// Preguntas Frecuentes
function mostrarFormularioPregunta() {
    document.getElementById('form-pregunta').style.display = 'flex';
}

function ocultarFormularioPregunta() {
    document.getElementById('form-pregunta').style.display = 'none';
}

async function cargarPreguntas() {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/preguntas-frecuentes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const preguntas = await response.json();
            const container = document.getElementById('preguntas-list');
            
            container.innerHTML = preguntas.map(pregunta => `
                <div class="list-item">
                    <div class="list-item-content">
                        <h4>${pregunta.pregunta}</h4>
                        <p>${pregunta.estado === 'visible' ? '✓ Visible' : '◯ Oculta'}</p>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn-delete" onclick="eliminarPregunta(${pregunta.id})">Eliminar</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error cargando preguntas:', error);
    }
}

async function guardarPregunta(e) {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    const formData = new FormData(e.target);
    const datos = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/preguntas-frecuentes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        if (response.ok) {
            alert('Pregunta guardada exitosamente');
            ocultarFormularioPregunta();
            e.target.reset();
            cargarPreguntas();
        }
    } catch (error) {
        console.error('Error guardando pregunta:', error);
    }
}

// Logout
function logout() {
    localStorage.removeItem('auth_token');
    window.location.href = 'login.html';
}
