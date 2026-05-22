# 04 - Seguridad

## Autenticación

### Sistema de Tokens JWT
- Tokens con expiración de 24 horas
- Refresh tokens para renovación
- Almacenamiento seguro en localStorage (solo para desarrollo)
- En producción: httpOnly cookies

### Contraseñas
- Hash con bcrypt (min 12 rondas)
- Requisitos mínimos:
  - 8 caracteres
  - Mayúsculas y minúsculas
  - Números
  - Caracteres especiales

## Autorización

### Roles y Permisos

**Admin**
- Acceso total al sistema
- Crear, editar, eliminar contenido
- Gestionar usuarios
- Ver historial de cambios

**Operador**
- Acceder al dashboard
- Gestionar agendas (ver, confirmar, cancelar)
- Crear y publicar noticias
- Gestionar materiales y FAQ

**Visualizador**
- Solo lectura
- Ver agendas
- Ver noticias publicadas

### Control de Acceso
- Verificación de permisos en cada endpoint
- Validación de rol del usuario
- Restricción por recurso

## Protección de Datos

### Datos Personales
- Recopilación SOLO para trámite requerido
- No compartir con terceros
- Eliminación de datos después de 90 días (si aplica)
- Cumplimiento GDPR-like

### Datos Sensibles
- Documentos de identidad: acceso restringido
- Emails y teléfonos: encriptados en tránsito
- Contraseñas: nunca en logs

### Almacenamiento
- Datos en base de datos con acceso restringido
- Backups encriptados
- Auditoría de acceso

## Validación de Entrada

### Frontend
- Validación de tipos
- Límite de caracteres
- Restricción de formatos (email, teléfono)

### Backend
- Validación obligatoria en todos los endpoints
- Whitelist de campos permitidos
- Sanitización de entrada
- Prevención de inyección SQL

### Ejemplos de Validación
```php
// Email
$this->validate($request, [
    'email' => 'required|email|unique:usuarios'
]);

// Documento
$this->validate($request, [
    'ciudadano_documento' => 'required|size:8'
]);

// Teléfono
$this->validate($request, [
    'ciudadano_telefono' => 'required|regex:/^\d{7,12}$/'
]);
```

## CSRF Protection
- Tokens CSRF en todos los formularios
- Validación en middleware
- Exclusión de endpoints públicos

## CORS (Cross-Origin Resource Sharing)
- Origen permitido: configurable
- Métodos permitidos: GET, POST, PATCH, DELETE
- Headers permitidos: Content-Type, Authorization

## Seguridad en Filesystems

### Subida de Archivos
- Validación de tipo MIME
- Límite de tamaño: 10 MB
- Almacenamiento fuera de public/
- Acceso controlado por rutas

### Extensiones Permitidas
- Imágenes: jpg, jpeg, png, gif
- Documentos: pdf, doc, docx
- Videos: mp4, mpeg

## Prevención de Vulnerabilidades

### SQL Injection
- Prepared statements
- ORM (Eloquent) para queries
- Validación de entrada

### XSS (Cross-Site Scripting)
- Escaping de output
- Content Security Policy (CSP)
- Sanitización de HTML

### CSRF
- Token validation
- SameSite cookies

### Broken Authentication
- JWT tokens seguros
- Validación en cada request
- Expiración de sesiones

## Logging y Auditoría

### Eventos Registrados
- Login/Logout
- Creación/Edición/Eliminación de contenido
- Cambios de estado
- Acceso denegado
- Errores

### Formato de Log
```
[2026-05-22 10:30:45] usuario_id=5 accion=crear_noticia tabla=noticias registro_id=42
[2026-05-22 10:31:12] usuario_id=5 accion=confirmar_agenda tabla=agendas registro_id=15
[2026-05-22 10:32:01] usuario_id=3 accion=acceso_denegado endpoint=/api/usuarios
```

### Retención
- Logs: 90 días
- Historial de cambios: indefinido

## Protección contra Ataques

### Rate Limiting
- Login: 5 intentos por 15 minutos
- API: 100 requests por minuto por usuario
- Upload: 10 MB por hora

### Prevención de Fuerza Bruta
- Bloqueo temporal después de N intentos
- Captcha en formularios de login

### DoS/DDoS
- Validación de tamaño de payload
- Timeouts en requests
- Limitación de conexiones

## Configuración Segura

### Variables de Entorno
```
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:...
DB_PASSWORD=segura_y_fuerte
JWT_SECRET=seguro_y_largo
```

### Headers de Seguridad
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## Checklist de Seguridad

- [ ] Validación de entrada en todos los endpoints
- [ ] Autenticación requerida en rutas protegidas
- [ ] Verificación de roles antes de acciones
- [ ] Logging de acciones sensibles
- [ ] Encriptación de datos en tránsito (HTTPS)
- [ ] Validación de CSRF tokens
- [ ] Sanitización de output
- [ ] Tests de seguridad
- [ ] Documentación de vulnerabilidades conocidas
- [ ] Plan de respuesta ante incidentes
