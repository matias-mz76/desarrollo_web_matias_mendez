from flask import Flask, render_template
from flask import request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask import request

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://cc5002:programacionweb@localhost/tarea2?charset=utf8mb4'

db = SQLAlchemy(app)

# Modelos
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
    fotos = db.relationship('Foto', backref='actividad', lazy=True)
    temas = db.relationship('ActividadTema', backref='actividad', lazy=True)

class Foto(db.Model):
    __tablename__ = 'foto'
    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)

class ActividadTema(db.Model):
    __tablename__ = 'actividad_tema'
    id = db.Column(db.Integer, primary_key=True)
    tema = db.Column(db.Enum('música', 'deporte', 'ciencias', 'religión', 'política', 
                            'tecnología', 'juegos', 'baile', 'comida', 'otro', 
                            name='tema_enum'), nullable=False)
    glosa_otro = db.Column(db.String(15))
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)


@app.route('/')
def portada():
    actividades = Actividad.query.order_by(Actividad.id.desc()).limit(5).all()
    return render_template('portada.html', actividades=actividades)


@app.route('/agregar-actividad', methods=['GET', 'POST'])
def agregar_actividad():
    if request.method == 'POST':
        region = request.form['region']
        comuna = request.form['comuna']
        sector = request.form['sector']
        nombre = request.form['nombre']
        email = request.form['email']
        telefono = request.form['telefono']
        dia_hora_inicio = request.form['inicio']
        dia_hora_termino = request.form.get('termino', None)
        descripcion = request.form['descripcion']
        temas = request.form.getlist('temas[]')
        fotos = request.files.getlist('fotos[]')
        
        if not region or not comuna or not nombre or not email:
            return 'Faltan datos obligatorios', 400

       
        # buscamos la comuna para encontrar su id
        comuna_obj = Comuna.query.filter_by(nombre=comuna).first()
        actividad = Actividad(comuna_id=comuna_obj.id, sector=sector, nombre=nombre, email=email, celular=telefono, 
                              dia_hora_inicio=dia_hora_inicio, dia_hora_termino=dia_hora_termino, descripcion=descripcion)
        db.session.add(actividad)
        db.session.commit()

        # agrega temas a la actividad
        for tema in temas:
            if tema == 'otro':
                otro_tema = request.form.get('otro-tema-input', None)
                actividad_tema = ActividadTema(actividad_id=actividad.id, tema=tema, glosa_otro=otro_tema)
            else:
                actividad_tema = ActividadTema(actividad_id=actividad.id, tema=tema)
            db.session.add(actividad_tema)
        db.session.commit()

        # agregar fotos a la actividad
        for foto in fotos:
            if foto.filename != '':
                foto.save(os.path.join('static/images', foto.filename))
                foto_obj = Foto(actividad_id=actividad.id, ruta_archivo='images/' + foto.filename, nombre_archivo=foto.filename)
                db.session.add(foto_obj)
        db.session.commit()

        # Agregar contactos a la actividad
        medios_de_contacto = ['whatsapp', 'instagram', 'telegram', 'tiktok', 'X']
        for medio in medios_de_contacto:
            valor = request.form.get(medio, None)
            if valor:
                contactar_por = ContactarPor(actividad_id=actividad.id, nombre=medio, identificador=valor)
                db.session.add(contactar_por)
        db.session.commit()

        return redirect(url_for('portada'))

    # Obtener regiones y comunas para el formulario
    regiones = Region.query.all()
    return render_template('agregar-actividad.html', regiones=regiones)

@app.route('/ver-actividades')
def ver_actividades():
    page = request.args.get('page', 1, type=int)
    actividades_pagina = Actividad.query.order_by(Actividad.id.desc()).paginate(page=page, per_page=5)
    return render_template('ver-actividades.html', actividades=actividades_pagina.items, pagination=actividades_pagina)

@app.route('/estadisticas')
def ver_estadisticas():
    return render_template('ver-estadisticas.html')

if __name__ == '__main__':
    app.run(debug=True)