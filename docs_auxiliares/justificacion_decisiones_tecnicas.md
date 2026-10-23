# Justificación de las decisiones técnicas del equipo

**Proyecto:** Educación Vial IMSJ — Portal Vial.  
**Fecha de revisión:** 23/10/2026.  
**Versión analizada:** commit `916790d`, con los cambios de implementación de `7116357` y `d79df67`, y la actualización de planificación de `2e4a51b`.

## 1. Propósito y criterio de lectura

Este documento explica las decisiones técnicas que dependen del equipo: tecnologías, versiones, estructura, persistencia, seguridad, despliegue, operación y pruebas. No desarrolla la justificación de funciones cuyo origen es una solicitud del cliente.

Se distinguen tres fuentes: decisiones expresamente registradas en documentos, elecciones observables en el código y argumentos técnicos que permiten fundamentarlas. Las alternativas comparadas aquí son una evaluación de la solución actual; no se presentan como propuestas que necesariamente se hayan debatido en reuniones. El objetivo es explicar por qué la solución resulta adecuada para este proyecto y qué compromisos implica, sin afirmar que sea la única solución válida.

La configuración de Ubuntu corresponde al entorno objetivo de despliegue. Las pruebas guardadas describen el entorno y la versión de su propia ejecución; no acreditan por sí solas que todas las condiciones del servidor objetivo ya estén implementadas.

## 2. Qué cambió respecto de la revisión anterior

| Referencia | Cambio relevante | Consecuencia para la justificación |
|---|---|---|
| `7116357`, 22/10 | Ajustes de noticias, interfaz de FAQ, validación y formularios. | La explicación de la interfaz debe considerar sus recorridos y controles actuales. |
| `d79df67`, 22/10 | Persistencia y migración de categorías de FAQ; documentación de Ubuntu Server, configuración de despliegue y scripts de backup y restauración. | La clasificación ya tiene soporte de datos; la operación incluye servidor Linux, acceso de red, automatización y recuperación completa. |
| `2e4a51b`, 22/10 | Actualización de Sprint Planning. | Los puntos de esfuerzo se interpretan como tamaño relativo, sin convertirlos en horas trabajadas. |
| `916790d`, 23/10 | Revisión del alcance, infraestructura, manual y trazabilidad. | El dimensionamiento y las condiciones de entrega se leen según este corte, conservando la fecha de las evidencias técnicas. |

Fuentes: historial Git y archivos actuales. Los objetos se pueden consultar con `git show IDENTIFICADOR`.

## 3. Tecnologías y versiones

### 3.1. Ubuntu Server 26.04 LTS

**Elección:** utilizar una edición de servidor con soporte prolongado para el host, en lugar de una edición de escritorio o una versión intermedia de Ubuntu.

La aplicación no necesita un escritorio completo en el servidor: la administración se realiza por SSH, terminal y Cockpit. Prescindir de ese escritorio evita dedicar recursos a una sesión gráfica ajena al servicio. Una rama LTS reduce la frecuencia de cambios de distribución necesarios para mantener soporte. Ubuntu publica mantenimiento para 26.04 LTS hasta 2031 y Docker incluye esta versión entre sus sistemas admitidos. Fuentes: [ciclo de Ubuntu](https://ubuntu.com/about/release-cycle) e [instalación oficial de Docker en Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

Frente a Ubuntu 24.04 LTS, 26.04 ofrece un horizonte posterior de mantenimiento para una instalación nueva. Eso no convierte a 24.04 en una opción incorrecta: si la institución ya tuviera una plataforma 24.04 validada, mantener esa estandarización también sería defendible. Frente a una versión intermedia, la prioridad del proyecto es reducir cambios operativos y sostener la instalación.

Ubuntu es el anfitrión. PHP y MySQL se ejecutan en imágenes de contenedor y no dependen de que los repositorios del host proporcionen exactamente sus versiones. El `Dockerfile` no fija una edición concreta de la distribución interna de la imagen PHP; no debe confundirse esa base con Ubuntu Server 26.04.

**Evidencia:** [análisis del servidor](../docs/administracion_ssoo/analisis-requerimientos.md), [justificación de infraestructura](../docs/administracion_ssoo/justificacion-tecnologica.md) y [Dockerfile](../backend/Dockerfile).

### 3.2. PHP 8.5 y extensiones nativas

**Elección:** construir desde `php:8.5-apache` y declarar PHP `^8.5` en Composer. Se incluyen PDO/MySQL, `mbstring` y `fileinfo` para persistencia, textos UTF-8 y detección del tipo de archivos.

Mantener una misma rama entre desarrollo, pruebas y contenedores reduce diferencias de comportamiento. Según el calendario oficial consultado, PHP 8.5 tiene soporte activo hasta diciembre de 2027 y de seguridad hasta diciembre de 2029. Esa continuidad es un argumento para una instalación nueva. [Calendario de PHP](https://www.php.net/supported-versions.php).

No se fundamenta la elección afirmando que PHP 8.4 no serviría o que 8.5 vuelve automáticamente más rápido al portal. El repositorio no demuestra que una función exclusiva de 8.5 sea indispensable. El argumento es estandarizar una rama soportada y ya utilizada; cambiarla exige comprobar compatibilidad y repetir las pruebas.

La etiqueta `8.5-apache` permite recibir revisiones de la rama al actualizar la imagen, pero no identifica siempre el mismo binario. El informe histórico registra PHP 8.5.11; eso no determina qué revisión se ejecuta hoy. Para una entrega reproducible hay que registrar la revisión y el digest de la imagen efectivamente utilizada, mantener sus parches y revalidar los cambios. Esta revisión documental no sustituye esa comprobación del runtime.

**Evidencia:** [Dockerfile](../backend/Dockerfile), [manifiesto Composer](../backend/composer.json) y [pruebas registradas](../docs/ingenieria_software/plan_informe_pruebas.md).

### 3.3. MySQL 8.4 e InnoDB

**Elección:** conservar MySQL y utilizar la rama `8.4`, con tablas InnoDB.

El dominio tiene relaciones claras entre cuentas, reservas, franjas, contenidos y archivos. MySQL permite expresarlas mediante claves foráneas, restricciones, índices y transacciones. InnoDB aporta el bloqueo de filas utilizado para proteger el último cupo de una franja. Un almacenamiento basado únicamente en archivos JSON exigiría reconstruir esos controles y coordinar escrituras concurrentes desde la aplicación.

La documentación de MySQL distingue ramas LTS e Innovation. La rama 8.4 es LTS: prioriza estabilidad de comportamiento dentro de la serie. Mantenerla evita una migración de versión mayor sin una necesidad demostrada del producto. Elegir una rama más reciente puede ser válido, pero su número mayor no justifica por sí solo asumir cambios de compatibilidad. [Modelo de versiones de MySQL](https://dev.mysql.com/doc/refman/8.4/en/mysql-releases.html).

PostgreSQL también sería una alternativa relacional válida. En este proyecto, cambiar de motor implica revisar esquema, consultas, migraciones, herramientas y pruebas ya construidas para MySQL. SQLite simplificaría la instalación, pero no reproduce directamente el mecanismo MySQL de bloqueo de franjas y separa menos claramente el servicio de datos del de aplicación.

La etiqueta `mysql:8.4` fija la rama, no la revisión exacta. El informe que registra MySQL 8.4.11 es evidencia de aquella ejecución; no una inmovilización permanente del motor.

**Evidencia:** [Compose](../backend/compose.yaml), [esquema](../backend/database.sql), [conexión PDO](../backend/core/Database.php) y [reservas](../backend/services/ReservaService.php).

### 3.4. Apache con PHP en un mismo servicio

**Elección:** un contenedor `app` que sirve API, portal y panel mediante Apache y la variante de imagen PHP para Apache.

Esta organización permite resolver archivos estáticos, reescritura y ejecución PHP con un solo servicio web. Nginx más PHP-FPM sería una alternativa razonable, pero agregaría configuración y comunicación entre componentes que el volumen y las necesidades actuales no justifican por sí solos. La elección prioriza una instalación que el equipo pueda reconstruir y explicar.

Los dos frontends consumen `/api` desde el origen actual. Así no necesitan conocer una IP o puerto fijo dentro del JavaScript. Se reducen los casos de configuración de orígenes, aunque la API conserva una lista explícita para CORS cuando corresponde.

La revisión exacta de Apache proviene de la imagen construida; el repositorio no la fija por separado. No corresponde atribuir una elección de parche que no está declarada.

**Evidencia:** [Apache](../backend/apache.conf), [Dockerfile](../backend/Dockerfile) y [cliente HTTP público](../frontend-publico/js/api.js).

### 3.5. Docker Engine y Compose v2

**Elección:** definir los servicios en Compose y usar Docker Engine en el servidor Linux; las herramientas de Windows facilitan el entorno local.

Instalar PHP, extensiones y MySQL directamente en cada computadora puede producir instalaciones distintas. El `Dockerfile` y Compose describen los componentes necesarios y reducen ese trabajo manual. Compose coordina red, volúmenes, variables y salud de dos servicios sin incorporar un orquestador de clúster.

Kubernetes aportaría mecanismos para múltiples nodos y despliegues más complejos, pero este proyecto tiene un host y dos servicios. Sus componentes administrativos aumentarían el trabajo de operación sin resolver una necesidad demostrada. Compose resulta proporcionado a esa escala.

El repositorio prescribe Compose v2, pero no fija un número exacto de Docker Engine o del complemento. La versión instalada se registra en el manifiesto de backup. La justificación es compatibilidad operativa y mantenimiento, no una superioridad atribuida a una revisión específica.

**Evidencia:** [Compose](../backend/compose.yaml), [reconstrucción](../docs/administracion_ssoo/reconstruccion-infraestructura.md) y [manifiesto del backup](../backend/scripts/backup.sh).

## 4. Arquitectura y organización del código

### 4.1. PHP nativo en lugar de conservar Laravel

La decisión del 30/09, registrada en CC-05, se fundamentó en facilitar la documentación y defensa del proyecto. El recorrido explícito permite explicar cómo una petición llega al controlador, atraviesa una regla de negocio y termina en SQL, sin depender de convenciones del framework para entender cada paso.

No implica que Laravel fuera técnicamente inadecuado. El framework ofrece mecanismos de rutas, validación, migraciones y seguridad que el equipo pasa a mantener de forma explícita. El beneficio pedagógico y la reducción de dependencias se aceptan junto con esa responsabilidad adicional; retirar el framework no mejora la seguridad automáticamente.

La transición conserva dominio y contrato para no obligar a rehacer simultáneamente todos los consumidores JavaScript. La referencia simple aporta un patrón de lectura; los módulos y reglas propios del proyecto siguen necesitando implementación y pruebas.

**Evidencia:** [CC-05](../docs/ingenieria_software/control_cambios.md), [entrada HTTP](../backend/public/index.php) y [referencia simple](backend/referencia_api_simple.md).

### 4.2. Un monolito con capas y módulos

El sistema comparte base, usuarios y transacciones, y se entrega como una aplicación. Dividirlo en microservicios introduciría autenticación entre servicios, fallos de red y coordinación de datos que no aportan una ventaja clara para ocho módulos y un equipo pequeño.

Dentro de esa aplicación se separan responsabilidades:

| Ubicación | Por qué existe |
|---|---|
| `public/index.php` | Centraliza entrada, rutas y traducción de errores HTTP. |
| `controllers/` | Interpreta solicitudes, valida entradas y exige identidad o rol. |
| `services/` | Aplica reglas del caso de uso y coordina transacciones. |
| `repositories/` | Reúne SQL y acceso a los datos. |
| `models/` | Representa datos y comportamiento común de entrada o archivos. |
| `core/` | Comparte conexión, respuestas y autenticación. |

Frente a mezclar HTML, SQL y permisos en cada página, esta separación permite revisar una regla o consulta sin rastrearla por toda la interfaz. El costo es tener más archivos y llamadas. Se justifica por los módulos y reglas del dominio, no por el número de carpetas.

La carga explícita de clases y el despacho central favorecen una lectura directa. Si crece mucho el sistema, habrá que revisar autoload, rutas y acoplamiento; la organización actual no pretende resolver anticipadamente una escala distinta.

**Evidencia:** [entrada HTTP](../backend/public/index.php), [servicio de reservas](../backend/services/ReservaService.php) y [repositorio de reservas](../backend/repositories/ReservaRepository.php).

### 4.3. Dos interfaces HTML/CSS/JavaScript y un cliente HTTP compartido

El portal y el panel tienen recorridos y públicos diferentes. Mantener sus recursos separados facilita ubicarlos y modificarlos, mientras ambos reutilizan la misma API. Esa separación de directorios no es un control de acceso: la autorización debe comprobarse en el servidor.

El frontend usa las capacidades del navegador y evita añadir un framework de interfaz y una compilación como requisitos de arranque. Para formularios, listados y páginas de contenido, esto mantiene visible la relación entre HTML, eventos y peticiones. React, Vue u otra alternativa podrían facilitar componentes más complejos, pero también exigirían dependencias y herramientas adicionales.

El cliente HTTP común de cada frontend concentra token, serialización, errores y cierre de sesión. Evita repetir esas reglas en cada pantalla. El costo de mantener dos clientes es revisar su coherencia cuando cambia el contrato.

**Evidencia:** [portal](../frontend-publico/), [panel](../frontend-imsj/), [cliente público](../frontend-publico/js/api.js) y [cliente administrativo](../frontend-imsj/js/api.js).

### 4.4. JSON para datos y multipart para archivos

JSON permite intercambiar estructuras entre PHP y JavaScript sin construir HTML en la API. Los archivos viajan como multipart, evitando convertir imágenes o PDF a texto dentro del JSON. El cliente deja que el navegador genere el encabezado multipart con su delimitador correcto.

La compatibilidad de edición mediante POST multipart y `_method=PUT` conserva la forma de trabajo del panel y concentra su interpretación en la entrada de la API. No habilita acciones sin permisos: después de interpretar el método se ejecutan las mismas comprobaciones del controlador.

**Evidencia:** [contrato API](backend/api.md), [entrada](../backend/public/index.php) y [lectura de solicitudes](../backend/models/Solicitud.php).

## 5. Datos, consistencia y evolución

### 5.1. PDO y consultas preparadas en lugar de un ORM

PDO permite ver el SQL y separar la estructura de la consulta de sus valores. La conexión desactiva la emulación de consultas preparadas y convierte errores en excepciones para poder revertir operaciones. Es coherente con el objetivo de explicar persistencia sin convenciones de un ORM.

Un ORM reduciría escritura repetitiva y aportaría herramientas de relaciones, pero ocultaría parte del recorrido SQL que el equipo busca documentar. El compromiso es mantener las consultas y evitar duplicación manualmente. Usar PDO no vuelve seguro cualquier SQL: los valores deben parametrizarse y los fragmentos dinámicos limitarse a opciones controladas.

**Evidencia:** [Database](../backend/core/Database.php) y [repositorio de preguntas](../backend/repositories/PreguntaRepository.php).

### 5.2. Transacciones, restricciones y bloqueo de franjas

Comprobar un cupo en el navegador o consultar antes de insertar no alcanza cuando dos personas reservan al mismo tiempo: ambas podrían observar el mismo lugar libre. El servicio bloquea la franja dentro de una transacción, comprueba duplicación y capacidad y crea la reserva antes de confirmar.

Las restricciones del esquema complementan las validaciones de aplicación. Para operaciones administrativas, registrar el cambio y su auditoría en una misma transacción evita confirmar la modificación sin su registro asociado. Los archivos requieren además limpieza compensatoria: un rollback SQL no borra automáticamente un archivo del disco.

El beneficio es integridad; el costo son bloqueos y mayor coordinación. La prueba guardada de último cupo demuestra un caso concreto de dos solicitudes, no una capacidad general de atención.

**Evidencia:** [reservas](../backend/services/ReservaService.php), [esquema](../backend/database.sql), [servicio de materiales](../backend/services/MaterialService.php) y [resultado de integración](../output/integracion-final.json).

### 5.3. Esquema inicial y migraciones incrementales separados

MySQL importa `database.sql` al crear un volumen vacío. Una instalación existente necesita agregar columnas o índices sin reinicializar sus datos; por eso existe `migrar.php`. Comprobar si un elemento ya existe permite repetir el arranque sin volver a agregarlo.

Esta decisión evita resolver una actualización borrando volúmenes. El script pequeño resulta manejable para las modificaciones actuales; un historial numerado de migraciones sería una evolución razonable si aumentan los cambios o aparecen transformaciones complejas. Que una operación sea repetible no implica que todos los cambios DDL sean reversibles en una única transacción.

**Evidencia:** [migración](../backend/scripts/migrar.php), [Compose](../backend/compose.yaml) y [Dockerfile](../backend/Dockerfile).

### 5.4. Categorías como texto y recursos de noticias en tablas relacionadas

La nueva categoría de FAQ utiliza `VARCHAR(80)` con valor inicial `General`. Permite clasificar preguntas existentes sin crear inmediatamente un catálogo administrable ni otra pantalla de gestión. El filtro público obtiene las categorías de los datos publicados y opera en el navegador.

El compromiso es que variantes de escritura pueden producir categorías distintas y que el filtro descarga primero la colección pública. Un catálogo con identificadores y un filtro de servidor serían preferibles si crecen el volumen o las reglas de clasificación. El índice de categoría y estado prepara consultas SQL posibles, pero el listado público actual no lo usa para filtrar por categoría; no corresponde atribuirle una mejora medida en ese recorrido.

En noticias, imágenes y enlaces se almacenan en tablas relacionadas para representar varios elementos de cada noticia sin multiplicar columnas o guardar una lista delimitada en un campo. Las claves foráneas mantienen la asociación y simplifican la eliminación de filas dependientes.

**Evidencia:** [esquema](../backend/database.sql), [controlador FAQ](../backend/controllers/PreguntaController.php), [repositorio FAQ](../backend/repositories/PreguntaRepository.php) y [filtro público](../frontend-publico/js/contenido.js).

### 5.5. UTF-8 completo y fechas según su significado

`utf8mb4` evita reducir los textos a un subconjunto que no represente todos los caracteres utilizados en nombres y contenidos. Las marcas temporales de persistencia se manejan en UTC para tener una referencia común; las fechas civiles del dominio se interpretan en Uruguay.

Una fecha de agenda no es lo mismo que el instante de una acción de auditoría. Distinguir ambas evita depender accidentalmente de la zona del host. El costo es realizar correctamente la conversión al presentar marcas temporales.

**Evidencia:** [configuración](../backend/config.php), [Database](../backend/core/Database.php) y [esquema](../backend/database.sql).

## 6. Sesiones, archivos y límites de exposición

### 6.1. Token opaco revocable en lugar de JWT autónomo

El servidor emite un secreto aleatorio y guarda su hash junto a la cuenta y el vencimiento. Esto facilita revocar sesiones al salir, reemplazarlas al ingresar y comprobar que la cuenta continúa activa. Un JWT validado solo por firma necesitaría mecanismos adicionales si se quisiera invalidarlo antes de vencer.

El costo aceptado es consultar el estado de sesión en la base. Para un único backend que ya depende de MySQL, ese control es más directo que introducir validación distribuida. El hash SHA-256 corresponde a un secreto aleatorio de alta entropía; las contraseñas humanas usan bcrypt, no ese mismo tratamiento.

Las ocho horas limitan la vida del token y permiten un período de trabajo sin ingresos constantes. Es un equilibrio configurable del producto, no una duración universalmente segura. Mantener una sesión por cuenta simplifica la revocación, pero un ingreso nuevo interrumpe el anterior.

**Evidencia:** [AuthService](../backend/services/AuthService.php), [Auth](../backend/core/Auth.php) y [repositorio de tokens](../backend/repositories/AuthRepository.php).

### 6.2. Bcrypt y almacenamiento de sesión en la pestaña

Bcrypt con costo 12 evita guardar contraseñas recuperables y exige trabajo computacional por intento. Reutiliza las funciones de PHP y los hashes existentes. Argon2id sería una alternativa a evaluar con los recursos del host; no se afirma que bcrypt sea superior. El costo adecuado debe comprobarse para que el inicio de sesión siga siendo operable.

`sessionStorage` limita la persistencia del token a la sesión de la pestaña, en lugar de conservarlo entre reaperturas como ocurriría normalmente con `localStorage`. Sin embargo, el JavaScript del origen puede leerlo: la elección no elimina el riesgo de XSS. Una cookie HttpOnly sería otra arquitectura de sesión, con sus propias condiciones de cookies, origen y protección CSRF.

**Evidencia:** [AuthService](../backend/services/AuthService.php) y [cliente HTTP](../frontend-publico/js/api.js).

### 6.3. Limitación de intentos mediante archivos compartidos

El contador con bloqueo de archivo coordina procesos PHP sin agregar Redis para una aplicación pequeña. Es una elección de sencillez operativa. Requiere que los procesos compartan la misma ubicación de caché; no resuelve por sí solo un despliegue con varios hosts independientes. En ese escenario sería necesario un contador compartido o un control de acceso externo.

**Evidencia:** [Auth](../backend/core/Auth.php) y volumen `cache` en [Compose](../backend/compose.yaml).

### 6.4. Adjuntos fuera de la raíz web y videos mediante URL

La aplicación comprueba tamaño, tipo detectado y contenido básico, genera nombres aleatorios y almacena los archivos fuera de `public/`. Así no confía en extensiones o nombres recibidos y controla qué recursos puede servir la ruta de descarga. Las comprobaciones reducen riesgos concretos; no equivalen a un análisis antivirus completo.

Guardar rutas en MySQL y archivos en un volumen evita cargar todos los binarios dentro de las tablas. A cambio, base y adjuntos deben respaldarse como conjunto. Los videos mediante URL reducen almacenamiento y transferencia local; introducen dependencia del sitio externo, su disponibilidad y conectividad.

**Evidencia:** [Archivo](../backend/models/Archivo.php), [descarga controlada](../backend/public/index.php), [materiales](../backend/controllers/MaterialController.php) y [backup](../backend/scripts/backup.sh).

### 6.5. Backend privado, cabeceras y caché diferenciada

Limitar `DocumentRoot` a `public/` evita exponer SQL, configuración y clases como recursos web. Los frontends se publican mediante alias de solo lectura. La política de contenido limita los orígenes de recursos y ejecución de scripts; las fuentes externas permitidas siguen siendo dependencias explícitas.

HTML y respuestas sensibles no se reutilizan en caché; CSS, JavaScript e imágenes pueden conservarse una hora. Esto prioriza frescura en pantallas y datos sensibles y reduce transferencias de recursos estáticos. Los cambios de esos recursos requieren cuidar su versión o invalidación para que el navegador no muestre una copia anterior.

**Evidencia:** [Apache](../backend/apache.conf) y [respuestas API](../backend/core/Response.php).

## 7. Despliegue, recursos y operación

### 7.1. Dos contenedores y persistencia separada

Separar `app` de `db` permite reconstruir la aplicación sin sustituir el almacenamiento de MySQL. Mantener API y archivos estáticos en `app` evita otro servidor web para una distribución que no necesita escalar esas piezas por separado.

Los volúmenes separan datos, adjuntos y caché del ciclo de vida del contenedor. Esta separación no es un respaldo: una eliminación o corrupción también puede afectar un volumen. La caché es reconstruible; las copias operativas deben centrarse en base, adjuntos, configuración y código compatibles.

**Evidencia:** [Compose](../backend/compose.yaml) y [inventario](../docs/administracion_ssoo/documentacion-infraestructura.md).

### 7.2. Recursos iniciales proporcionados a la carga

La propuesta de 2 vCPU, 4 GB de RAM y 30 GB SSD/NVMe corresponde a una aplicación con solicitudes breves, recursos estáticos y dos contenedores. La cifra de 90 usuarios representa sesiones con períodos de lectura; no 90 ejecuciones PHP permanentemente activas. Por eso no se asigna una cantidad fija de memoria por usuario.

El escenario documentado de difusión por QR durante una charla da contexto al pico esperado. Iniciar con una VM ampliable evita reservar recursos grandes sin medición. La configuración sigue siendo una hipótesis a validar mediante carga, latencia, errores y consumo de CPU, memoria e I/O. El 70 % sostenido es un umbral de revisión para conservar margen, no una ley técnica ni garantía de rendimiento.

Los 30 GB dependen de sacar copias a un medio externo y de una retención local corta. Con siete copias completas locales se proponen 40–50 GB. El crecimiento estimado de datos y adjuntos puede cambiar esos valores; enlazar videos reduce una fuente importante de consumo, pero no vuelve ilimitado el disco.

**Evidencia:** [dimensionamiento y escenario](../docs/administracion_ssoo/analisis-requerimientos.md) y [justificación del servidor](../docs/administracion_ssoo/justificacion-tecnologica.md).

### 7.3. Salud, reinicio, registros y privilegios

`depends_on` con salud evita arrancar la aplicación antes de que MySQL esté disponible. El control interno de aplicación comprueba más componentes que el endpoint HTTP básico. `restart: unless-stopped` ayuda a recuperar procesos tras reinicios, pero un estado unhealthy no implica por sí solo un reinicio automático por Compose.

La rotación de logs a 10 MB por archivo y tres archivos por servicio limita su crecimiento local. Favorece un disco pequeño, con el costo de perder registros antiguos si no se exportan. Los usuarios de servicio, la raíz de solo lectura, `tmpfs` y capacidades reducidas limitan las escrituras y privilegios necesarios para ejecutar la aplicación; no sustituyen los parches de las imágenes.

**Evidencia:** [Compose](../backend/compose.yaml), [salud interna](../backend/scripts/salud.php) y [Dockerfile](../backend/Dockerfile).

### 7.4. Configuración externa y primera cuenta explícita

Las variables separan parámetros de instalación del código. `.env.example` documenta los nombres sin distribuir las claves reales; Compose exige los valores críticos. Así se puede cambiar dirección, origen o credenciales sin reescribir los módulos.

Crear la primera cuenta mediante CLI evita cuentas administrativas o contraseñas de demostración incorporadas automáticamente al esquema. Requiere un paso de instalación adicional, pero hace explícito quién habilita el primer acceso. Los secretos del entorno y los backups de configuración siguen necesitando permisos y custodia.

**Evidencia:** [plantilla](../backend/.env.example), [configuración](../backend/config.php) y [creación inicial](../backend/scripts/crear_admin.php).

### 7.5. Red estable, SSH, Cockpit y UFW

Netplan mantiene una dirección conocida para navegadores, orígenes y administración. Una reserva DHCP también podría dar estabilidad si la red la administra centralmente; la IP fija no debe elegirse sin coordinar rango, gateway y DNS.

SSH permite operar sin escritorio y Cockpit facilita observar servicios y recursos. Para dos contenedores no se incorpora Portainer: su panel añade otra aplicación que mantener y acceso privilegiado al motor Docker. Las herramientas elegidas cubren el trabajo actual sin esa capa adicional. Sus revisiones concretas provienen de los paquetes del host y deben registrarse al instalar; no están fijadas en Compose.

UFW simplifica reglas de host, pero hay una precisión esencial: **los puertos publicados por Docker pueden eludir las reglas habituales de UFW**. Por ello, escuchar con `APP_BIND=0.0.0.0` no queda restringido de forma demostrada solo por escribir una regla UFW. La restricción de la red autorizada debe verificarse con el filtrado compatible con el backend de Docker, la interfaz publicada y pruebas desde redes permitidas y ajenas. MySQL permanece sin puerto publicado. [Explicación oficial de Docker](https://docs.docker.com/engine/network/packet-filtering-firewalls/).

Esta precisión matiza la frase del inventario que atribuye toda la autorización efectiva a UFW; no acredita que se hayan aplicado reglas adicionales. El HTTP en el puerto 8000 corresponde a la red controlada. La publicación en Internet exige dominio, HTTPS y revisión de la exposición efectiva.

**Evidencia:** [variables y puertos](../backend/compose.yaml), [inventario de red](../docs/administracion_ssoo/documentacion-infraestructura.md) y [reconstrucción](../docs/administracion_ssoo/reconstruccion-infraestructura.md).

### 7.6. Backup lógico completo, Bash y cron

El dump lógico permite reconstruir tablas y datos sin copiar directamente archivos internos de MySQL mientras el servicio escribe. El script detiene la aplicación para coordinar el estado de SQL y adjuntos, comprime los conjuntos y conserva código y configuración. La interrupción durante el backup es el compromiso aceptado por una estrategia simple; no es una copia sin corte de servicio.

Bash y cron reutilizan herramientas del servidor y evitan añadir un servicio de automatización para una tarea diaria. El manifiesto registra versión y entorno. Los hashes permiten detectar alteraciones de los archivos incluidos en su lista; no cifran el contenido ni prueban autenticidad si se modifica también esa lista. El backup contiene configuración sensible y necesita almacenamiento protegido.

La documentación propone dos días locales y al menos siete copias externas. El script tiene siete días como valor por defecto; el cron documentado pasa `BACKUP_RETENTION_DAYS=2`. Son valores de configuración, no comportamientos idénticos. Además, la limpieza se basa en antigüedad con `mtime`, no en mantener exactamente dos directorios o siete copias. La copia externa indicada por el script requiere otra acción; el mensaje final no demuestra que la transferencia se haya ejecutado.

Restaurar en otro proyecto Compose y puerto reduce el riesgo de pisar el entorno principal. El procedimiento debe recuperar también la versión y configuración compatibles: importar SQL y adjuntos no selecciona automáticamente el código correcto. El backup externo es necesario aunque exista una VM o una instantánea; un único host no aporta alta disponibilidad.

**Evidencia:** [backup.sh](../backend/scripts/backup.sh), [restore.sh](../backend/scripts/restore.sh) y [programación y restauración](../docs/administracion_ssoo/reconstruccion-infraestructura.md).

## 8. Verificación y mantenimiento de estas decisiones

Se combinan pruebas de integración HTTP/MySQL, auditoría API, análisis estático y exploración dinámica porque responden preguntas diferentes. La integración verifica contrato y persistencia; la auditoría comprueba accesos y entradas seleccionadas; las herramientas estáticas y dinámicas aportan avisos que requieren interpretación. Ninguna sustituye por sí sola al resto.

La suite Python y la auditoría Bash son herramientas de prueba, no dependencias necesarias para responder solicitudes de producción. Mantener una base de prueba aislada permite comprobar concurrencia y fallos provocados sin usar datos del servicio.

El informe conservado del 21/10 registra 192 comprobaciones y 46 endpoints. Los cambios posteriores de categorías, validación e interfaz deben verificarse sobre su propia versión; no se trasladan automáticamente los resultados anteriores a los nuevos hashes. Esta revisión analiza fuentes y documentos, sin ejecutar nuevamente esos ensayos.

Las decisiones deben revisarse cuando cambie el problema: más volumen puede requerir paginación y filtros de servidor; múltiples hosts, contadores compartidos; requisitos de disponibilidad, otro diseño de infraestructura; mayor complejidad, herramientas de migración y organización adicionales. Revisarlas ante una necesidad concreta permite conservar sencillez sin convertir las limitaciones actuales en reglas permanentes.

**Evidencia:** [plan de pruebas](../docs/ingenieria_software/plan_informe_pruebas.md), [suite](../backend/tests/integracion.py), [auditoría API](../backend/tests/security_api.sh) y [verificación histórica](evidencias/verificacion.md).

## 9. Fuentes principales

| Fuente | Uso en esta justificación |
|---|---|
| [Control de cambios](../docs/ingenieria_software/control_cambios.md) | Motivo registrado de la transición y evolución del proyecto. |
| [Justificación tecnológica](../docs/administracion_ssoo/justificacion-tecnologica.md) | Elecciones de infraestructura y compromisos operativos. |
| [Análisis de infraestructura](../docs/administracion_ssoo/analisis-requerimientos.md) | Escenario de carga y estimaciones de recursos. |
| [Arquitectura](../docs/administracion_ssoo/arquitectura_propuesta.md) | Distribución de servicios, red y persistencia. |
| [Contrato API](backend/api.md) | Formatos, rutas y permisos de la implementación. |
| [Guía de código y defensa](../docs/programacion_full_stack/guia_codigo_y_defensa.md) | Recorrido de lectura del código. |

Los enlaces oficiales próximos a cada argumento respaldan soporte de versiones y comportamiento de la plataforma; no acreditan que esas hayan sido las palabras utilizadas por el equipo en una reunión.
