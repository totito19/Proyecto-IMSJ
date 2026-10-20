from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


HERE = Path(__file__).resolve().parent

WHITE = "#ffffff"
INK = "#111827"
MUTED = "#475569"
LINE = "#334155"
ENTITY_FILL = "#eef5ff"
RELATION_FILL = "#fff4d6"
ATTRIBUTE_FILL = "#ffffff"
TECH_FILL = "#f3f4f6"
HEADER_FILL = "#e8f0fb"


def font(size: int, bold: bool = False):
    filename = "arialbd.ttf" if bold else "arial.ttf"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / filename), size)


F_TITLE = font(54, True)
F_SUBTITLE = font(27)
F_ENTITY = font(30, True)
F_RELATION = font(27, True)
F_ATTRIBUTE = font(24)
F_ATTRIBUTE_ID = font(24, True)
F_LABEL = font(23, True)
F_LEGEND = font(23)
F_TABLE = font(25)
F_TABLE_BOLD = font(25, True)
F_TABLE_TITLE = font(29, True)


def centered(draw, xy, text, used_font, fill=INK):
    draw.text(xy, text, font=used_font, fill=fill, anchor="mm")


def line_to(draw, a, b, width=4, fill=LINE):
    draw.line((a, b), fill=fill, width=width)


def label_on_line(draw, xy, text):
    box = draw.textbbox(xy, text, font=F_LABEL, anchor="mm")
    draw.rounded_rectangle(
        (box[0] - 10, box[1] - 5, box[2] + 10, box[3] + 5),
        radius=8,
        fill=WHITE,
    )
    centered(draw, xy, text, F_LABEL)


def entity(draw, center, text, size=(420, 105)):
    cx, cy = center
    w, h = size
    w = max(w, draw.textlength(text, font=F_ENTITY) + 70)
    draw.rectangle(
        (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2),
        fill=ENTITY_FILL,
        outline=INK,
        width=5,
    )
    centered(draw, center, text, F_ENTITY)


def relationship(draw, center, text, size=(300, 150)):
    cx, cy = center
    w, h = size
    points = [(cx, cy - h / 2), (cx + w / 2, cy), (cx, cy + h / 2), (cx - w / 2, cy)]
    draw.polygon(points, fill=RELATION_FILL, outline=INK)
    draw.line(points + [points[0]], fill=INK, width=5, joint="curve")
    centered(draw, center, text, F_RELATION)


def attribute(draw, center, text, identifier=False, size=None):
    cx, cy = center
    if size is None:
        width = max(250, draw.textlength(text, font=F_ATTRIBUTE_ID if identifier else F_ATTRIBUTE) + 70)
        size = (width, 90)
    w, h = size
    draw.ellipse(
        (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2),
        fill=ATTRIBUTE_FILL,
        outline=INK,
        width=4,
    )
    used_font = F_ATTRIBUTE_ID if identifier else F_ATTRIBUTE
    centered(draw, center, text, used_font)
    if identifier:
        text_w = draw.textlength(text, font=used_font)
        draw.line((cx - text_w / 2, cy + 18, cx + text_w / 2, cy + 18), fill=INK, width=3)


def conceptual_mer():
    image = Image.new("RGB", (4800, 3000), WHITE)
    draw = ImageDraw.Draw(image)
    centered(draw, (2400, 75), "MODELO ENTIDAD–RELACIÓN — SISTEMA DE EDUCACIÓN VIAL IMSJ", F_TITLE)
    centered(
        draw,
        (2400, 135),
        "Modelo conceptual: entidades, atributos, relaciones y cardinalidades (sin PK ni FK)",
        F_SUBTITLE,
        MUTED,
    )

    entities = {
        "usuario": ((650, 520), "USUARIO"),
        "reserva": ((1590, 520), "RESERVA"),
        "franja": ((2600, 520), "FRANJA DE DISPONIBILIDAD"),
        "historial": ((650, 1470), "HISTORIAL DE ACCIÓN"),
        "noticia": ((1750, 1450), "NOTICIA"),
        "imagen": ((3100, 1250), "IMAGEN"),
        "enlace": ((3100, 1710), "ENLACE"),
        "material": ((4070, 500), "MATERIAL DE ESTUDIO"),
        "faq": ((4070, 1180), "PREGUNTA FRECUENTE"),
        "prueba": ((4070, 1990), "PREGUNTA DE PRUEBA"),
        "consulta": ((2200, 2580), "CONSULTA"),
    }
    relations = {
        "realiza": ((1120, 520), "REALIZA"),
        "ocupa": ((2070, 520), "OCUPA"),
        "genera": ((650, 1050), "GENERA"),
        "contiene_imagen": ((2500, 1250), "CONTIENE"),
        "contiene_enlace": ((2500, 1710), "CONTIENE"),
    }

    attrs = {
        "usuario": [
            ((210, 315), "id_usuario", True),
            ((620, 260), "cédula", False),
            ((1040, 315), "nombre", False),
            ((210, 735), "contraseña", False),
            ((850, 820), "rol", False),
            ((1110, 710), "activo", False),
        ],
        "reserva": [
            ((1590, 260), "id_reserva", True),
            ((1590, 790), "fecha_reserva", False),
        ],
        "franja": [
            ((2210, 300), "id_franja", True),
            ((2600, 245), "fecha", False),
            ((3050, 300), "tipo", False),
            ((2190, 750), "hora_inicio", False),
            ((2600, 805), "hora_fin", False),
            ((3060, 750), "cupos_totales", False),
        ],
        "historial": [
            ((210, 1270), "id_historial", True),
            ((190, 1580), "acción", False),
            ((390, 1800), "tipo_elemento", False),
            ((760, 1840), "elemento", False),
            ((1110, 1500), "fecha_hora", False),
        ],
        "noticia": [
            ((1350, 1120), "id_noticia", True),
            ((1750, 1060), "título", False),
            ((2120, 1120), "texto", False),
            ((1210, 1690), "fecha_inicio", False),
            ((1480, 1920), "fecha_fin", False),
            ((1870, 1930), "imagen_portada", False),
            ((2260, 1910), "estado", False),
        ],
        "imagen": [
            ((3020, 1010), "id_imagen", True),
            ((3310, 1450), "ubicación", False),
        ],
        "enlace": [
            ((3030, 1930), "id_enlace", True),
            ((3340, 1760), "URL", False),
        ],
        "material": [
            ((3650, 260), "id_material", True),
            ((4070, 215), "nombre", False),
            ((4510, 275), "tipo", False),
            ((3650, 735), "ubicación_recurso", False),
            ((4230, 770), "estado", False),
        ],
        "faq": [
            ((3670, 970), "id_pregunta_frecuente", True),
            ((4430, 980), "pregunta", False),
            ((3650, 1410), "respuesta", False),
            ((4340, 1420), "estado", False),
        ],
        "prueba": [
            ((3660, 1740), "id_pregunta_prueba", True),
            ((4420, 1700), "pregunta", False),
            ((3620, 2210), "imagen", False),
            ((4020, 2310), "opciones", False),
            ((4490, 2200), "respuesta_correcta", False),
        ],
        "consulta": [
            ((1560, 2380), "id_consulta", True),
            ((1870, 2260), "nombre", False),
            ((2250, 2240), "correo", False),
            ((2630, 2260), "mensaje", False),
            ((2900, 2470), "leída", False),
            ((2800, 2790), "fecha", False),
        ],
    }

    # Líneas atributo-entidad, dibujadas primero para que terminen visualmente en cada figura.
    for key, items in attrs.items():
        entity_center = entities[key][0]
        for attr_center, _, _ in items:
            line_to(draw, entity_center, attr_center, width=3, fill="#64748b")

    # Relaciones del dominio.
    line_to(draw, entities["usuario"][0], relations["realiza"][0], width=5)
    line_to(draw, relations["realiza"][0], entities["reserva"][0], width=5)
    label_on_line(draw, (870, 455), "(0, N)")
    label_on_line(draw, (1370, 455), "(1, 1)")

    line_to(draw, entities["reserva"][0], relations["ocupa"][0], width=5)
    line_to(draw, relations["ocupa"][0], entities["franja"][0], width=5)
    label_on_line(draw, (1825, 585), "(1, 1)")
    label_on_line(draw, (2325, 455), "(0, N)")

    line_to(draw, entities["usuario"][0], relations["genera"][0], width=5)
    line_to(draw, relations["genera"][0], entities["historial"][0], width=5)
    label_on_line(draw, (590, 825), "(0, N)")
    label_on_line(draw, (590, 1260), "(1, 1)")

    line_to(draw, entities["noticia"][0], relations["contiene_imagen"][0], width=5)
    line_to(draw, relations["contiene_imagen"][0], entities["imagen"][0], width=5)
    label_on_line(draw, (2130, 1315), "(0, N)")
    label_on_line(draw, (2800, 1205), "(1, 1)")

    line_to(draw, entities["noticia"][0], relations["contiene_enlace"][0], width=5)
    line_to(draw, relations["contiene_enlace"][0], entities["enlace"][0], width=5)
    label_on_line(draw, (2130, 1585), "(0, N)")
    label_on_line(draw, (2800, 1665), "(1, 1)")

    for center, text in entities.values():
        entity(draw, center, text)
    for center, text in relations.values():
        relationship(draw, center, text)
    for items in attrs.values():
        for center, text, identifier in items:
            attribute(draw, center, text, identifier)

    # Leyenda de notación.
    draw.rectangle((100, 2830, 360, 2905), fill=ENTITY_FILL, outline=INK, width=4)
    centered(draw, (230, 2868), "ENTIDAD", font(22, True))
    relationship(draw, (620, 2868), "RELACIÓN", (250, 110))
    attribute(draw, (1040, 2868), "atributo", False, (260, 80))
    attribute(draw, (1450, 2868), "identificador", True, (320, 80))
    draw.text((1700, 2845), "Cardinalidad: (mínimo, máximo). Los identificadores se muestran subrayados.", font=F_LEGEND, fill=MUTED)

    image.save(HERE / "MER.png", optimize=True)


def table_box(draw, x, y, w, title, rows, technical=False):
    row_h = 39
    header_h = 64
    h = header_h + row_h * len(rows) + 20
    fill = TECH_FILL if technical else WHITE
    draw.rectangle((x, y, x + w, y + h), fill=fill, outline=INK, width=4)
    draw.rectangle((x, y, x + w, y + header_h), fill=TECH_FILL if technical else HEADER_FILL, outline=INK, width=4)
    centered(draw, (x + w / 2, y + header_h / 2), title, F_TABLE_TITLE)
    for index, (name, marker) in enumerate(rows):
        ty = y + header_h + 14 + index * row_h
        used_font = F_TABLE_BOLD if marker == "PK" else F_TABLE
        draw.text((x + 22, ty), name, font=used_font, fill=INK)
        if marker:
            marker_width = draw.textlength(marker, font=F_TABLE_BOLD)
            draw.text((x + w - marker_width - 22, ty), marker, font=F_TABLE_BOLD, fill=MUTED)
    return (x, y, x + w, y + h)


def arrow(draw, points, start_label="1", end_label="N"):
    draw.line(points, fill=LINE, width=4, joint="curve")
    if len(points) >= 2:
        x2, y2 = points[-1]
        x1, y1 = points[-2]
        dx, dy = x2 - x1, y2 - y1
        length = max((dx * dx + dy * dy) ** 0.5, 1)
        ux, uy = dx / length, dy / length
        px, py = -uy, ux
        tip = (x2, y2)
        left = (x2 - ux * 22 + px * 11, y2 - uy * 22 + py * 11)
        right = (x2 - ux * 22 - px * 11, y2 - uy * 22 - py * 11)
        draw.polygon((tip, left, right), fill=LINE)
    sx, sy = points[0]
    snx, sny = points[1]
    ex, ey = points[-1]
    epx, epy = points[-2]
    sdx, sdy = snx - sx, sny - sy
    edx, edy = ex - epx, ey - epy
    if abs(sdx) >= abs(sdy):
        start_xy = (sx + (26 if sdx > 0 else -26), sy - 25)
    else:
        start_xy = (sx - 25, sy + (26 if sdy > 0 else -26))
    if abs(edx) >= abs(edy):
        end_xy = (ex + (-28 if edx > 0 else 28), ey - 25)
    else:
        end_xy = (ex - 25, ey + (-28 if edy > 0 else 28))
    label_on_line(draw, start_xy, start_label)
    label_on_line(draw, end_xy, end_label)


def relational_mapping():
    image = Image.new("RGB", (3900, 2350), WHITE)
    draw = ImageDraw.Draw(image)
    centered(draw, (1950, 70), "PASAJE A TABLAS — SISTEMA DE EDUCACIÓN VIAL IMSJ", F_TITLE)
    centered(
        draw,
        (1950, 130),
        "Modelo relacional alineado con backend/database.sql",
        F_SUBTITLE,
        MUTED,
    )

    boxes = {}
    boxes["usuarios"] = table_box(draw, 90, 220, 620, "USUARIOS", [
        ("id", "PK"), ("nombre", ""), ("cedula", "UK"), ("password", ""), ("rol", ""),
        ("activo", ""), ("created_at", ""), ("updated_at", "")
    ])
    boxes["reservas"] = table_box(draw, 930, 230, 760, "RESERVAS", [
        ("id", "PK"), ("usuario_id", "FK"), ("franja_disponibilidad_id", "FK"),
        ("created_at", ""), ("updated_at", ""), ("UK (usuario_id, franja_disponibilidad_id)", "")
    ])
    boxes["franjas"] = table_box(draw, 1940, 200, 720, "FRANJAS_DISPONIBILIDAD", [
        ("id", "PK"), ("fecha", ""), ("hora_inicio", ""), ("hora_fin", ""), ("tipo", ""),
        ("cupos_totales", ""), ("created_at", ""), ("updated_at", ""),
        ("UK (fecha, hora_inicio, hora_fin, tipo)", "")
    ])
    boxes["auth"] = table_box(draw, 930, 670, 760, "AUTH_TOKENS — TABLA TÉCNICA", [
        ("id", "PK"), ("usuario_id", "FK"), ("token_hash", "UK"), ("expires_at", ""), ("created_at", "")
    ], technical=True)
    boxes["historial"] = table_box(draw, 90, 760, 720, "HISTORIAL_ACCIONES", [
        ("id", "PK"), ("usuario_id", "FK"), ("accion", ""), ("tipo_elemento", ""),
        ("elemento_id", ""), ("fecha_hora", "")
    ])
    boxes["noticias"] = table_box(draw, 990, 1110, 720, "NOTICIAS", [
        ("id", "PK"), ("titulo", ""), ("texto", ""), ("fecha_inicio_vigencia", ""),
        ("fecha_fin_vigencia", ""), ("imagen_portada", ""), ("estado", ""),
        ("created_at", ""), ("updated_at", "")
    ])
    boxes["imagenes"] = table_box(draw, 1930, 940, 700, "NOTICIA_IMAGENES", [
        ("id", "PK"), ("noticia_id", "FK"), ("ubicacion", ""), ("created_at", ""), ("updated_at", "")
    ])
    boxes["enlaces"] = table_box(draw, 1930, 1390, 700, "NOTICIA_ENLACES", [
        ("id", "PK"), ("noticia_id", "FK"), ("url", ""), ("created_at", ""), ("updated_at", "")
    ])
    boxes["materiales"] = table_box(draw, 2910, 200, 850, "MATERIALES_ESTUDIO", [
        ("id", "PK"), ("nombre", ""), ("tipo", ""), ("ubicacion_recurso", ""),
        ("estado", ""), ("created_at", ""), ("updated_at", "")
    ])
    boxes["faq"] = table_box(draw, 2910, 650, 850, "PREGUNTAS_FRECUENTES", [
        ("id", "PK"), ("pregunta", ""), ("respuesta", ""), ("estado", ""),
        ("created_at", ""), ("updated_at", "")
    ])
    boxes["prueba"] = table_box(draw, 2860, 1060, 900, "PREGUNTAS_PRUEBA", [
        ("id", "PK"), ("pregunta", ""), ("imagen", ""), ("opcion_a", ""), ("opcion_b", ""),
        ("opcion_c", ""), ("opcion_d", ""), ("respuesta_correcta", ""),
        ("created_at", ""), ("updated_at", "")
    ])
    boxes["consultas"] = table_box(draw, 90, 1450, 720, "CONSULTAS", [
        ("id", "PK"), ("nombre", ""), ("email", ""), ("mensaje", ""), ("leida", ""),
        ("created_at", ""), ("updated_at", "")
    ])

    # Las flechas apuntan a la tabla que contiene la FK (lado N).
    arrow(draw, [(710, 370), (820, 370), (820, 330), (930, 330)], "1", "N")
    arrow(draw, [(1940, 370), (1810, 370), (1810, 410), (1690, 410)], "1", "N")
    arrow(draw, [(710, 500), (850, 500), (850, 790), (930, 790)], "1", "N")
    arrow(draw, [(400, 660), (400, 710), (450, 710), (450, 760)], "1", "N")
    arrow(draw, [(1710, 1280), (1830, 1280), (1830, 1080), (1930, 1080)], "1", "N")
    arrow(draw, [(1710, 1410), (1820, 1410), (1820, 1510), (1930, 1510)], "1", "N")

    draw.text((90, 2240), "PK = clave primaria   |   FK = clave foránea   |   UK = restricción única   |   1:N = uno a muchos", font=F_LEGEND, fill=MUTED)
    draw.text((90, 2285), "RESERVAS proviene de la entidad asociativa RESERVA y conserva las FK hacia USUARIOS y FRANJAS_DISPONIBILIDAD.", font=F_LEGEND, fill=MUTED)
    draw.text((90, 2325), "AUTH_TOKENS es técnica: pertenece a la implementación de autenticación y no al MER conceptual.", font=F_LEGEND, fill=MUTED)

    image.save(HERE / "Pasaje_a_tablas.png", optimize=True)


if __name__ == "__main__":
    conceptual_mer()
    relational_mapping()
    print("Generados MER.png y Pasaje_a_tablas.png")
