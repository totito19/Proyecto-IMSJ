from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "guion_presentacion_proyecto_imsj.docx"


def set_font(run, name="Aptos", size=11, bold=False, italic=False, color="000000"):
    run.font.name = name
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), name)
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), name)
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = RGBColor.from_string(color)


def add_page_number(paragraph):
    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = paragraph.add_run()
    fld_char1 = OxmlElement("w:fldChar")
    fld_char1.set(qn("w:fldCharType"), "begin")
    instr_text = OxmlElement("w:instrText")
    instr_text.set(qn("xml:space"), "preserve")
    instr_text.text = " PAGE "
    fld_char2 = OxmlElement("w:fldChar")
    fld_char2.set(qn("w:fldCharType"), "end")
    run._r.append(fld_char1)
    run._r.append(instr_text)
    run._r.append(fld_char2)
    set_font(run, size=9, color="666666")


def add_label_paragraph(doc, label, text, *, italic=False, space_after=5):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.08
    r = p.add_run(label + " ")
    set_font(r, size=10.5, bold=True, color="333333")
    r = p.add_run(text)
    set_font(r, size=10.5, italic=italic, color="333333")
    return p


def add_script(doc, paragraphs):
    for text in paragraphs:
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.28)
        p.paragraph_format.right_indent = Inches(0.12)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.12
        r = p.add_run(text)
        set_font(r, size=11)


def add_slide(doc, number, title, time, screen, script, transition=None, key=None, new_page=False):
    if new_page:
        doc.add_page_break()
    p = doc.add_paragraph(style="Heading 2")
    p.paragraph_format.keep_with_next = True
    p.paragraph_format.space_before = Pt(15)
    p.paragraph_format.space_after = Pt(5)
    r = p.add_run(f"Diapositiva {number}  {title}")
    set_font(r, size=15, bold=True)

    add_label_paragraph(doc, "Tiempo", time)
    add_label_paragraph(doc, "En pantalla", screen, italic=True, space_after=7)
    add_script(doc, script)
    if key:
        add_label_paragraph(doc, "Idea que debe quedar", key, space_after=6)
    if transition:
        add_label_paragraph(doc, "Transición", transition, italic=True, space_after=9)


doc = Document()
section = doc.sections[0]
section.page_width = Inches(8.5)
section.page_height = Inches(11)
section.top_margin = Inches(0.72)
section.bottom_margin = Inches(0.72)
section.left_margin = Inches(0.88)
section.right_margin = Inches(0.88)

styles = doc.styles
normal = styles["Normal"]
normal.font.name = "Aptos"
normal._element.rPr.rFonts.set(qn("w:ascii"), "Aptos")
normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos")
normal.font.size = Pt(11)
normal.font.color.rgb = RGBColor(0, 0, 0)

for style_name, size, before, after in [
    ("Title", 25, 0, 12),
    ("Heading 1", 19, 18, 9),
    ("Heading 2", 15, 14, 5),
    ("Heading 3", 12, 10, 4),
]:
    style = styles[style_name]
    style.font.name = "Aptos Display" if style_name != "Heading 3" else "Aptos"
    style._element.rPr.rFonts.set(qn("w:ascii"), style.font.name)
    style._element.rPr.rFonts.set(qn("w:hAnsi"), style.font.name)
    style.font.size = Pt(size)
    style.font.bold = True
    style.font.color.rgb = RGBColor(0, 0, 0)
    style.paragraph_format.space_before = Pt(before)
    style.paragraph_format.space_after = Pt(after)

# Word's built-in Title style may carry a theme-colored bottom border.
# The document uses whitespace and typography instead of a decorative rule.
title_ppr = styles["Title"]._element.get_or_add_pPr()
title_border = title_ppr.find(qn("w:pBdr"))
if title_border is not None:
    title_ppr.remove(title_border)

if "Guion stage" not in styles:
    stage = styles.add_style("Guion stage", WD_STYLE_TYPE.PARAGRAPH)
    stage.font.name = "Aptos"
    stage.font.size = Pt(10)
    stage.font.italic = True
    stage.font.color.rgb = RGBColor.from_string("555555")

title = doc.add_paragraph(style="Title")
title.alignment = WD_ALIGN_PARAGRAPH.LEFT
title.paragraph_format.space_before = Pt(52)
r = title.add_run("Guion de presentación del Portal Vial IMSJ")
set_font(r, name="Aptos Display", size=25, bold=True)

subtitle = doc.add_paragraph()
subtitle.paragraph_format.space_after = Pt(20)
r = subtitle.add_run("De las necesidades del IMSJ y la ciudadanía a las decisiones técnicas")
set_font(r, name="Aptos Display", size=15, color="333333")

meta = doc.add_paragraph()
meta.paragraph_format.space_after = Pt(8)
r = meta.add_run("Duración sugerida")
set_font(r, size=10.5, bold=True, color="555555")
r = meta.add_run("  17 a 19 minutos")
set_font(r, size=10.5, color="555555")

meta = doc.add_paragraph()
meta.paragraph_format.space_after = Pt(8)
r = meta.add_run("Estructura")
set_font(r, size=10.5, bold=True, color="555555")
r = meta.add_run("  Necesidad y solución seguida de defensa técnica")
set_font(r, size=10.5, color="555555")

intro = doc.add_paragraph()
intro.paragraph_format.space_before = Pt(28)
intro.paragraph_format.space_after = Pt(8)
intro.paragraph_format.line_spacing = 1.16
r = intro.add_run(
    "Este guion parte de la necesidad general de la Intendencia de llegar a los jóvenes con información vial "
    "clara y vigente. Portal Vial aparece como la solución que conecta a la institución con la ciudadanía. "
    "Luego, cada necesidad concreta se vincula con una respuesta del portal o del panel, antes de justificar "
    "técnicamente cómo se construyó y se sostiene la solución."
)
set_font(r, size=11.5)

note = doc.add_paragraph(style="Guion stage")
note.paragraph_format.space_before = Pt(18)
note.add_run("Indicaciones entre corchetes son sugerencias de ritmo y no se leen en voz alta.")

doc.add_page_break()

h = doc.add_paragraph(style="Heading 1")
r = h.add_run("Mapa de la presentación")
set_font(r, name="Aptos Display", size=19, bold=True)

for label, text in [
    ("Acto 1  Necesidad y solución", "Diapositivas 1 a 7. Parte de la necesidad general de la Intendencia y recorre las respuestas concretas del portal ciudadano y del panel IMSJ."),
    ("Acto 2  Las decisiones", "Diapositivas 8 a 14. Justifica tecnologías, arquitectura, datos, seguridad, despliegue, operación y verificación."),
    ("Cierre", "Diapositiva 15. Vuelve a la conexión entre la Intendencia y los jóvenes y resume la defensa técnica."),
]:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    r = p.add_run(label + ". ")
    set_font(r, bold=True)
    r = p.add_run(text)
    set_font(r)

p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(12)
p.paragraph_format.space_after = Pt(8)
r = p.add_run("Tesis de la defensa")
set_font(r, bold=True)
r = p.add_run(
    ": Portal Vial responde a una brecha de acceso y comunicación. La solución técnica es adecuada porque "
    "convierte necesidades reales en recorridos comprensibles, datos consistentes y una operación sostenible."
)
set_font(r)

doc.add_page_break()

h = doc.add_paragraph(style="Heading 1")
r = h.add_run("Acto 1  De la necesidad a la solución")
set_font(r, name="Aptos Display", size=19, bold=True)

add_slide(
    doc, 1, "La necesidad general", "55 segundos",
    "Imagen de la Dirección de Tránsito intentando comunicarse con jóvenes. Frase central: necesitamos llegar.",
    [
        "[Mirar al público. Pausa breve.] La historia del proyecto comienza con una necesidad de la Dirección de Tránsito: llegar a los jóvenes con información vial clara, vigente y fácil de encontrar.",
        "El problema no era solamente producir información. Esa información podía quedar dispersa entre distintos canales, ser difícil de reconocer como vigente o no acompañar el momento en que una persona decide prepararse para obtener la libreta.",
        "Del otro lado estaba justamente esa persona joven, con una pregunta muy concreta: dónde estudiar y qué información tomar como referencia. La Intendencia necesitaba llegar; la ciudadanía necesitaba encontrar."
    ],
    transition="Las dos perspectivas mostraban una misma brecha. La pregunta era cómo crear un punto de encuentro.",
    key="La necesidad institucional de llegar se conecta con la necesidad ciudadana de encontrar."
)

add_slide(
    doc, 2, "La solución general", "55 segundos",
    "Imagen puente de la presentación HTML y el nombre Portal Vial. Frase: la ciudadanía encuentra y Tránsito llega.",
    [
        "[Pausa breve antes de nombrarlo.] La respuesta general fue Portal Vial: un único punto de encuentro entre la ciudadanía y la Dirección de Tránsito.",
        "Para la persona joven, el portal concentra el recorrido de preparación, consulta e información. Para la Intendencia, el sistema incorpora un panel desde el cual puede mantener contenidos, atender consultas y organizar la operación.",
        "Esta es la idea que ordena toda la presentación: primero aparece una necesidad; después mostramos la respuesta concreta que construimos para resolverla."
    ],
    transition="Ahora podemos bajar de la solución general a las necesidades específicas del recorrido ciudadano.",
    key="Portal Vial es la conexión general; sus secciones son respuestas a necesidades concretas.",
    new_page=True
)

add_slide(
    doc, 3, "Necesidad de prepararse", "1 minuto",
    "Dos pares necesidad y solución: estudiar → materiales; comprobar preparación → simulador.",
    [
        "La primera necesidad concreta aparece cuando una persona decide prepararse. Necesita consultar material de estudio sin recorrer fuentes dispersas. La respuesta es la sección de materiales, que reúne recursos accesibles desde el portal ciudadano.",
        "Después surge otra pregunta: cómo practicar antes del examen teórico. La respuesta es el simulador, que permite ensayar preguntas, elegir opciones y recibir una corrección. No reemplaza la prueba oficial; acompaña la preparación.",
        "En ambos casos la lógica es la misma: una necesidad del recorrido se transforma en una función visible y fácil de explicar."
    ],
    transition="Prepararse no elimina todas las dudas. El siguiente problema es encontrar una respuesta o formular una pregunta.",
    key="Necesidad: estudiar y practicar. Solución: materiales de estudio y simulador teórico.",
    new_page=True
)

add_slide(
    doc, 4, "Necesidad de resolver dudas", "1 minuto y 10 segundos",
    "Dos pares conectados: duda frecuente → preguntas frecuentes; duda particular → consulta ciudadana y bandeja interna.",
    [
        "Durante la preparación aparecen dudas. Si la respuesta ya fue publicada, la persona necesita encontrarla sin iniciar un trámite. La sección de preguntas frecuentes organiza esas respuestas por categorías.",
        "Si la duda no está respondida, la necesidad cambia: hace falta un canal directo. El portal ofrece una consulta ciudadana. Esa consulta no queda aislada; llega a la bandeja del panel IMSJ, donde el personal puede leerla y gestionarla.",
        "Aquí se ve con claridad la conexión entre ambos lados. Una acción pública tiene una respuesta operativa dentro de la institución."
    ],
    transition="Además de resolver dudas, la ciudadanía necesita información vigente y una forma de avanzar en el trámite.",
    key="Necesidad: obtener respuesta. Solución: FAQ para lo recurrente y consulta para lo particular.",
    new_page=True
)

add_slide(
    doc, 5, "Necesidad de informarse y reservar", "1 minuto",
    "Dos pares necesidad y solución: novedades vigentes → noticias; elegir horario → agenda y cupos.",
    [
        "La persona también necesita saber qué novedades siguen vigentes. La respuesta es la sección de noticias, que concentra información actualizada en el mismo lugar donde estudia y consulta.",
        "Cuando está preparada para avanzar, necesita elegir una fecha y un horario disponible. La agenda pública muestra franjas y cupos y permite realizar la reserva.",
        "El recorrido ciudadano queda así conectado: estudiar, practicar, resolver dudas, informarse y reservar. Pero para que ese recorrido funcione, la Intendencia necesita mantenerlo del otro lado."
    ],
    transition="Cambiamos de perspectiva: pasamos de quien usa el portal a quien debe mantener y controlar la información.",
    key="Necesidad: información vigente y acceso a un horario. Solución: noticias y agenda pública.",
    new_page=True
)

add_slide(
    doc, 6, "Necesidad de gestionar y aprobar", "1 minuto y 15 segundos",
    "Panel IMSJ con gestión de contenidos y flujo editorial: borrador, pendiente, aprobado y publicado.",
    [
        "La Intendencia no solo necesita publicar. Necesita gestionar el contenido, revisar quién puede modificarlo y separar la aprobación de la publicación.",
        "La respuesta es el panel IMSJ con gestión editorial. Desde allí se mantienen noticias, materiales y preguntas frecuentes. El flujo distingue estados como borrador, pendiente, aprobado y publicado. Además, editar un contenido reinicia el ciclo para que un cambio no quede publicado sin nueva revisión.",
        "Esta necesidad se volvió más precisa durante la validación con el cliente: aprobar y publicar debían ser responsabilidades diferentes. El panel convierte esa regla organizativa en un flujo visible del sistema."
    ],
    transition="El panel también debe responder a necesidades operativas que ocurren todos los días.",
    key="Necesidad: controlar la vigencia y la responsabilidad editorial. Solución: panel y flujo de aprobación.",
    new_page=True
)

add_slide(
    doc, 7, "Necesidad de operar el servicio", "1 minuto",
    "Panel IMSJ con bandeja de consultas, agenda administrativa y reservas.",
    [
        "La Intendencia necesita recibir las consultas que genera el portal, revisar la agenda y administrar las reservas. La respuesta es la parte operativa del panel.",
        "La bandeja reúne los mensajes ciudadanos; la agenda administrativa permite observar franjas y cupos; y la gestión de reservas conecta lo que la persona hizo en el portal con el trabajo interno de Tránsito.",
        "Con esto se cierra el modelo necesidad y solución: la ciudadanía encuentra, consulta y reserva; la Intendencia publica, aprueba, recibe y gestiona."
    ],
    transition="Ya vimos qué problema resuelve cada parte. Ahora corresponde justificar por qué la solución está construida de esta manera.",
    key="El portal y el panel no son productos separados: son las dos caras de un mismo recorrido.",
    new_page=True
)

doc.add_page_break()
h = doc.add_paragraph(style="Heading 1")
r = h.add_run("Acto 2  Las justificaciones técnicas")
set_font(r, name="Aptos Display", size=19, bold=True)

add_slide(
    doc, 8, "Tecnologías y versiones", "1 minuto y 20 segundos",
    "Ubuntu Server 26.04 LTS, PHP 8.5, MySQL 8.4, Apache, Docker Engine y Compose v2.",
    [
        "Ubuntu Server 26.04 LTS se eligió como host porque la aplicación no necesita un entorno gráfico. La administración puede realizarse por SSH, terminal y Cockpit, y una rama LTS reduce la frecuencia de cambios de distribución. La decisión no invalida Ubuntu 24.04 si la institución ya tuviera esa versión estandarizada.",
        "PHP 8.5 se mantiene igual entre desarrollo, Composer y la imagen del contenedor. El argumento principal es la coherencia de una rama soportada, no una supuesta mejora automática de rendimiento. MySQL 8.4 se conserva como rama LTS y con InnoDB porque el dominio necesita relaciones, transacciones, claves foráneas y bloqueo de filas.",
        "Apache y PHP se ejecutan en un mismo servicio web para resolver archivos, reescritura y ejecución con una configuración acotada. Docker y Compose describen los dos servicios, la red, los volúmenes y la salud sin introducir un orquestador de clúster.",
        "Una precisión importante: etiquetas como php:8.5-apache o mysql:8.4 fijan una rama, pero no siempre el mismo binario. Para reproducibilidad deben registrarse la revisión y el digest efectivamente desplegados."
    ],
    key="Las versiones se justifican por soporte, coherencia y mantenimiento; no por ser simplemente las más nuevas."
)

add_slide(
    doc, 9, "Arquitectura y organización del código", "1 minuto y 20 segundos",
    "Diagrama de capas: entrada, controladores, servicios, repositorios, modelos y núcleo.",
    [
        "El backend es un monolito modular. El sistema comparte usuarios, datos y transacciones, por lo que dividirlo en microservicios habría agregado autenticación entre servicios, fallos de red y coordinación distribuida sin una ventaja demostrada para ocho módulos y un equipo pequeño.",
        "Dentro del monolito sí hay separación. public/index.php centraliza la entrada y las rutas. Los controladores interpretan la solicitud y verifican identidad o rol. Los servicios aplican reglas y coordinan transacciones. Los repositorios concentran SQL. Los modelos y el núcleo reúnen comportamiento común.",
        "Las dos interfaces usan HTML, CSS y JavaScript sin un framework de frontend. Para formularios, listados y contenido, esto mantiene visible la relación entre eventos y peticiones y evita una compilación adicional. La separación de carpetas facilita el mantenimiento, pero no se considera un control de acceso: la autorización siempre se vuelve a comprobar en el servidor."
    ],
    key="Monolito no significa código mezclado; significa una unidad de despliegue con responsabilidades internas separadas.",
    new_page=True
)

add_slide(
    doc, 10, "Datos e integridad", "1 minuto y 25 segundos",
    "Ejemplo de dos personas intentando reservar el último cupo de una misma franja.",
    [
        "La elección de MySQL se vuelve crítica en el caso del último cupo. Si dos personas consultan al mismo tiempo, ambas pueden ver disponibilidad. Por eso no alcanza con validar en el navegador ni con hacer una consulta antes del alta.",
        "El servicio inicia una transacción, bloquea la franja, comprueba duplicación y capacidad, crea la reserva y recién entonces confirma. Las restricciones del esquema respaldan esa lógica. En operaciones administrativas, la modificación y su auditoría también se coordinan dentro de la misma transacción.",
        "PDO y las consultas preparadas mantienen visible el SQL y separan la estructura de los valores. No se usa un ORM porque ocultaría parte del recorrido que el equipo necesita explicar, aunque el costo sea escribir y mantener más consultas.",
        "El esquema inicial y las migraciones incrementales se mantienen separados: database.sql crea una instalación nueva y migrar.php actualiza una existente sin borrar volúmenes. Si la evolución crece, un historial numerado de migraciones sería el siguiente paso razonable."
    ],
    key="La integridad se protege en la transacción y en la base, no solo en la interfaz.",
    new_page=True
)

add_slide(
    doc, 11, "Sesiones, permisos y archivos", "1 minuto y 20 segundos",
    "Tres bloques: token revocable, autorización en servidor y archivos fuera de la raíz pública.",
    [
        "La sesión usa un token opaco aleatorio. El servidor guarda su hash, la cuenta asociada y el vencimiento. Esto permite revocar la sesión al cerrar, reemplazarla al iniciar nuevamente y comprobar que la cuenta siga activa. El costo es consultar la base en cada validación; para un único backend que ya depende de MySQL, ese costo simplifica el control.",
        "Las contraseñas usan bcrypt con costo 12. El token se conserva en sessionStorage, lo que limita su persistencia a la pestaña, aunque no elimina el riesgo de XSS porque el JavaScript del origen puede leerlo.",
        "Los adjuntos se validan por tamaño, tipo detectado y contenido básico, reciben nombres aleatorios y se guardan fuera de public. La descarga pasa por una ruta controlada. Esto reduce exposición, pero no equivale a un antivirus completo.",
        "Además, el DocumentRoot se limita a public y las respuestas sensibles no se reutilizan en caché. Los recursos estáticos sí pueden conservarse por un período corto para reducir transferencias."
    ],
    key="La seguridad se construye con controles complementarios y límites explícitos; ninguna medida aislada resuelve todo.",
    new_page=True
)

add_slide(
    doc, 12, "Despliegue y dimensionamiento", "1 minuto y 20 segundos",
    "Dos contenedores sobre una VM: app y db. Recursos iniciales: 2 vCPU, 4 GB RAM y 30 GB SSD o NVMe.",
    [
        "Compose separa aplicación y base de datos. Así puede reconstruirse el contenedor de aplicación sin sustituir el volumen de MySQL. Los datos, adjuntos y caché también tienen ciclos de vida diferenciados. Un volumen aporta persistencia, pero no es una copia de seguridad.",
        "El dimensionamiento inicial de 2 vCPU, 4 GB de RAM y 30 GB de disco parte de solicitudes breves, recursos estáticos, dos contenedores y hasta 90 usuarios con períodos de lectura. No se interpreta como 90 procesos PHP activos de forma permanente.",
        "La VM debe ser ampliable y la hipótesis debe validarse con carga, latencia, errores y consumo real. Un 70 por ciento sostenido es un umbral para revisar capacidad, no una garantía de rendimiento.",
        "Kubernetes no se incorporó porque el proyecto tiene un host y dos servicios. Sus ventajas de clúster no compensan aquí el costo administrativo. Si aparecieran múltiples nodos o exigencias fuertes de disponibilidad, esa decisión debería revisarse."
    ],
    key="La infraestructura se dimensiona como punto de partida medible, no como promesa definitiva.",
    new_page=True
)

add_slide(
    doc, 13, "Operación, red y recuperación", "1 minuto y 20 segundos",
    "Secuencia operativa: salud, registros, backup diario, copia externa y restauración aislada.",
    [
        "La operación incluye controles de salud, política de reinicio, rotación de registros, usuarios de servicio, raíz de solo lectura, tmpfs y capacidades reducidas. Estas medidas limitan fallos y privilegios, pero no sustituyen la actualización de imágenes.",
        "La configuración se mantiene fuera del código mediante variables. La primera cuenta administrativa se crea por línea de comandos, evitando credenciales de demostración incorporadas al esquema.",
        "El backup realiza un volcado lógico de MySQL, coordina SQL y adjuntos deteniendo la aplicación, comprime el conjunto y registra un manifiesto. La pausa es el compromiso de una estrategia simple y consistente. Cron reutiliza herramientas del servidor y la restauración se ensaya en otro proyecto Compose para reducir el riesgo de sobrescribir el entorno principal.",
        "En red hay una salvedad que conviene expresar con claridad: los puertos publicados por Docker pueden eludir reglas habituales de UFW. La restricción efectiva debe verificarse con filtrado compatible con Docker y con pruebas desde redes autorizadas y no autorizadas."
    ],
    key="Operar significa poder observar, respaldar y reconstruir; no solo lograr que el sistema arranque.",
    new_page=True
)

add_slide(
    doc, 14, "Pruebas, evidencia y límites", "1 minuto y 10 segundos",
    "Pirámide o lista: integración, auditoría API, análisis estático y exploración dinámica.",
    [
        "La verificación combina técnicas porque cada una responde una pregunta diferente. La integración HTTP y MySQL comprueba contrato y persistencia. La auditoría API revisa accesos y entradas seleccionadas. El análisis estático y la exploración dinámica producen hallazgos que deben interpretarse.",
        "El informe del 21 de octubre registró 192 comprobaciones sobre 46 endpoints. Ese resultado acredita la versión ensayada, no cualquier cambio posterior. Las modificaciones de categorías, validación e interfaz requieren su propia revalidación.",
        "La defensa técnica también debe reconocer cuándo revisar la solución: más volumen puede exigir paginación y filtros de servidor; varios hosts, contadores compartidos; mayor disponibilidad, otra infraestructura; y más cambios de esquema, una herramienta formal de migraciones."
    ],
    transition="Con estas decisiones justificadas, el cierre vuelve a la idea que organizó todo el proyecto.",
    key="La evidencia tiene alcance y fecha; una prueba histórica no reemplaza la verificación de la versión actual.",
    new_page=True
)

doc.add_page_break()
h = doc.add_paragraph(style="Heading 1")
r = h.add_run("Cierre")
set_font(r, name="Aptos Display", size=19, bold=True)

add_slide(
    doc, 15, "Dos necesidades y una conexión", "55 segundos",
    "Retomar la imagen puente: la ciudadanía encuentra y la Intendencia llega.",
    [
        "[Pausa breve.] Empezamos con una necesidad de la Intendencia: llegar a los jóvenes. Del otro lado encontramos a una persona que necesitaba información clara para prepararse. Portal Vial conectó esas dos perspectivas.",
        "El PHP nativo hace visible el recorrido. Las capas ordenan las responsabilidades. MySQL y las transacciones protegen la consistencia. Los tokens revocables, los permisos y el manejo de archivos reducen exposición. Docker y Compose vuelven reconstruible el entorno. Los respaldos y las pruebas permiten sostenerlo y revisar sus límites.",
        "La conclusión es que cada parte puede explicarse desde una necesidad: estudiar, consultar, informarse, reservar, gestionar, aprobar u operar. Y cada decisión técnica se justifica por cómo sostiene esas respuestas. [Mirar al público.] Muchas gracias."
    ],
    key="Portal Vial permite que la ciudadanía encuentre y que la Intendencia llegue, con una solución técnica proporcional y sostenible."
)

doc.add_page_break()
h = doc.add_paragraph(style="Heading 1")
r = h.add_run("Respuestas breves para la defensa")
set_font(r, name="Aptos Display", size=19, bold=True)

qa = [
    ("Por qué PHP nativo y no Laravel", "Porque el objetivo fue hacer explícito el recorrido de una solicitud y facilitar la documentación y defensa. Se aceptó el costo de implementar rutas, validaciones y seguridad de forma visible. No se afirma que Laravel sea inadecuado."),
    ("Por qué un monolito y no microservicios", "Porque el sistema comparte datos y transacciones, se despliega como una unidad y tiene ocho módulos. Microservicios agregarían autenticación interna, red y coordinación distribuida sin una necesidad demostrada."),
    ("Por qué MySQL y no archivos JSON", "Porque el dominio necesita claves foráneas, restricciones, transacciones y bloqueo de filas para resolver concurrencia, especialmente en reservas."),
    ("Por qué token opaco y no JWT", "Porque el token opaco puede revocarse de forma directa y permite comprobar el estado actual de la cuenta. El costo de consultar MySQL es aceptable en un único backend."),
    ("Por qué Docker Compose y no Kubernetes", "Porque hay un host y dos servicios. Compose cubre red, volúmenes, configuración y salud con menor carga operativa. Kubernetes se reconsideraría con múltiples nodos o requisitos de alta disponibilidad."),
    ("La versión queda totalmente congelada", "No. Las etiquetas fijan una rama, no siempre una revisión exacta. Para una entrega reproducible se deben registrar revisión y digest, actualizar parches y revalidar."),
    ("UFW alcanza para proteger el puerto publicado", "No necesariamente. Docker puede alterar el recorrido del filtrado. La restricción debe verificarse con reglas compatibles con Docker y pruebas reales desde redes permitidas y no permitidas."),
    ("Un volumen Docker es un backup", "No. El volumen conserva datos fuera del contenedor, pero puede borrarse o corromperse. El respaldo debe incluir base, adjuntos, configuración y código compatible, y debe existir una copia externa."),
    ("Las 192 pruebas garantizan la versión actual", "Garantizan únicamente el alcance y la versión ensayada el 21 de octubre. Los cambios posteriores deben ejecutarse y documentarse nuevamente."),
]

for question, answer in qa:
    p = doc.add_paragraph(style="Heading 3")
    p.paragraph_format.keep_with_next = True
    r = p.add_run(question)
    set_font(r, size=12, bold=True)
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.2)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.08
    r = p.add_run(answer)
    set_font(r, size=10.5)

for sec in doc.sections:
    sec.footer_distance = Inches(0.35)
    add_page_number(sec.footer.paragraphs[0])

doc.core_properties.title = "Guion de presentación del Portal Vial IMSJ"
doc.core_properties.subject = "Necesidades del IMSJ y la ciudadanía con justificación de decisiones técnicas"
doc.core_properties.author = "Equipo Proyecto IMSJ"
doc.core_properties.keywords = "IMSJ, Portal Vial, presentación, justificación técnica"

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
doc.save(OUTPUT)
print(OUTPUT)
