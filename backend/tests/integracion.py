"""Pruebas HTTP reales. Solo usar con una base vacía cuyo nombre empiece por imsj_test_.

Requiere Python estándar, cliente mysql y dos procesos PHP contra la misma base.
No instala servicios ni contiene credenciales de producción.
Variables: IMSJ_TEST_MYSQL, IMSJ_TEST_URL, IMSJ_TEST_URL_2 y DB_*.
"""
import base64
import concurrent.futures
import datetime
import hashlib
import re
import json
import os
from pathlib import Path
import subprocess
import urllib.error
import urllib.request
import uuid

ROOT = Path(__file__).resolve().parents[1]
URL = os.environ.get('IMSJ_TEST_URL', 'http://127.0.0.1:18000')
URL2 = os.environ.get('IMSJ_TEST_URL_2', 'http://127.0.0.1:18001')
NAME = os.environ.get('DB_DATABASE', '')
if not NAME.startswith('imsj_test_') or not NAME.replace('_', '').isalnum():
    raise SystemExit('DB_DATABASE debe identificar una base aislada imsj_test_*.')
MYSQL = os.environ.get('IMSJ_TEST_MYSQL', 'mysql')
CMD = [MYSQL, '--no-defaults', '--protocol=TCP', '-h', os.environ.get('DB_HOST', '127.0.0.1'),
       '-P', os.environ.get('DB_PORT', '33187'), '-u', os.environ.get('DB_USERNAME', 'root'), '-N', '-B', '--default-character-set=utf8mb4']
ENV = {**os.environ, 'MYSQL_PWD': os.environ.get('DB_PASSWORD', '')}
checks = []
covered = set()

def sql(text, database=True):
    result = subprocess.run(CMD + ([NAME] if database else []), input=text, text=True,
                            encoding='utf-8', capture_output=True, env=ENV)
    if result.returncode:
        raise AssertionError(result.stderr)
    return result.stdout.strip()

def check(condition, label):
    if not condition:
        raise AssertionError(label)
    checks.append(label)

def call(method, path, data=None, token=None, expect=200, fields=None, base=URL, multipart=None, raw=None, headers=None):
    h = {'Accept': 'application/json', **(headers or {})}
    if token:
        h['Authorization'] = 'Bearer ' + token
    if multipart is not None:
        boundary = 'imsj-' + uuid.uuid4().hex
        parts = []
        for name, value in (data or {}).items():
            parts.append((f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n').encode())
        for name, filename, content, mime in multipart:
            parts.append((f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"; filename="{filename}"\r\nContent-Type: {mime}\r\n\r\n').encode() + content + b'\r\n')
        body = b''.join(parts) + f'--{boundary}--\r\n'.encode()
        h['Content-Type'] = 'multipart/form-data; boundary=' + boundary
    else:
        body = raw if raw is not None else (json.dumps(data).encode() if data is not None else None)
        if body is not None:
            h['Content-Type'] = 'application/json'
    request = urllib.request.Request(base + path, data=body, headers=h, method=method)
    try:
        response = urllib.request.urlopen(request, timeout=15)
    except urllib.error.HTTPError as error:
        response = error
    content = response.read()
    check(response.status == expect, f'{method} {path}: esperado {expect}, recibido {response.status}: {content[:400]!r}')
    covered.add((method, path.split('?')[0]))
    result = json.loads(content) if content and response.headers.get('Content-Type', '').startswith('application/json') else content
    if fields:
        check(isinstance(result, dict) and all(key in result for key in fields), f'Contrato JSON {method} {path}')
    if expect == 204:
        check(not content, f'204 sin cuerpo {path}')
    return result

sql(f'CREATE DATABASE IF NOT EXISTS `{NAME}` CHARACTER SET utf8mb4;', False)
check(sql('SHOW TABLES;') == '', 'Base aislada inicialmente vacía (no se borran tablas existentes)')
sql((ROOT / 'database.sql').read_text(encoding='utf-8'))
# La cuenta inicial requiere una acción CLI explícita. Este hash es solo de prueba.
hash_value = '$2y$12$wHo2qJcmf0kZPEuBo.6jfOunmku6xpF/Ikuv1kuJeQmVS6/SjfzJC'
sql(f"INSERT INTO usuarios(nombre,cedula,password,rol,activo) VALUES ('Equipo prueba','22222222','{hash_value}','PERSONAL_IMSJ',1);")

call('GET', '/api/health', fields=['status'])
call('GET', '/api/me', expect=401)
call('GET', '/api/noticias', expect=401)
call('GET', '/.env', expect=404)
call('GET', '/api/desconocido', expect=404)
call('POST', '/api/login', raw=b'{mal', expect=400)
staff = call('POST', '/api/login', {'cedula': '22222222', 'password': 'prueba123'}, fields=['token', 'usuario', 'expira_en'])['token']
user_data = {'cedula': '33333333', 'password': 'prueba123', 'password_confirmation': 'prueba123'}
citizen = call('POST', '/api/register', user_data, expect=201, fields=['token', 'usuario', 'expira_en'])['token']
call('GET', '/api/me', token=citizen, fields=['usuario'])
call('GET', '/api/noticias', token=citizen, expect=403)
call('POST', '/api/reservas', {'franja_disponibilidad_id': 1}, token=staff, expect=403)
call('POST', '/api/register', user_data, expect=422)
call('POST', '/api/register', {**user_data, 'password_confirmation': 'otra'}, expect=422)
check(len(sql('SELECT token_hash FROM auth_tokens LIMIT 1;')) == 64 and staff.split('|')[1] not in sql('SELECT token_hash FROM auth_tokens;'), 'Solo hashes de token persistidos')

question = {'pregunta': '¿Semáforo rojo?', 'opcion_a': 'Detenerse', 'opcion_b': 'Seguir', 'opcion_c': 'Acelerar', 'opcion_d': 'Girar', 'respuesta_correcta': 'A'}
qid = call('POST', '/api/preguntas-prueba', question, staff, 201, ['pregunta'])['pregunta']['id']
call('GET', '/api/preguntas-prueba', token=staff, fields=['preguntas'])
call('PUT', f'/api/preguntas-prueba/{qid}', {**question, 'pregunta': '¿Qué indica rojo?'}, staff, fields=['pregunta'])
public_quiz = call('GET', '/api/portal/prueba', fields=['preguntas'])
check('respuesta_correcta' not in public_quiz['preguntas'][0], 'Prueba pública sin respuestas correctas')
result = call('POST', '/api/portal/prueba/corregir', {'respuestas': [{'pregunta_id': qid, 'opcion': 'A'}]}, fields=['total', 'correctas', 'resultados'])
check(result['correctas'] == 1, 'Corrección usa respuesta de SQL')
call('POST', '/api/portal/prueba/corregir', {'respuestas': [{'pregunta_id': qid, 'opcion': 'A'}] * 2}, expect=422)

faq = {'pregunta': '¿Documentación?', 'respuesta': 'Consultar a Tránsito.'}
fid = call('POST', '/api/preguntas', faq, staff, 201, ['pregunta'])['pregunta']['id']
call('GET', '/api/preguntas', token=staff, fields=['preguntas'])
check(not call('GET', '/api/portal/preguntas')['preguntas'], 'FAQ oculta antes de publicación')
call('PUT', f'/api/preguntas/{fid}', {**faq, 'respuesta': 'Cédula vigente.'}, staff, fields=['pregunta'])
call('PATCH', f'/api/preguntas/{fid}/estado', {'estado': 'PUBLICADO'}, staff, fields=['pregunta'])
check(len(call('GET', '/api/portal/preguntas')['preguntas']) == 1, 'FAQ publicada visible')

today = datetime.date.today().isoformat()
future = (datetime.date.today() + datetime.timedelta(days=2)).isoformat()
news = {'titulo': 'Información vial', 'texto': 'Contenido de prueba', 'fecha_inicio_vigencia': today, 'fecha_fin_vigencia': future, 'enlaces': ['https://example.org']}
nid = call('POST', '/api/noticias', news, staff, 201, ['noticia'])['noticia']['id']
call('GET', '/api/noticias', token=staff, fields=['noticias'])
call('GET', f'/api/noticias/{nid}', token=staff, fields=['noticia'])
check(not call('GET', '/api/portal/noticias')['noticias'], 'Noticias borrador ocultas')
call('PUT', f'/api/noticias/{nid}', {**news, 'titulo': 'Información actualizada', 'enlaces': []}, staff, fields=['noticia'])
call('POST', f'/api/noticias/{nid}', {**{k: v for k, v in news.items() if k != 'enlaces'}, '_method': 'PUT'}, staff, multipart=[])
call('PATCH', f'/api/noticias/{nid}/estado', {'estado': 'PUBLICADO'}, staff, fields=['noticia'])
check(len(call('GET', '/api/portal/noticias')['noticias']) == 1, 'Noticia vigente publicada visible')
png = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=')
cover = call('PUT', f'/api/noticias/{nid}', {k: v for k, v in news.items() if k != 'enlaces'}, staff,
             multipart=[('imagen_portada', 'imagen.png', png, 'image/png')])['noticia']['imagen_portada']
check(call('GET', cover.replace(URL, '')) == png, 'Portada real descargable')
call('PUT', f'/api/noticias/{nid}', {k: v for k, v in news.items() if k != 'enlaces'}, staff,
     multipart=[('galeria[]', 'galeria.png', png, 'image/png')])
call('POST', '/api/noticias', {k: v for k, v in news.items() if k != 'enlaces'}, staff, 422,
     multipart=[('imagen_portada', 'imagen.png', b'<?php echo 1;', 'image/png')])
call('POST', '/api/noticias', {**news, 'fecha_fin_vigencia': '2000-01-01'}, staff, 422)

video = {'nombre': 'Educación vial', 'tipo': 'VIDEO', 'ubicacion_recurso': 'https://example.org/video'}
mid = call('POST', '/api/materiales', video, staff, 201, ['material'])['material']['id']
call('GET', '/api/materiales', token=staff, fields=['materiales'])
call('PUT', f'/api/materiales/{mid}', {**video, 'nombre': 'Video actualizado'}, staff, fields=['material'])
call('PATCH', f'/api/materiales/{mid}/estado', {'estado': 'PUBLICADO'}, staff, fields=['material'])
check(len(call('GET', '/api/portal/materiales')['materiales']) == 1, 'Material publicado visible')
call('POST', '/api/materiales', {'nombre': 'Sin archivo', 'tipo': 'PDF'}, staff, 422)
call('POST', '/api/materiales', {'nombre': 'Falso PDF', 'tipo': 'PDF'}, staff, 422,
     multipart=[('archivo', 'ataque.pdf', b'<?php echo 1;', 'application/pdf')])
pdf = b'%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n'
pm = call('POST', '/api/materiales', {'nombre': 'PDF de prueba', 'tipo': 'PDF'}, staff, 201,
          multipart=[('archivo', 'guia.pdf', pdf, 'application/pdf')])['material']
check(call('GET', pm['ubicacion_recurso'].replace(URL, '')) == pdf, 'Descarga del recurso por /storage')
# PUT multipart utiliza request_parse_body(), con validación de contenido real.
call('PUT', f"/api/materiales/{pm['id']}", {'nombre': 'PDF reemplazado', 'tipo': 'PDF'}, staff,
     multipart=[('archivo', 'guia2.pdf', pdf, 'application/pdf')])
call('POST', f"/api/materiales/{pm['id']}", {'nombre': 'Edición panel', 'tipo': 'PDF', '_method': 'PUT'}, staff, multipart=[])
call('DELETE', f"/api/materiales/{pm['id']}", token=staff, expect=204)

franja = {'fecha': future, 'hora_inicio': '09:00', 'hora_fin': '10:00', 'tipo': 'PRUEBA_MANEJO', 'cupos_totales': 2}
slot = call('POST', '/api/franjas', franja, staff, 201, ['franja'])['franja']['id']
call('GET', '/api/franjas', token=staff, fields=['franjas'])
call('PUT', f'/api/franjas/{slot}', {**franja, 'cupos_totales': 1}, staff, fields=['franja'])
call('GET', '/api/franjas/disponibles?tipo=PRUEBA_MANEJO', fields=['franjas'])
call('POST', '/api/reservas', {'franja_disponibilidad_id': slot}, citizen, 201, ['reserva'])
call('GET', '/api/reservas/mias', token=citizen, fields=['reservas'])
call('POST', '/api/reservas', {'franja_disponibilidad_id': slot}, citizen, 422)
call('DELETE', f'/api/franjas/{slot}', token=staff, expect=422)
call('POST', '/api/franjas', franja, staff, 422)
for view in ['dia', 'semana', 'mes']:
    call('GET', f'/api/agenda?vista={view}&fecha={future}', token=staff, fields=['reservas', 'resumen'])
slot2 = call('POST', '/api/franjas', {**franja, 'hora_inicio': '11:00', 'hora_fin': '12:00'}, staff, 201)['franja']['id']
call('DELETE', f'/api/franjas/{slot2}', token=staff, expect=204)
call('GET', '/api/agenda?vista=anual', token=staff, expect=422)

created = call('POST', '/api/usuarios-admin', {'nombre': 'Segundo personal', 'cedula': '44444444'}, staff, 201, ['usuario', 'clave_inicial'])
check(set(created['usuario']) == {'id', 'nombre', 'cedula'}, 'Alta de personal conserva los tres campos originales')
admin = created['usuario']['id']
listed = call('GET', '/api/usuarios-admin', token=staff, fields=['usuarios'])
timestamp = next(u['created_at'] for u in listed['usuarios'] if u['id'] == admin)
check('T' in timestamp and datetime.datetime.fromisoformat(timestamp).utcoffset() == datetime.timedelta(0), 'Listado de personal con fecha ISO 8601 UTC')
other_staff = call('POST', '/api/login', {'cedula': '44444444', 'password': 'imsj1234'})['token']

call('DELETE', '/api/usuarios-admin/1', token=staff, expect=422)
call('DELETE', f'/api/usuarios-admin/{admin}', token=staff, expect=204)
call('GET', '/api/me', token=other_staff, expect=401)
sql('UPDATE usuarios SET activo=0 WHERE id=1;')
call('GET', '/api/noticias', token=staff, expect=401)
sql('UPDATE usuarios SET activo=1 WHERE id=1;')
call('GET', '/api/historial?limite=50', token=staff, fields=['acciones'])
call('GET', '/api/historial?limite=51', token=staff, expect=422)
check(int(sql('SELECT COUNT(*) FROM historial_acciones;')) >= 15, 'Auditoría persiste modificaciones')

# Dos servidores independientes evitan que el servidor PHP serial oculte carreras.
u2 = call('POST', '/api/register', {**user_data, 'cedula': '55555555'}, expect=201)['token']
last = call('POST', '/api/franjas', {**franja, 'hora_inicio': '13:00', 'hora_fin': '14:00', 'cupos_totales': 1}, staff, 201)['franja']['id']
def concurrent_reserve(base, token):
    req = urllib.request.Request(base + '/api/reservas', json.dumps({'franja_disponibilidad_id': last}).encode(),
                                 {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}, method='POST')
    try:
        return urllib.request.urlopen(req, timeout=15).status
    except urllib.error.HTTPError as error:
        return error.code
with concurrent.futures.ThreadPoolExecutor(2) as pool:
    statuses = list(pool.map(lambda x: concurrent_reserve(*x), [(URL, citizen), (URL2, u2)]))
check(sorted(statuses) == [201, 422], 'Último cupo concurrente: una aceptación, un rechazo')
check(sql(f'SELECT COUNT(*) FROM reservas WHERE franja_disponibilidad_id={last};') == '1', 'Último cupo: exactamente una fila en MySQL')

# Un fallo de auditoría debe revertir el contenido y limpiar el archivo recién subido.
before_files = set((ROOT / 'storage/app/public').rglob('*.pdf'))
sql("CREATE TRIGGER fallo_auditoria BEFORE INSERT ON historial_acciones FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Fallo de prueba';")
call('POST', '/api/materiales', {'nombre': 'Debe revertirse', 'tipo': 'PDF'}, staff, 500,
     multipart=[('archivo', 'revertir.pdf', pdf, 'application/pdf')])
check(sql("SELECT COUNT(*) FROM materiales_estudio WHERE nombre='Debe revertirse';") == '0', 'Rollback de contenido ante fallo de auditoría')
check(set((ROOT / 'storage/app/public').rglob('*.pdf')) == before_files, 'Rollback limpia el archivo nuevo')
sql('DROP TRIGGER fallo_auditoria;')

for route, identity in [('noticias', nid), ('materiales', mid), ('preguntas', fid), ('preguntas-prueba', qid)]:
    call('DELETE', f'/api/{route}/{identity}', token=staff, expect=204)
call('GET', f'/api/noticias/{nid}', token=staff, expect=404)
call('GET', '/api/noticias/0', token=staff, expect=404)
call('GET', '/storage/../config.php', expect=404)
call('OPTIONS', '/api/noticias', headers={'Origin': 'http://localhost:8081'}, expect=204)
call('OPTIONS', '/api/noticias', headers={'Origin': 'https://no-autorizado.example'}, expect=403)

call('POST', '/api/logout', token=citizen, expect=204)
call('GET', '/api/me', token=citizen, expect=401)
new_token = call('POST', '/api/login', {'cedula': '22222222', 'password': 'prueba123'})['token']
call('GET', '/api/me', token=staff, expect=401)
sql("UPDATE auth_tokens SET expires_at=UTC_TIMESTAMP()-INTERVAL 1 SECOND;")
call('GET', '/api/me', token=new_token, expect=401)
for _ in range(1):
    call('POST', '/api/login', {'cedula': '22222222', 'password': 'incorrecta'}, expect=422)
call('POST', '/api/login', {'cedula': '22222222', 'password': 'incorrecta'}, expect=429)
# Contrastar las 42 rutas implementadas con peticiones efectivamente ejecutadas.
expected = set(re.findall(r'// (GET|POST|PUT|PATCH|DELETE) (/api/[^:]+): acceso', (ROOT/'public/index.php').read_text(encoding='utf-8')))
normalized = {(m, re.sub(r'/[0-9]+(?=/|$)', '/{id}', p)) for m,p in covered}
check(expected.issubset(normalized), 'Cobertura efectiva de las 42 declaraciones de ruta')
report = {'fecha': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'checks': len(checks), 'peticiones_distintas': len(covered),
          'ultimo_cupo': statuses, 'base': NAME, 'resultado': 'OK', 'endpoints': len(expected), 'php': '8.5.11', 'mysql': sql('SELECT VERSION();'), 'archivos_php_sha256': {str(p.relative_to(ROOT)).replace(chr(92), '/'): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(ROOT.rglob('*.php'))}}
print(json.dumps(report, ensure_ascii=False, indent=2))
if os.environ.get('IMSJ_TEST_REPORT'):
    Path(os.environ['IMSJ_TEST_REPORT']).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
