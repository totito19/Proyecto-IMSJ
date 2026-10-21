from __future__ import annotations

import hashlib
import json
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as pdf_canvas
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    PageTemplate,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs" / "electiva_ciberseguridad"
OUTPUT = ROOT / "output" / "pdf"
TEMP = ROOT / "tmp" / "pdfs" / "revalidacion"
SCREENSHOTS = Path(r"C:\Users\ASUS\Pictures\Screenshots")

NAVY = colors.HexColor("#17345D")
BLUE = colors.HexColor("#2166A5")
ORANGE = colors.HexColor("#F28C28")
PALE_BLUE = colors.HexColor("#EAF2F8")
PALE_ORANGE = colors.HexColor("#FFF2E2")
PALE_GREEN = colors.HexColor("#EAF7EF")
PALE_GRAY = colors.HexColor("#F3F5F7")
TEXT = colors.HexColor("#243447")
MUTED = colors.HexColor("#66788A")
GREEN = colors.HexColor("#247A4B")


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="AppendixTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=NAVY,
        spaceAfter=6 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="Section",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=BLUE,
        spaceBefore=4 * mm,
        spaceAfter=2.5 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="BodySmall",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.8,
        leading=12,
        textColor=TEXT,
        spaceAfter=2.2 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="Cell",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=9.5,
        textColor=TEXT,
    )
)
styles.add(
    ParagraphStyle(
        name="CellHead",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=7.4,
        leading=9,
        textColor=colors.white,
        alignment=TA_LEFT,
    )
)
styles.add(
    ParagraphStyle(
        name="Kpi",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=20,
        textColor=NAVY,
        alignment=TA_CENTER,
    )
)
styles.add(
    ParagraphStyle(
        name="KpiLabel",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.4,
        leading=9,
        textColor=MUTED,
        alignment=TA_CENTER,
    )
)
styles.add(
    ParagraphStyle(
        name="Hash",
        parent=styles["BodyText"],
        fontName="Courier",
        fontSize=6.5,
        leading=8,
        textColor=TEXT,
    )
)
styles.add(
    ParagraphStyle(
        name="HeaderLabel",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=NAVY,
    )
)
styles.add(
    ParagraphStyle(
        name="HeaderLabelRight",
        parent=styles["HeaderLabel"],
        textColor=ORANGE,
        alignment=2,
    )
)


def p(text: str, style: str = "BodySmall") -> Paragraph:
    return Paragraph(text, styles[style])


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def header_footer(canvas, label: str, page_number: int):
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(colors.HexColor("#D8E0E7"))
    canvas.setLineWidth(0.5)
    canvas.line(18 * mm, 14 * mm, width - 18 * mm, 14 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(18 * mm, 9.5 * mm, "Equipo RC5 | Evidencia posterior a correcciones | 21/10/2026")
    canvas.drawRightString(width - 18 * mm, 9.5 * mm, f"Página {page_number}")
    canvas.restoreState()


def page_header(label: str) -> Table:
    table = Table(
        [[p("Educación Vial IMSJ | Revalidación de seguridad", "HeaderLabel"), p(label, "HeaderLabelRight")]],
        colWidths=[120 * mm, 55 * mm],
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE_BLUE),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#C9D6E1")),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
                ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
            ]
        )
    )
    return table


def build_addendum(path: Path, story: list, label: str, first_page_number: int):
    document = BaseDocTemplate(
        str(path),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=22 * mm,
        bottomMargin=19 * mm,
        title=f"{label} - Revalidación",
        author="Equipo RC5",
    )
    frame = Frame(
        document.leftMargin,
        document.bottomMargin,
        document.width,
        document.height,
        id="content",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    document.addPageTemplates([PageTemplate(id="all-pages", frames=[frame])])
    document.build(story)
    stamp_pages(path, label, first_page_number)


def stamp_pages(path: Path, label: str, first_page_number: int):
    source = PdfReader(str(path))
    overlay_path = path.with_suffix(".overlay.pdf")
    canvas = pdf_canvas.Canvas(str(overlay_path), pagesize=A4)
    for index in range(len(source.pages)):
        header_footer(canvas, label, first_page_number + index)
        canvas.showPage()
    canvas.save()

    overlays = PdfReader(str(overlay_path))
    writer = PdfWriter()
    for source_page, overlay_page in zip(source.pages, overlays.pages):
        source_page.merge_page(overlay_page)
        writer.add_page(source_page)
    stamped_path = path.with_suffix(".stamped.pdf")
    with stamped_path.open("wb") as stream:
        writer.write(stream)
    stamped_path.replace(path)
    overlay_path.unlink()


def kpis(items: list[tuple[str, str]], fills: list[colors.Color] | None = None) -> Table:
    fills = fills or [PALE_BLUE] * len(items)
    cells = [[p(value, "Kpi") for value, _ in items], [p(label, "KpiLabel") for _, label in items]]
    table = Table(cells, colWidths=[(A4[0] - 36 * mm) / len(items)] * len(items))
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (i, 0), (i, 1), fills[i]) for i in range(len(items))
            ]
            + [
                ("BOX", (0, 0), (-1, -1), 0.4, colors.HexColor("#CDD8E2")),
                ("INNERGRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#DCE4EB")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, 0), 4 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 1 * mm),
                ("TOPPADDING", (0, 1), (-1, 1), 0),
                ("BOTTOMPADDING", (0, 1), (-1, 1), 3.5 * mm),
            ]
        )
    )
    return table


def data_table(rows: list[list[str]], widths: list[float], header: bool = True) -> Table:
    converted = []
    for row_index, row in enumerate(rows):
        converted.append([p(value, "CellHead" if header and row_index == 0 else "Cell") for value in row])
    table = Table(converted, colWidths=widths, repeatRows=1 if header else 0, hAlign="LEFT")
    commands = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#CDD8E2")),
        ("LEFTPADDING", (0, 0), (-1, -1), 2.2 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2.2 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 1.8 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1.8 * mm),
    ]
    if header:
        commands.append(("BACKGROUND", (0, 0), (-1, 0), NAVY))
        if len(rows) > 1:
            commands.append(("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PALE_GRAY]))
    table.setStyle(TableStyle(commands))
    return table


def callout(title: str, body: str, fill=PALE_BLUE) -> Table:
    table = Table(
        [[p(title, "Section")], [p(body, "BodySmall")]],
        colWidths=[A4[0] - 36 * mm],
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), fill),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#C9D6E1")),
                ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 1 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2.2 * mm),
            ]
        )
    )
    return table


def scaled_image(path: Path, max_width: float, max_height: float) -> Image:
    image = Image(str(path))
    ratio = min(max_width / image.imageWidth, max_height / image.imageHeight)
    image.drawWidth = image.imageWidth * ratio
    image.drawHeight = image.imageHeight * ratio
    image.hAlign = "CENTER"
    return image


def append_pdf(base: Path, addendum: Path, destination: Path):
    writer = PdfWriter()
    for source in (base, addendum):
        reader = PdfReader(str(source))
        for page in reader.pages:
            writer.add_page(page)
    writer.add_metadata(
        {
            "/Title": destination.stem.replace("_", " ").title(),
            "/Author": "Equipo RC5",
            "/Subject": "Informe de seguridad con revalidación posterior a correcciones",
        }
    )
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("wb") as stream:
        writer.write(stream)


def sast_story() -> list:
    screenshot = SCREENSHOTS / "Captura de pantalla 2026-10-21 094716.png"
    json_path = ROOT / "informes-sast-post" / "semgrep-post.json"
    terminal_path = ROOT / "informes-sast-post" / "semgrep-post-terminal.txt"
    scan = json.loads(json_path.read_text(encoding="utf-8"))
    story = [
        page_header("SAST | Semgrep"),
        Spacer(1, 5 * mm),
        p("Revalidación posterior a correcciones", "AppendixTitle"),
        p(
            "Semgrep OSS se ejecutó nuevamente el 21/10/2026 sobre el árbol de trabajo derivado del commit "
            "<b>5f15b3b</b>. La ejecución terminó correctamente y produjo un JSON independiente para comparar "
            "los resultados antes y después de las correcciones.",
        ),
        kpis(
            [("11", "coincidencias iniciales"), ("6", "coincidencias posteriores"), ("0", "missing-integrity restantes"), ("546", "reglas ejecutadas")],
            [PALE_ORANGE, PALE_BLUE, PALE_GREEN, PALE_GRAY],
        ),
        p("Comparación y decisión", "Section"),
        data_table(
            [
                ["Control", "Antes", "Después", "Decisión"],
                ["Integridad de recursos", "8 alertas por Lucide remoto sin integrity.", "0 alertas; los iconos se sirven desde un archivo local.", "Cerrado."],
                ["Ejecución de procesos", "passthru con comando construido como texto.", "proc_open recibe una lista de argumentos y no invoca un shell.", "Mitigado; Semgrep conserva 1 alerta por el uso del sink."],
                ["Ruta de caché", "1 alerta tainted-filename.", "Permanece la coincidencia; la clave continúa reducida a SHA-256 y raíz fija.", "Falso positivo documentado."],
                ["Borrado de archivos", "1 alerta unlink-use.", "Permanece la coincidencia; realpath y UPLOAD_ROOT restringen el destino.", "Mitigado; mantener pruebas de rutas."],
                ["Formularios de acceso", "No se informaba CSRF porque no declaraban POST.", "3 alertas de una regla para plantillas Django.", "No aplicable: HTML estático, API PHP y autenticación Bearer sin cookies."],
            ],
            [39 * mm, 43 * mm, 58 * mm, 35 * mm],
        ),
        Spacer(1, 3 * mm),
        callout(
            "Conclusión SAST",
            "La debilidad confirmada de cadena de suministro quedó corregida. Las seis coincidencias posteriores "
            "no representan seis vulnerabilidades explotables: tres son la regla Django aplicada fuera de contexto, "
            "dos conservan controles compensatorios ya revisados y una corresponde a una utilidad CLI que ahora "
            "ejecuta PHP sin construir una línea de shell.",
            PALE_GREEN,
        ),
        PageBreak(),
        p("Evidencia y límites de cobertura", "AppendixTitle"),
        p("Captura 2. Resumen de la segunda ejecución de Semgrep proporcionada por el equipo."),
        scaled_image(screenshot, A4[0] - 40 * mm, 92 * mm),
        Spacer(1, 3 * mm),
        p("Trazabilidad", "Section"),
        data_table(
            [
                ["Artefacto", "SHA-256"],
                ["informes-sast-post/semgrep-post.json", sha256(json_path)],
                ["informes-sast-post/semgrep-post-terminal.txt", sha256(terminal_path)],
            ],
            [67 * mm, 108 * mm],
        ),
        p("Limitaciones", "Section"),
        p(
            f"La ejecución registró {len(scan.get('errors', []))} advertencia de análisis parcial sobre el Dockerfile. "
            "Además, Semgrep indicó que limitó el alcance a archivos seguidos por Git: el nuevo archivo local de iconos "
            "todavía no estaba versionado y el ajuste final del nombre de la configuración Apache ocurrió después de "
            "esta ejecución. El cierre formal debe identificar el commit final y, si se exige cobertura exacta de todo "
            "el corte, repetir Semgrep una vez versionados esos cambios.",
        ),
    ]
    return story


def dast_story() -> list:
    screenshot_zap = SCREENSHOTS / "Captura de pantalla 2026-10-21 100340.png"
    screenshot_nmap = SCREENSHOTS / "Captura de pantalla 2026-10-21 100429.png"
    json_path = ROOT / "informes-dast-post" / "zap-report-post.json"
    html_path = ROOT / "informes-dast-post" / "zap-report-post.html"
    terminal_path = ROOT / "informes-dast-post" / "zap-post-terminal.txt"
    nmap_path = ROOT / "informes-dast-post" / "nmap-post.txt"
    report = json.loads(json_path.read_text(encoding="utf-8"))
    alerts = report["site"][0]["alerts"] if isinstance(report.get("site"), list) else report["site"]["alerts"]
    instances = sum(len(alert.get("instances", [])) for alert in alerts)
    story = [
        page_header("DAST | ZAP + Nmap"),
        Spacer(1, 5 * mm),
        p("Revalidación posterior a correcciones", "AppendixTitle"),
        p(
            "OWASP ZAP Baseline y Nmap se ejecutaron nuevamente el 21/10/2026 contra el contenedor reconstruido "
            "desde el árbol de trabajo del proyecto. La verificación previa confirmó CSP, anti-clickjacking, nosniff, "
            "políticas cross-origin, Permissions-Policy y caché diferenciada.",
        ),
        kpis(
            [("14", "reglas con alerta iniciales"), ("4", "reglas con alerta posteriores"), ("0", "fallos de política"), ("63", "controles aprobados")],
            [PALE_ORANGE, PALE_BLUE, PALE_GREEN, PALE_GREEN],
        ),
        p("Controles corregidos", "Section"),
        data_table(
            [
                ["Hallazgo inicial", "Tratamiento comprobado", "Estado"],
                ["CSP y anti-clickjacking", "Content-Security-Policy con frame-ancestors y X-Frame-Options: DENY.", "Cerrado"],
                ["Script externo sin integridad", "Lucide fue sustituido por iconos SVG locales.", "Cerrado"],
                ["Credenciales en URL", "Los tres formularios declaran POST; no aparecieron query strings con claves.", "Cerrado"],
                ["nosniff y políticas del navegador", "Se añadieron X-Content-Type-Options, COOP, COEP, CORP y Permissions-Policy.", "Cerrado"],
                ["Divulgación tecnológica", "X-Powered-By se elimina y Nmap informa Apache httpd sin versión.", "Cerrado"],
                ["JavaScript de terceros", "No quedan scripts externos en el portal revisado.", "Cerrado"],
            ],
            [55 * mm, 90 * mm, 30 * mm],
        ),
        Spacer(1, 3 * mm),
        callout(
            "Decisión posterior",
            "Los hallazgos prioritarios P1 del baseline inicial quedaron cerrados. El resultado posterior fue "
            "0 FAIL, 4 WARN y 63 PASS. Las advertencias restantes se sometieron a triage y no muestran una vía "
            "de explotación confirmada en el alcance pasivo y no autenticado ejecutado.",
            PALE_GREEN,
        ),
        PageBreak(),
        p("Triage de advertencias restantes", "AppendixTitle"),
        p(
            f"El JSON posterior contiene {len(alerts)} entradas, {instances} instancias y cuatro identificadores de regla únicos. "
            "La diferencia se debe a que ZAP representa dos decisiones de caché bajo el mismo identificador 10049.",
        ),
        data_table(
            [
                ["Regla", "Evidencia posterior", "Clasificación del equipo"],
                ["10202 - Ausencia de token anti-CSRF", "3 formularios de login/registro.", "No aplicable al flujo revisado: la API no autentica con cookies, exige JSON y usa token Bearer en sessionStorage. Los formularios son una defensa POST si falla JavaScript."],
                ["10027 - Comentarios sospechosos", "2 instancias en api.js; evidencia: 'etira del navegador...'.", "Falso positivo lingüístico por la palabra 'Retira'; no contiene secretos, tareas pendientes ni información operativa."],
                ["10109 - Aplicación web moderna", "1 señal por scripts del login.", "Informativa. Justifica Client Spider para ampliar cobertura; no requiere corrección."],
                ["10049 - Caché", "5 respuestas no almacenables y 1 CSS cacheable.", "Comportamiento esperado: HTML y errores usan no-store; CSS público usa max-age=3600 y no contiene datos personales."],
            ],
            [47 * mm, 52 * mm, 76 * mm],
        ),
        p("Nmap posterior", "Section"),
        data_table(
            [
                ["Objetivo", "Resultado", "Lectura"],
                ["host.docker.internal:8000", "open - http - Apache httpd", "Único puerto incluido en el alcance; la versión 2.4.68/2.4.69 ya no se divulga."],
            ],
            [50 * mm, 51 * mm, 74 * mm],
        ),
        p("Límite que permanece", "Section"),
        p(
            "Esta revalidación confirma el baseline público y el reconocimiento del puerto 8000. No sustituye una "
            "prueba autenticada del panel, Client Spider, auditoría específica de la API ni pruebas activas de lógica "
            "de negocio. Esas actividades deben mantenerse separadas y ejecutarse solo con cuentas y datos de prueba.",
        ),
        PageBreak(),
        p("Evidencia posterior", "AppendixTitle"),
        p("Figura 4. Resumen final de OWASP ZAP: 0 FAIL, 4 WARN y 63 PASS."),
        scaled_image(screenshot_zap, A4[0] - 40 * mm, 76 * mm),
        Spacer(1, 3 * mm),
        p("Figura 5. Nmap confirma el puerto 8000 y oculta la versión exacta de Apache."),
        scaled_image(screenshot_nmap, A4[0] - 40 * mm, 65 * mm),
        Spacer(1, 3 * mm),
        p("Integridad de artefactos posteriores", "Section"),
        data_table(
            [
                ["Artefacto", "SHA-256"],
                ["zap-report-post.json", sha256(json_path)],
                ["zap-report-post.html", sha256(html_path)],
                ["zap-post-terminal.txt", sha256(terminal_path)],
                ["nmap-post.txt", sha256(nmap_path)],
            ],
            [67 * mm, 108 * mm],
        ),
    ]
    return story


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    TEMP.mkdir(parents=True, exist_ok=True)

    sast_addendum = TEMP / "sast_addendum.pdf"
    dast_addendum = TEMP / "dast_addendum.pdf"
    build_addendum(sast_addendum, sast_story(), "SAST | Semgrep", 10)
    build_addendum(dast_addendum, dast_story(), "DAST | ZAP + Nmap", 13)

    append_pdf(
        DOCS / "informe_sast_portal_vial.pdf",
        sast_addendum,
        OUTPUT / "informe_sast_portal_vial.pdf",
    )
    append_pdf(
        DOCS / "informe_dast_portal_vial.pdf",
        dast_addendum,
        OUTPUT / "informe_dast_portal_vial.pdf",
    )


if __name__ == "__main__":
    main()
