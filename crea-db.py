import pymysql

connection = None
try:
    connection = pymysql.connect(
        host="localhost",
        user="cc5002",
        password="programacionweb",
        charset='utf8mb4'
    )
    with open('sql/tarea2.sql', 'r', encoding='utf-8') as f:
        with connection.cursor() as cursor:
            for line in f.read().split(';'):
                if line.strip():
                    cursor.execute(line)

    connection.commit()
    print("Base de datos tarea2 creada.")
    print(f"Agregando regiones y comunas!!")
    
    # Abrimos el archivo region-comuna
    with open('sql/region-comuna.sql', 'r', encoding='utf-8') as f:
        with connection.cursor() as cursor:
            # Leemos el contenido completo del archivo y lo dividimos por ';'
            # para ejecutar cada comando SQL por separado
            sql_commands = f.read().split(';')
            for command in sql_commands:
                if command.strip():
                    cursor.execute(command)
    
    # Guardamos los datos insertados en la base de datos
    connection.commit()
    print("Tablas 'region' y 'comuna' llenadas!!")

    
    print("Agregando tabla 'comentario'!!")
    with open('sql/tabla-comentario.sql', 'r', encoding='utf-8') as f:
        with connection.cursor() as cursor:
            sql_content = f.read()
            if sql_content.strip():
                cursor.execute(sql_content)

    connection.commit()
    print("Tabla 'comentario' creada!!")

except pymysql.Error as e:
    print(f"Error al ejecutar el archivo: {e}")
    if connection:
        connection.rollback()
finally:
    if connection:
        connection.close()

