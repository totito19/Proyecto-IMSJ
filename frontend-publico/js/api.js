/** Cliente HTTP compartido por las pantallas del portal ciudadano. */
(function () {
  'use strict';

  // Apache sirve la página y la API en el mismo origen; el puerto no queda fijo en el JS.
  const API_URL = `${window.location.origin}/api`;
  const TOKEN_KEY = 'imsj:token';
  const USER_KEY = 'imsj:usuario';

  /** Recupera del almacenamiento la identidad asociada a la sesión actual. */
  function currentUser() {
    // sessionStorage conserva la sesión solamente dentro de la pestaña actual.
    const value = sessionStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  }

  /** Indica si una cuenta pertenece al personal o a la Directora. */
  function isStaff(user = currentUser()) {
    return Boolean(user && ['PERSONAL_IMSJ', 'DIRECTORA'].includes(user.rol));
  }

  /** Retira del navegador todo dato asociado a la sesión. */
  function clearSession() {
    // Elimina juntas las credenciales y la copia local del usuario.
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  /** Ejecuta una petición autenticada y unifica JSON, errores y cierre por 401. */
  async function request(path, options = {}) {
    // Copia los encabezados para agregar valores sin modificar el objeto recibido.
    const headers = new Headers(options.headers || {});
    const token = sessionStorage.getItem(TOKEN_KEY);
    let body = options.body;

    // La API responde JSON y autentica mediante el token Bearer guardado al ingresar.
    headers.set('Accept', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (body && !(body instanceof FormData)) {
      // Un objeto se serializa como JSON; FormData conserva su límite multipart automático.
      headers.set('Content-Type', 'application/json');
      if (typeof body !== 'string') body = JSON.stringify(body);
    }

    // Ejecuta la petición sin reutilizar una respuesta almacenada por el navegador.
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      cache: 'no-store',
      headers,
      body,
    });
    // HTTP 204 indica éxito sin contenido, por ejemplo al eliminar o cerrar sesión.
    if (response.status === 204) return null;

    // Si el cuerpo no es JSON válido se usa un objeto vacío para construir el error.
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      // Una sesión rechazada se borra localmente para no repetir un token inválido.
      if (response.status === 401) clearSession();
      // Prioriza el primer error de validación que haya enviado el backend.
      const validationMessage = Object.values(payload.errors || {}).flat()[0];
      const error = new Error(
        validationMessage || payload.message || 'No se pudo completar la solicitud.',
      );
      error.status = response.status;
      throw error;
    }

    return payload;
  }

  /** Valida credenciales y conserva token e identidad en la pestaña actual. */
  async function login(cedula, password) {
    // El backend entrega token y usuario después de verificar las credenciales.
    const payload = await request('/login', { method: 'POST', body: { cedula, password } });
    sessionStorage.setItem(TOKEN_KEY, payload.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(payload.usuario));
    return payload.usuario;
  }

  /** Crea una cuenta ciudadana y guarda la primera sesión devuelta. */
  async function register(cedula, password, passwordConfirmation) {
    // Envía también la confirmación para que la igualdad se valide en el backend.
    const payload = await request('/register', {
      method: 'POST',
      body: { cedula, password, password_confirmation: passwordConfirmation },
    });
    sessionStorage.setItem(TOKEN_KEY, payload.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(payload.usuario));
    return payload.usuario;
  }

  /** Solicita la revocación del token actual y limpia la sesión local. */
  async function logout() {
    // Inicia la revocación remota, pero limpia inmediatamente los datos locales.
    const logoutRequest = request('/logout', { method: 'POST', keepalive: true });
    clearSession();
    try {
      await logoutRequest;
    } catch (_) {}
  }

  window.ImsjApi = { request, login, register, logout, clearSession, currentUser, isStaff };
})();
