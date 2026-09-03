(function () {
  'use strict';

  const API_URL = 'http://localhost:8000/api';
  const TOKEN_KEY = 'imsj:token';
  const USER_KEY = 'imsj:usuario';

  function currentUser() {
    const value = sessionStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  }

  function clearSession() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = sessionStorage.getItem(TOKEN_KEY);
    let body = options.body;

    headers.set('Accept', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (body && !(body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
      if (typeof body !== 'string') body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${path}`, { ...options, headers, body });
    if (response.status === 204) return null;

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) clearSession();
      const validationMessage = Object.values(payload.errors || {}).flat()[0];
      const error = new Error(validationMessage || payload.message || 'No se pudo completar la solicitud.');
      error.status = response.status;
      throw error;
    }

    return payload;
  }

  async function login(cedula, password) {
    const payload = await request('/login', { method: 'POST', body: { cedula, password } });
    sessionStorage.setItem(TOKEN_KEY, payload.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(payload.usuario));
    return payload.usuario;
  }

  async function register(cedula, password, passwordConfirmation) {
    const payload = await request('/register', {
      method: 'POST',
      body: { cedula, password, password_confirmation: passwordConfirmation },
    });
    sessionStorage.setItem(TOKEN_KEY, payload.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(payload.usuario));
    return payload.usuario;
  }

  async function logout() {
    const logoutRequest = request('/logout', { method: 'POST', keepalive: true });
    clearSession();
    try {
      await logoutRequest;
    } catch (_) {}
  }

  window.ImsjApi = { request, login, register, logout, clearSession, currentUser };
}());
