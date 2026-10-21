from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from PIL import Image as PILImage


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "docs" / "electiva_ciberseguridad" / "informe_hardening_contenedores_imsj.pdf"
SCREENSHOTS = Path(r"C:\Users\ASUS\Pictures\Screenshots")

BLUE = colors.HexColor("#123A63")
BLUE_2 = colors.HexColor("#1D5D8F")
ORANGE = colors.HexColor("#E87824")
INK = colors.HexColor("#172433")
MUTED = colors.HexColor("#526172")
PALE_BLUE = colors.HexColor("#EAF2F8")
PALE_ORANGE = colors.HexColor("#FFF1E6")
PALE_GREEN = colors.HexColor("#E9F7EF")
GREEN = colors.HexColor("#18794E")
LINE = colors.HexColor("#CBD5E1")


def register_fonts():
    regular = Path(r"C:\Windows\Fonts\arial.ttf")
    bold = Path(r"C:\Windows\Fonts\arialbd.ttf")
    mono = Path(r"C:\Windows\Fonts\consola.ttf")
    mono_bold = Path(r"C:\Windows\Fonts\consolab.ttf")
    if regular.exists():
        pdfmetrics.registerFont(TTFont("IMSJ", str(regular)))
        pdfmetrics.registerFont(TTFont("IMSJ-Bold", str(bold)))
        pdfmetrics.registerFont(TTFont("IMSJ-Mono", str(mono)))
        pdfmetrics.registerFont(TTFont("IMSJ-Mono-Bold", str(mono_bold)))
        return "IMSJ", "IMSJ-Bold", "IMSJ-Mono", "IMSJ-Mono-Bold"
    return "Helvetica", "Helvetica-Bold", "Courier", "Courier-Bold"


FONT, FONT_BOLD, MONO, MONO_BOLD = register_fonts()


def styles():
    base = getSampleStyleSheet()
    return {
        "Title": ParagraphStyle(
            "Title", parent=base["Title"], fontName=FONT_BOLD, fontSize=25,
            leading=29, textColor=colors.white, alignment=TA_LEFT, spaceAfter=10,
        ),
        "Subtitle": ParagraphStyle(
            "Subtitle", parent=base["Normal"], fontName=FONT, fontSize=11.5,
            leading=16, textColor=colors.white,
        ),
        "H1": ParagraphStyle(
            "H1", parent=base["Heading1"], fontName=FONT_BOLD, fontSize=18,
            leading=22, textColor=BLUE, spaceAfter=10,
        ),
        "H2": ParagraphStyle(
            "H2", parent=base["Heading2"], fontName=FONT_BOLD, fontSize=12.5,
            leading=16, textColor=BLUE_2, spaceBefore=7, spaceAfter=5,
        ),
        "Body": ParagraphStyle(
            "Body", parent=base["BodyText"], fontName=FONT, fontSize=9.3,
            leading=13.1, textColor=INK, spaceAfter=6,
        ),
        "Small": ParagraphStyle(
            "Small", parent=base["BodyText"], fontName=FONT, fontSize=7.7,
            leading=10.5, textColor=MUTED,
        ),
        "Caption": ParagraphStyle(
            "Caption", parent=base["BodyText"], fontName=FONT, fontSize=8,
            leading=10.8, textColor=MUTED, spaceBefore=5,
        ),
        "Callout": ParagraphStyle(
            "Callout", parent=base["BodyText"], fontName=FONT_BOLD, fontSize=10,
            leading=14, textColor=GREEN,
        ),
        "Code": ParagraphStyle(
            "Code", parent=base["Code"], fontName=MONO, fontSize=7.2,
            leading=9.2, textColor=INK,
        ),
        "Table": ParagraphStyle(
            "Table", parent=base["BodyText"], fontName=FONT, fontSize=7.8,
            leading=10.2, textColor=INK,
        ),
        "TableHead": ParagraphStyle(
            "TableHead", parent=base["BodyText"], fontName=FONT_BOLD, fontSize=7.8,
            leading=10, textColor=colors.white,
        ),
    }


S = styles()


def p(text, style="Body"):
    return Paragraph(text, S[style])


def page_decor(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(BLUE)
    canvas.rect(0, height - 13 * mm, width, 13 * mm, fill=1, stroke=0)
    canvas.setFillColor(ORANGE)
    canvas.rect(0, height - 14.5 * mm, width, 1.5 * mm, fill=1, stroke=0)
    canvas.setFont(FONT_BOLD, 8)
    canvas.setFillColor(colors.white)
    canvas.drawString(18 * mm, height - 8.7 * mm, "IMSJ | Electiva Ciberseguridad")
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 14 * mm, width - 18 * mm, 14 * mm)
    canvas.setFont(FONT, 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 9.5 * mm, "Informe de hardening | 21/10/2026 | Entorno local autorizado")
    canvas.drawRightString(width - 18 * mm, 9.5 * mm, f"Página {doc.page}")
    canvas.restoreState()


def table(data, widths, header=True):
    t = Table(data, colWidths=widths, repeatRows=1 if header else 0, hAlign="LEFT")
    commands = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    if header:
        commands += [
            ("BACKGROUND", (0, 0), (-1, 0), BLUE),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ]
    for row in range(1 if header else 0, len(data)):
        if row % 2 == 0:
            commands.append(("BACKGROUND", (0, row), (-1, row), colors.HexColor("#F7FAFC")))
    t.setStyle(TableStyle(commands))
    return t


def screenshot(path, max_width=174 * mm, max_height=165 * mm):
    with PILImage.open(path) as img:
        width, height = img.size
    scale = min(max_width / width, max_height / height)
    return Image(str(path), width=width * scale, height=height * scale)


def evidence_page(story, number, title, filename, bullets, caption):
    story += [p(f"Evidencia {number}", "Small"), p(title, "H1")]
    story.append(screenshot(SCREENSHOTS / filename))
    story.append(p(caption, "Caption"))
    story.append(Spacer(1, 5 * mm))
    for item in bullets:
        story.append(p(f"<font color='#E87824'><b>•</b></font> {item}"))
    story.append(PageBreak())


doc = SimpleDocTemplate(
    str(OUTPUT), pagesize=A4,
    rightMargin=18 * mm, leftMargin=18 * mm,
    topMargin=22 * mm, bottomMargin=20 * mm,
    title="Informe de hardening de infraestructura y contenedores IMSJ",
    author="Equipo RC5",
    subject="Evidencia de hardening Docker, revalidación funcional y requisito HTTPS",
)

story = []

# Portada
cover = Table(
    [[p("INFORME DE HARDENING<br/>DE INFRAESTRUCTURA Y CONTENEDORES", "Title")],
     [p("Proyecto IMSJ - Portal vial y API REST", "Subtitle")]],
    colWidths=[174 * mm], rowHeights=[61 * mm, 20 * mm],
)
cover.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), BLUE),
    ("BOX", (0, 0), (-1, -1), 0, BLUE),
    ("LEFTPADDING", (0, 0), (-1, -1), 13 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 13 * mm),
    ("TOPPADDING", (0, 0), (-1, 0), 13 * mm),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
]))
story += [Spacer(1, 16 * mm), cover, Spacer(1, 11 * mm)]

status = Table([
    [p("RESULTADO", "TableHead"), p("APROBADO", "TableHead")],
    [p("Servicios"), p("Apache/PHP y MySQL saludables")],
    [p("Endurecimiento"), p("Usuarios no privilegiados, no-new-privileges, capacidades mínimas y raíz de solo lectura")],
    [p("Regresión"), p("41 aprobadas, 0 fallidas, 2 omitidas, salida 0")],
    [p("Fecha"), p("21 de octubre de 2026")],
], [44 * mm, 130 * mm])
status.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (0, 0), ORANGE),
    ("BACKGROUND", (1, 0), (1, 0), GREEN),
    ("GRID", (0, 0), (-1, -1), 0.5, LINE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 7),
    ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
]))
story += [status, Spacer(1, 12 * mm)]
story += [p("Documento: IMSJ-CIB-HARD-2026-10-21", "Small"),
          p("Versión evaluada: rama main, HEAD 5f15b3b9313d con cambios de hardening aún pendientes de asociación al commit final.", "Small"),
          p("Responsable documental: equipo RC5. Alcance: entorno Docker local autorizado y datos de prueba.", "Small"),
          PageBreak()]

# Resumen y metodología
story += [p("1. Resumen ejecutivo", "H1")]
story += [p(
    "Se endurecieron los dos servicios Docker del proyecto IMSJ sin alterar su funcionalidad observable. "
    "La aplicación se ejecuta íntegramente como <b>www-data</b>; MySQL lo hace como <b>mysql</b>. "
    "Ambos contenedores impiden la elevación de privilegios, descartan capacidades Linux y utilizan una raíz de solo lectura. "
    "Apache conserva únicamente <b>CAP_NET_BIND_SERVICE</b> para escuchar en el puerto interno 80; MySQL no conserva capacidades adicionales."
)]
story.append(Table([
    [p("Conclusión", "Callout")],
    [p("Los controles quedaron incorporados al compose.yaml utilizado por iniciar.bat. Los dos healthchecks finalizaron en estado healthy y la auditoría de regresión no registró fallos.")],
], colWidths=[174 * mm], style=TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), PALE_GREEN),
    ("BOX", (0, 0), (-1, -1), 1, GREEN),
    ("LEFTPADDING", (0, 0), (-1, -1), 9),
    ("RIGHTPADDING", (0, 0), (-1, -1), 9),
    ("TOPPADDING", (0, 0), (-1, -1), 7),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
])))
story += [p("2. Objetivo y alcance", "H2"), p(
    "El objetivo fue reducir el impacto de una eventual explotación dentro de los contenedores y comprobar que las restricciones no impiden el arranque, la persistencia, los healthchecks ni los controles de seguridad de la API. "
    "Las pruebas se limitaron a la estación local autorizada, en 127.0.0.1:8000, con Docker Desktop y datos de prueba. No se realizó explotación contra sistemas externos."
)]
story += [p("3. Metodología", "H2")]
steps = [
    [p("Paso", "TableHead"), p("Actividad", "TableHead"), p("Criterio de aceptación", "TableHead")],
    [p("1", "Table"), p("Línea de base y healthchecks", "Table"), p("app y db saludables; MySQL sin puerto publicado", "Table")],
    [p("2", "Table"), p("Aplicación gradual de controles", "Table"), p("Recrear un servicio por vez y conservar disponibilidad", "Table")],
    [p("3", "Table"), p("Inspección de runtime", "Table"), p("Usuario, capacidades, no-new-privileges y ReadonlyRootfs visibles", "Table")],
    [p("4", "Table"), p("Regresión de API", "Table"), p("Cero pruebas fallidas y salida 0", "Table")],
    [p("5", "Table"), p("Arranque habitual", "Table"), p("iniciar.bat conserva los controles", "Table")],
]
story += [table(steps, [18 * mm, 65 * mm, 91 * mm]), PageBreak()]

# Matriz de controles
story += [p("4. Matriz de controles aplicados", "H1")]
matrix = [
    [p("Control", "TableHead"), p("Aplicación", "TableHead"), p("MySQL", "TableHead"), p("Resultado", "TableHead")],
    [p("Usuario no privilegiado", "Table"), p("www-data", "Table"), p("mysql (UID 999)", "Table"), p("Cumple", "Table")],
    [p("no-new-privileges", "Table"), p("Activo", "Table"), p("Activo", "Table"), p("Cumple", "Table")],
    [p("Capacidades Linux", "Table"), p("DROP ALL; agrega NET_BIND_SERVICE", "Table"), p("DROP ALL; no agrega", "Table"), p("Cumple", "Table")],
    [p("Raíz de solo lectura", "Table"), p("Activa", "Table"), p("Activa", "Table"), p("Cumple", "Table")],
    [p("Directorios temporales", "Table"), p("/tmp, /run/apache2, /var/lock/apache2", "Table"), p("/tmp, /var/run/mysqld", "Table"), p("Cumple", "Table")],
    [p("Datos persistentes", "Table"), p("uploads y cache en volúmenes", "Table"), p("db_data en volumen", "Table"), p("Cumple", "Table")],
    [p("Exposición de red", "Table"), p("127.0.0.1:8000 -> 80", "Table"), p("Sin publicación al host", "Table"), p("Cumple", "Table")],
]
story += [table(matrix, [44 * mm, 51 * mm, 46 * mm, 33 * mm]), Spacer(1, 7 * mm)]
story += [p("Configuración efectiva resumida", "H2")]
code = """services:
  app:
    user: www-data
    security_opt: [no-new-privileges:true]
    read_only: true
    cap_drop: [ALL]
    cap_add: [NET_BIND_SERVICE]
    tmpfs: [/tmp, /run/apache2, /var/lock/apache2]

  db:
    user: mysql
    security_opt: [no-new-privileges:true]
    read_only: true
    cap_drop: [ALL]
    tmpfs: [/tmp, /var/run/mysqld]"""
code_table = Table([[Preformatted(code, S["Code"])]], colWidths=[174 * mm])
code_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
    ("BOX", (0, 0), (-1, -1), 0.7, LINE),
    ("LEFTPADDING", (0, 0), (-1, -1), 9),
    ("RIGHTPADDING", (0, 0), (-1, -1), 9),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
]))
story += [code_table, PageBreak()]

evidence_page(
    story, 1, "Bloqueo de elevación de privilegios",
    "Captura de pantalla 2026-10-21 132916.png",
    [
        "La inspección devuelve no-new-privileges:true para app y db.",
        "Ambos servicios completan el arranque; la aplicación pasa a healthy segundos después, confirmado en la verificación siguiente.",
        "El control impide que procesos dentro del contenedor adquieran privilegios adicionales mediante binarios setuid o mecanismos equivalentes.",
    ],
    "Figura 1. Primera aplicación del control security_opt en ambos servicios.",
)

evidence_page(
    story, 2, "Usuario no privilegiado y capacidades mínimas en Apache",
    "Captura de pantalla 2026-10-21 133615.png",
    [
        "El servicio app permanece healthy con todas las capacidades descartadas.",
        "Se agrega únicamente CAP_NET_BIND_SERVICE para conservar el puerto interno 80.",
        "Todos los procesos Apache observados se ejecutan como www-data; no queda un proceso maestro root.",
    ],
    "Figura 2. Estado de app después de reducir capacidades y ejecutar Apache íntegramente como www-data.",
)

evidence_page(
    story, 3, "Raíz de solo lectura y capacidades eliminadas en MySQL",
    "Captura de pantalla 2026-10-21 133921.png",
    [
        "app y db aparecen healthy durante la misma verificación.",
        "MySQL informa READ_ONLY=true, DROP=[ALL] y ADD=null.",
        "El proceso mysqld utiliza UID 999, correspondiente al usuario mysql de la imagen.",
        "La base conserva escritura únicamente en su volumen de datos y en tmpfs temporales.",
    ],
    "Figura 3. Configuración efectiva del contenedor de base de datos.",
)

evidence_page(
    story, 4, "Revalidación funcional y de seguridad",
    "Captura de pantalla 2026-10-21 134257.png",
    [
        "Resultado: 41 aprobadas, 0 fallidas y 2 omitidas; código de salida 0.",
        "La prueba incluye healthcheck, cabeceras, CORS, autenticación, rol PERSONAL_IMSJ, carga maliciosa, operaciones descartables, SQLi/XSS controladas y rate limiting.",
        "Las dos omisiones son token expirado e ID ajeno, ya acreditadas en la ejecución estricta anterior de 43 aprobadas, 0 fallidas y 0 omitidas.",
    ],
    "Figura 4. Auditoría Bash ejecutada nuevamente después del hardening.",
)

evidence_page(
    story, 5, "Persistencia del hardening en el arranque habitual",
    "Captura de pantalla 2026-10-21 135134.png",
    [
        "El compose.yaml utilizado por iniciar.bat levanta app y db en estado healthy.",
        "app: usuario www-data, raíz de solo lectura, no-new-privileges, DROP ALL y una única capacidad agregada.",
        "db: usuario mysql, raíz de solo lectura, no-new-privileges, DROP ALL y ninguna capacidad agregada.",
        "La configuración de prueba dejó de depender de un archivo override separado.",
    ],
    "Figura 5. Inspección final después de iniciar el proyecto mediante su mecanismo habitual.",
)

# HTTPS y cierre
story += [p("5. Requisito HTTPS para producción", "H1")]
story += [p(
    "La entrega local escucha exclusivamente en <b>127.0.0.1</b> y utiliza HTTP para simplificar la demostración. "
    "Ese esquema no es una autorización para publicar el servicio sin cifrado. En un despliegue real, el tráfico externo debe terminar en un proxy inverso o balanceador con <b>TLS 1.2 o superior</b>, certificado válido y renovación automática."
)]
https_rows = [
    [p("Requisito", "TableHead"), p("Decisión de despliegue", "TableHead")],
    [p("Exposición", "Table"), p("Publicar solo 443/TCP en el proxy; mantener app y MySQL en red privada.", "Table")],
    [p("Redirección", "Table"), p("Redirigir HTTP a HTTPS y evitar contenido mixto.", "Table")],
    [p("Certificado", "Table"), p("Usar una autoridad confiable y automatizar renovación y alertas de vencimiento.", "Table")],
    [p("Cabeceras", "Table"), p("Activar HSTS únicamente después de comprobar HTTPS en todo el dominio.", "Table")],
    [p("Origen", "Table"), p("Ajustar APP_URL y FRONTEND_ORIGIN al dominio https:// definitivo.", "Table")],
    [p("Validación", "Table"), p("Repetir healthchecks, Bash, ZAP y revisión de certificado sobre el despliegue final.", "Table")],
]
story += [table(https_rows, [48 * mm, 126 * mm]), Spacer(1, 8 * mm)]
story += [p("6. Riesgos residuales y limitaciones", "H1")]
limits = [
    "El informe valida el entorno local y no sustituye una revisión del proveedor de alojamiento, firewall, DNS, certificados ni copias de seguridad de producción.",
    "CAP_NET_BIND_SERVICE permanece en app para conservar el puerto interno 80. Es una concesión mínima y documentada; puede eliminarse si una imagen futura escucha en un puerto no privilegiado.",
    "Los volúmenes persistentes continúan siendo escribibles por diseño. Su protección depende además de permisos del host, respaldo, cifrado y control de acceso operacional.",
    "No se afirma ausencia total de vulnerabilidades; se informa únicamente el alcance y las pruebas descritas.",
    "La asociación al commit o tag definitivo permanece pendiente hasta el cierre de la entrega.",
]
for item in limits:
    story.append(p(f"• {item}"))

story += [p("7. Integridad de la evidencia", "H1")]
integrity = [
    [p("Elemento", "TableHead"), p("SHA-256", "TableHead")],
    [p("backend/compose.yaml", "Table"), p("096769E1AB6F064620C0F2EF8ED9194AB2F8C94A0EDE5B692CA298385CA6246F", "Table")],
    [p("output/security-api-hardening.txt", "Table"), p("2A7C9084745A0F6C75DD4F041550FC859BDDF1BB2314D3B7147B3E3FC34DA0CE", "Table")],
]
story += [table(integrity, [55 * mm, 119 * mm]), Spacer(1, 8 * mm)]
story.append(Table([[p("DICTAMEN", "TableHead"), p("APROBADO PARA LA ENTREGA LOCAL", "TableHead")],
                    [p("Fundamento"), p("Configuración aplicada por defecto, servicios saludables y regresión sin fallos dentro del alcance.")]],
                   colWidths=[42 * mm, 132 * mm], style=TableStyle([
                       ("BACKGROUND", (0, 0), (0, 0), ORANGE),
                       ("BACKGROUND", (1, 0), (1, 0), GREEN),
                       ("GRID", (0, 0), (-1, -1), 0.6, LINE),
                       ("VALIGN", (0, 0), (-1, -1), "TOP"),
                       ("LEFTPADDING", (0, 0), (-1, -1), 7),
                       ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                       ("TOPPADDING", (0, 0), (-1, -1), 7),
                       ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                   ])))

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
doc.build(story, onFirstPage=page_decor, onLaterPages=page_decor)
print(OUTPUT)
