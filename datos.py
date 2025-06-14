from app import app, db, Actividad, Foto, ActividadTema, ContactarPor
from datetime import datetime

def agrega_datos():
    print("Eliminando datos antiguos...")
    ContactarPor.query.delete()
    ActividadTema.query.delete()
    Foto.query.delete()
    Actividad.query.delete()
    db.session.commit()
    print("Datos antiguos eliminados.!!")

    print("Creando nuevas actividades,,,")

    actividad1 = Actividad(
        comuna_id=130208,
        sector='Plaza Concha y Toro',
        nombre='Tyler Durden',
        email='club@pelea.cl',
        celular='+56912345678',
        dia_hora_inicio=datetime.strptime('2025-03-28 02:00:00', '%Y-%m-%d %H:%M:%S'),
        dia_hora_termino=None,
        descripcion='Club de la pelea en Plaza Concha y Toro'
    )

    actividad2 = Actividad(
        comuna_id=130208,
        sector='Beauchef 850, Sala F10',
        nombre='Sofía Coppola',
        email='club@cine.cl',
        celular='+56912345679',
        dia_hora_inicio=datetime.strptime('2025-03-27 17:00:00', '%Y-%m-%d %H:%M:%S'),
        dia_hora_termino=datetime.strptime('2025-03-27 20:00:00', '%Y-%m-%d %H:%M:%S'),
        descripcion='Club de cine en Beauchef'
    )

    actividad3 = Actividad(
        comuna_id=130207,
        sector='Parque Bustamante',
        nombre='Martín Pedales',
        email='bici@evento.cl',
        celular='+56912345680',
        dia_hora_inicio=datetime.strptime('2025-04-05 09:00:00', '%Y-%m-%d %H:%M:%S'),
        dia_hora_termino=datetime.strptime('2025-04-05 12:00:00', '%Y-%m-%d %H:%M:%S'),
        descripcion='Bicicletada en Parque Bustamante'
    )

    actividad4 = Actividad(
        comuna_id=130210,
        sector='Afueras del Estadio Nacional',
        nombre='MC Flow',
        email='rap@batalla.cl',
        celular='+56912345681',
        dia_hora_inicio=datetime.strptime('2025-04-12 16:00:00', '%Y-%m-%d %H:%M:%S'),
        dia_hora_termino=datetime.strptime('2025-04-12 20:00:00', '%Y-%m-%d %H:%M:%S'),
        descripcion='Batalla de rap en Estadio Nacional'
    )

    actividad5 = Actividad(
        comuna_id=130208,
        sector='Beauchef 850, Sala S21',
        nombre='Clara Melodía',
        email='orquesta@universidad.cl',
        celular='+56912345682',
        dia_hora_inicio=datetime.strptime('2025-04-19 16:00:00', '%Y-%m-%d %H:%M:%S'),
        dia_hora_termino=datetime.strptime('2025-04-19 20:00:00', '%Y-%m-%d %H:%M:%S'),
        descripcion='Orquesta Universitaria en Beauchef'
    )

    actividad6 = Actividad(
        comuna_id=130208,
        sector='Biblioteca Nicanor Parra',
        nombre='Guido Snake',
        email='taller.python@udp.cl',
        celular='+56987654321',
        dia_hora_inicio=datetime.strptime('2025-05-10 10:00:00', '%Y-%m-%d %H:%M:%S'),
        dia_hora_termino=datetime.strptime('2025-05-10 13:00:00', '%Y-%m-%d %H:%M:%S'),
        descripcion='Taller gratuito para aprender las bases de la programación con Python.'
    )

    actividad7 = Actividad(
        comuna_id=130207,
        sector='Barrio Italia',
        nombre='Julia Sazón',
        email='sabores@feria.com',
        celular='+56987654322',
        dia_hora_inicio=datetime.strptime('2025-05-18 12:00:00', '%Y-%m-%d %H:%M:%S'),
        dia_hora_termino=datetime.strptime('2025-05-18 21:00:00', '%Y-%m-%d %H:%M:%S'),
        descripcion='Descubre platos típicos de más de 10 países en un solo lugar.'
    )

    actividad8 = Actividad(
        comuna_id=130210,
        sector='Plaza Ñuñoa',
        nombre='Tomás Tablero',
        email='juegos@nunoa.cl',
        celular='+56987654323',
        dia_hora_inicio=datetime.strptime('2025-05-24 19:00:00', '%Y-%m-%d %H:%M:%S'),
        dia_hora_termino=None,
        descripcion='Trae tus juegos o únete a una partida. ¡Para todas las edades!'
    )

    actividad9 = Actividad(
        comuna_id=130208,
        sector='Centro Cultural La Moneda',
        nombre='José Maza',
        email='ciencia@cclm.cl',
        celular='+56987654324',
        dia_hora_inicio=datetime.strptime('2025-06-01 19:30:00', '%Y-%m-%d %H:%M:%S'),
        dia_hora_termino=datetime.strptime('2025-06-01 20:30:00', '%Y-%m-%d %H:%M:%S'),
        descripcion='Charla dictada por el astrónomo José Maza.'
    )

    actividad10 = Actividad(
        comuna_id=130207,
        sector='Parque de las Esculturas',
        nombre='Carla Rítmica',
        email='salsa.parque@baile.cl',
        celular='+56987654325',
        dia_hora_inicio=datetime.strptime('2025-06-07 17:00:00', '%Y-%m-%d %H:%M:%S'),
        dia_hora_termino=datetime.strptime('2025-06-07 18:30:00', '%Y-%m-%d %H:%M:%S'),
        descripcion='Ven a aprender los pasos básicos de la salsa en un ambiente amigable.'
    )

    print("Asociando fotos, temas y contactos a las actividades...")

    actividad1.fotos.append(Foto(ruta_archivo='images/pelea.jfif', nombre_archivo='pelea.jfif'))
    actividad1.temas.append(ActividadTema(tema='deporte'))
    actividad1.contactos.append(ContactarPor(nombre='whatsapp', identificador='+56912345678'))
    actividad1.contactos.append(ContactarPor(nombre='instagram', identificador='@clubpelea'))

    actividad2.fotos.append(Foto(ruta_archivo='images/cine.jfif', nombre_archivo='cine.jfif'))
    actividad2.temas.append(ActividadTema(tema='otro', glosa_otro='Cine'))
    actividad2.contactos.append(ContactarPor(nombre='instagram', identificador='@clubcinebch'))
    actividad2.contactos.append(ContactarPor(nombre='telegram', identificador='@cineclubfcfm'))
    actividad2.contactos.append(ContactarPor(nombre='whatsapp', identificador='+56912345679'))

    actividad3.fotos.append(Foto(ruta_archivo='images/bicicleta.jfif', nombre_archivo='bicicleta.jfif'))
    actividad3.temas.append(ActividadTema(tema='deporte'))
    actividad3.contactos.append(ContactarPor(nombre='instagram', identificador='@bicicletadastgo'))
    actividad3.contactos.append(ContactarPor(nombre='whatsapp', identificador='+56912345680'))
    actividad3.contactos.append(ContactarPor(nombre='X', identificador='@bicicletada_stgo'))

    actividad4.fotos.append(Foto(ruta_archivo='images/batallarap.jfif', nombre_archivo='batallarap.jfif'))
    actividad4.temas.append(ActividadTema(tema='música'))
    actividad4.contactos.append(ContactarPor(nombre='instagram', identificador='@batallasrapchile'))
    actividad4.contactos.append(ContactarPor(nombre='tiktok', identificador='@batallarapchile'))
    actividad4.contactos.append(ContactarPor(nombre='whatsapp', identificador='+56912345681'))

    actividad5.fotos.append(Foto(ruta_archivo='images/orquesta.jfif', nombre_archivo='orquesta.jfif'))
    actividad5.temas.append(ActividadTema(tema='música'))
    actividad5.contactos.append(ContactarPor(nombre='instagram', identificador='@orquestau'))
    actividad5.contactos.append(ContactarPor(nombre='whatsapp', identificador='+56912345682'))
    actividad5.contactos.append(ContactarPor(nombre='X', identificador='@orquestauniversitaria'))

    actividad6.temas.append(ActividadTema(tema='tecnología'))
    actividad6.contactos.append(ContactarPor(nombre='telegram', identificador='@tallerpythonudp'))
    actividad6.contactos.append(ContactarPor(nombre='whatsapp', identificador='+56987654321'))

    actividad7.temas.append(ActividadTema(tema='comida'))
    actividad7.contactos.append(ContactarPor(nombre='instagram', identificador='@saboresdelmundo.feria'))
    actividad7.contactos.append(ContactarPor(nombre='tiktok', identificador='@feriasabores'))

    actividad8.temas.append(ActividadTema(tema='juegos'))
    actividad8.contactos.append(ContactarPor(nombre='whatsapp', identificador='+56987654323'))

    actividad9.temas.append(ActividadTema(tema='ciencias'))
    actividad9.contactos.append(ContactarPor(nombre='X', identificador='@cclm_ciencia'))
    actividad9.contactos.append(ContactarPor(nombre='instagram', identificador='@cclm_ciencia'))

    actividad10.temas.append(ActividadTema(tema='baile'))
    actividad10.contactos.append(ContactarPor(nombre='whatsapp', identificador='+56987654325'))
    actividad10.contactos.append(ContactarPor(nombre='instagram', identificador='@salsaenelparque'))

    print("Guardando en la base de datos...")
    db.session.add_all([
        actividad1, actividad2, actividad3, actividad4, actividad5,
        actividad6, actividad7, actividad8, actividad9, actividad10
    ])

    db.session.commit()
    print("Se agregaron los datos con éxito!")


if __name__ == '__main__':
    with app.app_context():
        agrega_datos()
