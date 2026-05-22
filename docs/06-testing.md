# 06 - Testing y QA

## Estrategia de Testing

### Pirámide de Testing
```
       /\        E2E
      /  \       (10%)
     /----\
    /      \     Integration
   /        \    (30%)
  /----------\
 /            \  Unit
/              \ (60%)
```

## Testing Unitario (Backend)

### Framework
- PHPUnit (incluido en Laravel)

### Cobertura Objetivo
- 80% mínimo
- Enfoque en lógica de negocio

### Áreas de Testing

#### Autenticación
```php
class AuthControllerTest extends TestCase
{
    public function test_login_con_credenciales_validas()
    { ... }
    
    public function test_login_falla_con_password_incorrecto()
    { ... }
    
    public function test_token_expira_correctamente()
    { ... }
}
```

#### Validación
```php
class NoticiasTest extends TestCase
{
    public function test_noticia_requiere_titulo()
    { ... }
    
    public function test_fecha_vigencia_valida()
    { ... }
}
```

#### Lógica de Negocio
```php
class AgendasTest extends TestCase
{
    public function test_no_permite_doble_reserva()
    { ... }
    
    public function test_controla_cupos_disponibles()
    { ... }
    
    public function test_modalidad_urgente_aplica_costo()
    { ... }
}
```

### Ejecución
```bash
# Todos los tests
php artisan test

# Solo una clase
php artisan test tests/Unit/AuthTest.php

# Con cobertura
php artisan test --coverage

# Watch mode
php artisan test --watch
```

## Testing Funcional (Backend)

### Tests de API
```php
class NoticiasApiTest extends TestCase
{
    public function test_crear_noticia()
    {
        $response = $this->post('/api/noticias', [...]);
        $response->assertStatus(201);
    }
    
    public function test_acceso_denegado_sin_autorizacion()
    {
        $response = $this->get('/api/noticias');
        $response->assertStatus(401);
    }
}
```

### Características Testeadas
- Autenticación requerida
- Validación de entrada
- Permisos de usuario
- Respuestas correctas
- Códigos de estado HTTP

## Testing Frontend

### Manual Testing Checklist

#### Frontend Público
- [ ] Cargar página principal
- [ ] Navegar entre secciones
- [ ] Ver noticias publicadas
- [ ] Agendar prueba de manejo
- [ ] Agendar renovación normal
- [ ] Agendar renovación urgente
- [ ] Ver materiales de estudio
- [ ] Ver preguntas frecuentes
- [ ] Responsive en móvil
- [ ] Responsive en tablet

#### Frontend Admin
- [ ] Login funciona
- [ ] Dashboard carga datos
- [ ] Crear noticia
- [ ] Publicar noticia
- [ ] Editar noticia
- [ ] Ver agendas
- [ ] Confirmar agenda
- [ ] Cancelar agenda
- [ ] Crear franja
- [ ] Crear material
- [ ] Crear pregunta

### Testing en Navegadores
- Chrome (últimas versiones)
- Firefox
- Safari
- Edge

### Dispositivos
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## Testing de Integración

### Flujos Críticos

#### Flujo de Agenda Completo
1. Usuario anónimo ve franjas disponibles
2. Usuario completa formulario de agenda
3. Sistema confirma reserva
4. Admin ve agenda pendiente
5. Admin confirma agenda
6. Sistema envía confirmación por email

#### Flujo de Publicación de Noticia
1. Admin crea noticia
2. Sube imagen
3. Ingresa fechas de vigencia
4. Publica noticia
5. Noticia aparece en frontend público
6. Noticia desaparece cuando vence

## Testing de Seguridad

### Checklist de Seguridad
- [ ] Contraseña hasheada correctamente
- [ ] Tokens JWT válidos y con expiración
- [ ] CSRF protection activo
- [ ] SQL injection imposible
- [ ] XSS prevenido
- [ ] Datos personales no en logs
- [ ] Rate limiting funciona
- [ ] Validación de entrada en todos lados

### Tests Específicos
```php
class SecurityTest extends TestCase
{
    public function test_no_expone_credenciales_en_logs()
    { ... }
    
    public function test_hash_de_password_es_unico()
    { ... }
    
    public function test_previene_sql_injection()
    { ... }
}
```

## Performance Testing

### Benchmarks
- Carga de página pública: < 1s
- Carga de dashboard: < 2s
- Creación de noticia: < 500ms
- Listar 1000 agendas: < 2s

### Herramientas
- Lighthouse (Google)
- PageSpeed Insights
- Apache JMeter

## Testing de Accesibilidad

### WCAG 2.1 Nivel A
- [ ] Contraste de colores válido
- [ ] Textos alternativos en imágenes
- [ ] Navegación por teclado funciona
- [ ] Focus indicador visible
- [ ] Formularios etiquetados
- [ ] Mensajes de error claros

### Herramientas
- axe DevTools
- WAVE
- Lighthouse

## Bugs Conocidos y Reportes

### Sistema de Reportes
```
## Bug Report Template

**Título**: [Componente] Descripción breve

**Severidad**: Critical / High / Medium / Low

**Pasos para reproducir**:
1. ...
2. ...
3. ...

**Comportamiento esperado**:
...

**Comportamiento actual**:
...

**Screenshots/Video**:
...

**Entorno**:
- Browser: Chrome 120
- SO: Windows 11
- Resolución: 1920x1080
```

## Plan de QA

### Antes de Release
1. Ejecutar suite completa de tests
2. Testing manual en todos los navegadores
3. Testing de seguridad
4. Testing de performance
5. Validación de accesibilidad
6. Code review de cambios críticos

### Testing por Fase

| Semana | Actividad |
|--------|-----------|
| 8 | Pruebas unitarias de backend |
| 10 | Pruebas de integración API |
| 12 | Testing funcional frontend |
| 13 | Testing completo + seguridad |
| 14 | Testing final + fixes |

## Documentación de Tests

Cada test debe documentar:
- Qué se está testeando
- Por qué es importante
- Casos edge incluidos
- Datos de prueba utilizados

Ejemplo:
```php
/**
 * Test que valida que no se permita doble reserva
 * en la misma franja y hora.
 * 
 * Importancia: Crítico para evitar sobrebooking
 * Casos: usuario intenta reservar mismo slot 2 veces
 * 
 * @test
 */
public function test_previene_doble_reserva()
{ ... }
```
