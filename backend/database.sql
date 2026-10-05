-- IMSJ: esquema PHP/PDO. Seleccionar la base antes de importar.
-- No borra datos ni crea cuentas de demostración. Conservar respaldos antes de usar una base existente.
SET NAMES utf8mb4;
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('PUBLICO_GENERAL', 'PERSONAL_IMSJ') NOT NULL DEFAULT 'PUBLICO_GENERAL',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS noticias (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    texto TEXT NOT NULL,
    fecha_inicio_vigencia DATE NOT NULL,
    fecha_fin_vigencia DATE NOT NULL,
    imagen_portada VARCHAR(2048) NULL,
    estado ENUM('PUBLICADO', 'NO_PUBLICADO') NOT NULL DEFAULT 'NO_PUBLICADO',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS noticia_imagenes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    noticia_id BIGINT UNSIGNED NOT NULL,
    ubicacion VARCHAR(2048) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT noticia_imagenes_noticia_fk FOREIGN KEY (noticia_id)
        REFERENCES noticias (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS noticia_enlaces (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    noticia_id BIGINT UNSIGNED NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT noticia_enlaces_noticia_fk FOREIGN KEY (noticia_id)
        REFERENCES noticias (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS materiales_estudio (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo ENUM('PDF', 'IMAGEN', 'VIDEO') NOT NULL,
    ubicacion_recurso VARCHAR(2048) NOT NULL,
    estado ENUM('PUBLICADO', 'NO_PUBLICADO') NOT NULL DEFAULT 'NO_PUBLICADO',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS preguntas_frecuentes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL,
    respuesta TEXT NOT NULL,
    estado ENUM('PUBLICADO', 'NO_PUBLICADO') NOT NULL DEFAULT 'NO_PUBLICADO',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS preguntas_prueba (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(500) NOT NULL,
    opcion_a VARCHAR(255) NOT NULL,
    opcion_b VARCHAR(255) NOT NULL,
    opcion_c VARCHAR(255) NOT NULL,
    opcion_d VARCHAR(255) NOT NULL,
    respuesta_correcta ENUM('A', 'B', 'C', 'D') NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS franjas_disponibilidad (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    tipo ENUM('PRUEBA_MANEJO', 'RENOVACION_NORMAL', 'RENOVACION_URGENTE') NOT NULL,
    cupos_totales SMALLINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY franjas_horario_unique (fecha, hora_inicio, hora_fin, tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reservas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT UNSIGNED NOT NULL,
    franja_disponibilidad_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY reservas_usuario_franja_unique (usuario_id, franja_disponibilidad_id),
    CONSTRAINT reservas_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    CONSTRAINT reservas_franja_fk FOREIGN KEY (franja_disponibilidad_id)
        REFERENCES franjas_disponibilidad (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS historial_acciones (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT UNSIGNED NOT NULL,
    accion VARCHAR(50) NOT NULL,
    tipo_elemento VARCHAR(100) NOT NULL,
    elemento_id BIGINT UNSIGNED NOT NULL,
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX historial_elemento_index (tipo_elemento, elemento_id),
    CONSTRAINT historial_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;





-- Los secretos de sesión nunca se guardan en claro: solamente su SHA-256.
CREATE TABLE IF NOT EXISTS auth_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT UNSIGNED NOT NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX auth_usuario (usuario_id),
    INDEX auth_vencimiento (expires_at),
    CONSTRAINT auth_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
