# =======================================================
# === IMPORTACIONES NECESARIAS
# =======================================================
from flask import Flask, jsonify, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import case, desc, func
from werkzeug.utils import secure_filename
import os
import datetime
import re 

app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://cc5002:programacionweb@localhost/tarea2?charset=utf8mb4'
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'images')


db = SQLAlchemy(app)

class Region(db.Model):
    __tablename__ = 'region'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    comunas = db.relationship('Comuna', backref='region', lazy=True)

class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)

class Actividad(db.Model):
    __tablename__ = 'actividad'
    id = db.Column(db.Integer, primary_key=True)
    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)
    sector = db.Column(db.String(100))
    nombre = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    celular = db.Column(db.String(15))
    dia_hora_inicio = db.Column(db.DateTime, nullable=False)
    dia_hora_termino = db.Column(db.DateTime)
    descripcion = db.Column(db.String(500))
    comuna = db.relationship('Comuna', backref='actividades')
    fotos = db.relationship('Foto', backref='actividad', lazy=True, cascade="all, delete-orphan")
    temas = db.relationship('ActividadTema', backref='actividad', lazy=True, cascade="all, delete-orphan")
    contactos = db.relationship('ContactarPor', backref='actividad', lazy=True, cascade="all, delete-orphan")
    # nueva tabla comentarios
    comentarios = db.relationship('Comentario', backref='actividad', lazy=True, cascade="all, delete-orphan")

class Foto(db.Model):
    __tablename__ = 'foto'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), primary_key=True, nullable=False)

class ActividadTema(db.Model):
    __tablename__ = 'actividad_tema'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tema = db.Column(db.Enum('música', 'deporte', 'ciencias', 'religión', 'política',
                            'tecnología', 'juegos', 'baile', 'comida', 'otro',
                            name='tema_enum'), nullable=False)
    glosa_otro = db.Column(db.String(15))
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), primary_key=True, nullable=False)

class ContactarPor(db.Model):
    __tablename__ = 'contactar_por'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.Enum('whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra', name='contactar_nombre_enum'), nullable=False)
    identificador = db.Column(db.String(150), nullable=False)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), primary_key=True, nullable=False)

class Comentario(db.Model):
    __tablename__ = 'comentario'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)
    texto = db.Column(db.String(300), nullable=False)
    fecha = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)
    


@app.route('/')
def portada():
    actividades = Actividad.query.order_by(Actividad.id.desc()).limit(5).all()
    return render_template('portada.html', actividades=actividades)


@app.route('/agregar-actividad', methods=['GET', 'POST'])
def agregar_actividad():
    # Manejo de la página de exito
    if request.method == 'GET' and request.args.get('status') == 'success':
        flash('Hemos recibido su información, muchas gracias y suerte en su actividad.', 'success')

    errors = {}
    regiones = Region.query.order_by(Region.nombre).all()
    comunas_de_region = []
    
    # Lógica para procesar el envío del formulario (POST)
    if request.method == 'POST':
        region_nombre = request.form.get('region')
        comuna_nombre = request.form.get('comuna')
        sector = request.form.get('sector', '')
        comuna_obj = None # Inicializar
        region_obj = Region.query.filter_by(nombre=region_nombre).first()

        if not region_obj:
            errors['region'] = 'Debe seleccionar una región.'
        else:
            if not comuna_nombre:
                errors['comuna'] = 'Debe seleccionar una comuna.'
            else:
                comuna_obj = Comuna.query.filter_by(nombre=comuna_nombre).first()
                if not comuna_obj:
                    errors['comuna'] = 'La comuna seleccionada no es válida.'

        if len(sector) > 100:
            errors['sector'] = 'El sector no puede tener más de 100 caracteres.'
        nombre = request.form.get('nombre', '')
        email = request.form.get('email', '')
        telefono = request.form.get('telefono', '')

        if not nombre: errors['nombre'] = 'El nombre del organizador es obligatorio.'

        elif len(nombre) > 200: errors['nombre'] = 'El nombre no puede exceder los 200 caracteres.'

        if not email: errors['email'] = 'El email es obligatorio.'

        elif not re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email): errors['email'] = 'Formato de email no válido.'

        if telefono and not re.match(r"^(\+569\s?)?\d{4}\s?\d{4}$", telefono): errors['telefono'] = 'Formato de celular no válido.'

        medios_de_contacto_posibles = ['whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra']

        for medio in medios_de_contacto_posibles:
            valor = request.form.get(medio, '')
            # La validación se aplica solo si el usuario ha ingresado algo en ese campo
            if valor and (len(valor) < 4 or len(valor) > 50):
                errors['contactar_por'] = 'Todos los campos de contacto deben tener entre 4 y 50 caracteres.'
                break 

        inicio_str = request.form.get('inicio')
        termino_str = request.form.get('termino')
        descripcion = request.form.get('descripcion', '')
        inicio_dt, termino_dt = None, None

        if not inicio_str: errors['inicio'] = 'La fecha y hora de inicio es obligatoria.'
        else:
            try: inicio_dt = datetime.datetime.fromisoformat(inicio_str)
            except ValueError: errors['inicio'] = 'Formato de fecha de inicio no válido.'
        if termino_str:
            try:
                termino_dt = datetime.datetime.fromisoformat(termino_str)
                if inicio_dt and termino_dt <= inicio_dt: errors['termino'] = 'La fecha de término debe ser posterior a la de inicio.'
            except ValueError: errors['termino'] = 'Formato de fecha de término no válido.'
        if len(descripcion) > 500: errors['descripcion'] = 'La descripción no puede exceder los 500 caracteres.'

        temas = request.form.getlist('temas[]')
        otro_tema = request.form.get('otro-tema-input', '')

        if not temas: errors['temas'] = 'Debe seleccionar al menos un tema.'
        elif 'otro' in temas and (not otro_tema or len(otro_tema) < 3 or len(otro_tema) > 15):
            errors['otro-tema-input'] = "Si selecciona 'Otro', debe especificar un tema (3-15 caracteres)."
            
        fotos = request.files.getlist('fotos[]')
        if not fotos or not fotos[0].filename: errors['fotos'] = 'Debe subir al menos una foto.'
        elif len(fotos) > 5: errors['fotos'] = 'No puede subir más de 5 fotos.'
        else:
            for foto in fotos:
                if foto.filename != '' and ('.' not in foto.filename or foto.filename.rsplit('.', 1)[1].lower() not in {'png', 'jpg', 'jpeg', 'gif',  'jfif'}):
                    errors['fotos'] = f'Formato de archivo no permitido en: {foto.filename}.'
                    break

        if errors:
            flash('Por favor, corrige los errores indicados.', 'danger')
            if region_nombre:
                region_obj = Region.query.filter_by(nombre=region_nombre).first()
                if region_obj: comunas_de_region = region_obj.comunas
            return render_template('agregar-actividad.html', errors=errors, request=request, regiones=regiones, comunas_de_region=comunas_de_region)
        else:
            try:
                # Si no hay errores, procedemos a guardar
                nueva_actividad = Actividad(comuna_id=comuna_obj.id, sector=sector, nombre=nombre, email=email, celular=telefono, dia_hora_inicio=inicio_dt, dia_hora_termino=termino_dt, descripcion=descripcion)
                db.session.add(nueva_actividad)
                db.session.flush()

                for tema in temas:
                    tema_obj = ActividadTema(actividad_id=nueva_actividad.id, tema=tema, glosa_otro=otro_tema if tema == 'otro' else None)
                    db.session.add(tema_obj)
                
                for foto in fotos:
                    if foto.filename:
                        filename = secure_filename(foto.filename)
                        foto.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                        foto_obj = Foto(
                            actividad_id=nueva_actividad.id, 
                            ruta_archivo='images/' + filename,
                            nombre_archivo=filename
)
                        db.session.add(foto_obj)

                for medio in medios_de_contacto_posibles:
                    if valor := request.form.get(medio):
                        contacto_obj = ContactarPor(
                            actividad_id = nueva_actividad.id,
                            nombre=medio,
                            identificador=valor
                        )
                        db.session.add(contacto_obj)

                db.session.commit()
                flash('Actividad registrada con éxito. Muchas gracias!!', 'success')
                return redirect(url_for('portada'))
                
            except Exception as e:
                db.session.rollback()
                flash(f"Ocurrió un error inesperado al guardar los datos: {e}", 'danger')

    return render_template('agregar-actividad.html', errors={}, regiones=regiones, comunas_de_region=comunas_de_region)



@app.route('/ver-actividades')
def ver_actividades():
    page = request.args.get('page', 1, type=int)
    pagination_obj = Actividad.query.order_by(Actividad.id.desc()).paginate(
        page=page, per_page=5, error_out=False
    )
    actividades_procesadas = []
    
    for actividad in pagination_obj.items:
        # Por cada objeto actividad, creamos un diccionario a mano
        act_dict = {
            'id': actividad.id,
            'nombre': actividad.nombre,
            'email': actividad.email,
            'celular': actividad.celular,
            'descripcion': actividad.descripcion,
            'dia_hora_inicio': actividad.dia_hora_inicio,
            'dia_hora_termino': actividad.dia_hora_termino,
            'comuna_nombre': actividad.comuna.nombre,
            'region_nombre': actividad.comuna.region.nombre,
            'sector': actividad.sector,
            'fotos': [{'ruta_archivo': f.ruta_archivo} for f in actividad.fotos],
            'temas': [{'tema': t.tema, 'glosa_otro': t.glosa_otro} for t in actividad.temas],
            'contactos': [{'nombre': c.nombre, 'identificador': c.identificador} for c in actividad.contactos]
        }
        actividades_procesadas.append(act_dict)

    return render_template(
        'ver-actividades.html', 
        pagination=pagination_obj, 
        actividades_data=actividades_procesadas
    )

@app.route('/ver-estadisticas')
def ver_estadisticas():
    return render_template('ver-estadisticas.html')

@app.route('/api/estadisticas')
def api_estadisticas():
    try:
        #  Gráfico Actividades por Día 
        act_por_dia = db.session.query(
            func.date(Actividad.dia_hora_inicio).label('fecha'),
            func.count(Actividad.id).label('cantidad')
        ).group_by(func.date(Actividad.dia_hora_inicio)).order_by(func.date(Actividad.dia_hora_inicio)).all()
        
        grafico_lineas = {
            'labels': [item.fecha.strftime('%d-%m-%Y') for item in act_por_dia],
            'data': [item.cantidad for item in act_por_dia]
        }

        # Gráfico torta Actividades por Tema 
        act_por_tema = db.session.query(
            ActividadTema.tema,
            func.count(ActividadTema.id).label('cantidad')
        ).group_by(ActividadTema.tema).order_by(func.count(ActividadTema.id).desc()).all()

        grafico_torta = {
            'labels': [item.tema.capitalize() for item in act_por_tema],
            'data': [item.cantidad for item in act_por_tema]
        }
    
        # Grafico Actividades por Jornada al Mes-
        act_por_jornada = db.session.query(
            func.DATE_FORMAT(Actividad.dia_hora_inicio, '%Y-%m').label('mes'),
            func.sum(case((func.HOUR(Actividad.dia_hora_inicio).between(6, 11), 1), else_=0)).label('manana'),
            func.sum(case((func.HOUR(Actividad.dia_hora_inicio).between(12, 16), 1), else_=0)).label('mediodia'),
            func.sum(case((func.HOUR(Actividad.dia_hora_inicio).between(17, 23), 1), else_=0)).label('tarde')
        ).group_by('mes').order_by('mes').all()
    
        grafico_barras = {
            'labels': [item.mes for item in act_por_jornada],
            'manana_data': [item.manana or 0 for item in act_por_jornada], 
            'mediodia_data': [item.mediodia or 0 for item in act_por_jornada],
            'tarde_data': [item.tarde or 0 for item in act_por_jornada]
        }
    
        return jsonify({
            'actividadesPorDia': grafico_lineas,
            'actividadesPorTema': grafico_torta,
            'actividadesPorJornada': grafico_barras
        })
        
    except Exception as e:
        # Imprime el error completo en la consola 
        import traceback
        print("Error generando estadísticas:")
        traceback.print_exc()
        # Devolvemos un error 500  para que el frontend pueda manejarlo
        return jsonify({'error': 'Ocurrió un error en el servidor al generar los datos'}), 500
    
    
@app.route('/api/actividades/<int:actividad_id>/comentarios', methods=['GET'])
def obtener_comentarios(actividad_id):
    actividad = Actividad.query.get_or_404(actividad_id)
    comentarios = Comentario.query.filter_by(actividad_id=actividad.id).order_by(desc(Comentario.fecha)).all()
    lista_comentarios = [
        {'autor': c.nombre, 'texto': c.texto, 'fecha': c.fecha.isoformat() + 'Z'}
        for c in comentarios
    ]
    return jsonify(lista_comentarios)

@app.route('/api/actividades/<int:actividad_id>/comentarios', methods=['POST'])
def agregar_comentario(actividad_id):
    actividad = Actividad.query.get_or_404(actividad_id)
    data = request.get_json()
    nombre_autor = data.get('nombre')
    texto_comentario = data.get('texto')
    errors = {}

    if not nombre_autor or len(nombre_autor.strip()) < 3 or len(nombre_autor.strip()) > 80:
        errors['nombre'] = 'El nombre es obligatorio y debe tener entre 3 y 80 caracteres.'
    if not texto_comentario or len(texto_comentario.strip()) < 5 or len(texto_comentario.strip()) > 300:
        errors['texto'] = 'El comentario es obligatorio y debe tener entre 5 y 300 caracteres.'
    
    if errors:
        return jsonify({'status': 'error', 'errors': errors}), 400

    nuevo_comentario = Comentario(
        nombre=nombre_autor.strip(),
        texto=texto_comentario.strip(),
        actividad_id=actividad.id
    )
    db.session.add(nuevo_comentario)
    db.session.commit()

    comentario_data = {
        'autor': nuevo_comentario.nombre,
        'texto': nuevo_comentario.texto,
        'fecha': nuevo_comentario.fecha.isoformat() + 'Z'
    }
    return jsonify({'status': 'success', 'comentario': comentario_data}), 201

if __name__ == '__main__':
    app.run(debug=True)