SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS personal_access_tokens;
DROP TABLE IF EXISTS historial_acciones;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS franjas_disponibilidad;
DROP TABLE IF EXISTS preguntas_frecuentes;
DROP TABLE IF EXISTS materiales_estudio;
DROP TABLE IF EXISTS noticia_enlaces;
DROP TABLE IF EXISTS noticia_imagenes;
DROP TABLE IF EXISTS noticias;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('PUBLICO_GENERAL', 'PERSONAL_IMSJ') NOT NULL DEFAULT 'PUBLICO_GENERAL',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE noticias (
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

CREATE TABLE noticia_imagenes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    noticia_id BIGINT UNSIGNED NOT NULL,
    ubicacion VARCHAR(2048) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT noticia_imagenes_noticia_fk FOREIGN KEY (noticia_id)
        REFERENCES noticias (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE noticia_enlaces (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    noticia_id BIGINT UNSIGNED NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT noticia_enlaces_noticia_fk FOREIGN KEY (noticia_id)
        REFERENCES noticias (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE materiales_estudio (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo ENUM('PDF', 'IMAGEN', 'VIDEO') NOT NULL,
    ubicacion_recurso VARCHAR(2048) NOT NULL,
    estado ENUM('PUBLICADO', 'NO_PUBLICADO') NOT NULL DEFAULT 'NO_PUBLICADO',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE preguntas_frecuentes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL,
    respuesta TEXT NOT NULL,
    estado ENUM('PUBLICADO', 'NO_PUBLICADO') NOT NULL DEFAULT 'NO_PUBLICADO',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE franjas_disponibilidad (
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

CREATE TABLE reservas (
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

CREATE TABLE historial_acciones (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT UNSIGNED NOT NULL,
    accion VARCHAR(50) NOT NULL,
    tipo_elemento VARCHAR(100) NOT NULL,
    elemento_id BIGINT UNSIGNED NOT NULL,
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX historial_elemento_index (tipo_elemento, elemento_id),
    CONSTRAINT historial_usuario_fk FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name TEXT NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX personal_access_tokens_tokenable_index (tokenable_type, tokenable_id),
    INDEX personal_access_tokens_expires_at_index (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
