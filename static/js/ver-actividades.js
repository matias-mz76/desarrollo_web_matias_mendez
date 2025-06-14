document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fila-actividad').forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => showActivityDetail(row));
    });
});

/**
 * Función principal para construir y mostrar la vista de detalle completa.
 */
function showActivityDetail(row) {
    // Ocultar la tabla principal y la paginación
    const tabla = document.getElementById('tabla-actividades');
    if (tabla) tabla.style.display = 'none';
    const pagination = document.getElementById('paginacion');
    if (pagination) pagination.style.display = 'none';

    
    // Leer todos los datos de los atributos data-*
    const dataset = row.dataset;
    const actividadId = dataset.id; 
    const nombre = dataset.nombre;
    const descripcion = dataset.descripcion;
    const email = dataset.email;
    const celular = dataset.celular;
    const inicio = dataset.inicioCompleto;
    const termino = dataset.terminoCompleto;
    const ubicacion = dataset.ubicacion;
    const sector = dataset.sector;
    const temas = JSON.parse(dataset.temasJson || '[]');
    const contactos = JSON.parse(dataset.contactosJson || '[]');
    const fotos = JSON.parse(dataset.fotosJson || '[]');

    // Obtener el contenedor del detalle y asegurarse de que esté limpio
    const detalleContainer = document.getElementById('detalle-container');
    detalleContainer.innerHTML = ''; 

    // Construir y añadir el contenido del detalle completo
    const detalleDiv = document.createElement('div');
    detalleDiv.className = 'detalle-actividad';
    
    detalleDiv.innerHTML = `
        <header class="detalle-header">
            <h2>Información Detallada de la Actividad</h2>
        </header>


        <div class="detalle-grid">
            <section class="detalle-info">
                <h4>Detalles de la Actividad</h4>
                <ul>
                <li><strong>Descripción </strong>${descripcion || 'No hay descripción disponible para esta actividad.'}</li>
                    <li><strong>Ubicación:</strong> ${ubicacion}</li>
                    ${sector ? `<li><strong>Sector:</strong> ${sector}</li>` : ''}
                    <li><strong>Inicio:</strong> ${inicio}</li>
                    ${termino ? `<li><strong>Término:</strong> ${termino}</li>` : ''}
                </ul>
            </section>
            <section class="detalle-info">
                <h4>Contacto del Organizador</h4>
                <ul>
                    <li><strong>Organizador:</strong> ${nombre}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    ${celular ? `<li><strong>Celular:</strong> ${celular}</li>` : ''}
                    ${contactos.map(c => `<li><strong>${c.nombre.charAt(0).toUpperCase() + c.nombre.slice(1)}:</strong> ${c.identificador}</li>`).join('')}
                </ul>
            </section>
        </div>

        <section class="detalle-extra">
            <h4>Temas de la Actividad</h4>
            <ul class="temas-lista">
                ${temas.length > 0 ? temas.map(t => `<li>${(t.tema === 'otro' ? t.glosa_otro : t.tema).charAt(0).toUpperCase() + (t.tema === 'otro' ? t.glosa_otro : t.tema).slice(1)}</li>`).join('') : '<li>No hay temas asociados.</li>'}
            </ul>
        </section>
        
        <section class="detalle-fotos">
            <h3>Galería de Fotos</h3>
            <div class="galeria">
                ${fotos.length > 0 ? fotos.map(foto => 
                    `<img src="${window.location.origin}/static/${foto.ruta_archivo}" 
                          alt="Foto de la actividad" 
                          class="foto-galeria" 
                          style="width: 320px; height: 240px; object-fit: cover; cursor: pointer;">`
                ).join('') : '<p>No hay fotos para esta actividad.</p>'}
            </div>
        </section>
      
        <section class="comentarios-seccion">
            <h3>Comentarios</h3>
            <div id="lista-comentarios"><p>Cargando comentarios...</p></div>
            <form id="form-comentario" novalidate>
                <h4>Deja tu comentario</h4>
                <div id="form-errors" class="form-errors" style="display:none;"></div>
                <div class="form-group">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" required minlength="3" maxlength="80">
                </div>
                <div class="form-group">
                    <label for="texto">Comentario:</label>
                    <textarea id="texto" name="texto" required minlength="5" maxlength="300" rows="4" cols="50"></textarea>
                </div>
                <button type="submit" class="submit-comment-btn">Agregar comentario</button>
            </form>
        </section>

        <footer class="detalle-footer">
            <button id="volver-al-listado-btn" class="back-button">← Volver al Listado</button>
    
        </footer>
    `;
    detalleContainer.appendChild(detalleDiv);
    
    detalleDiv.querySelector('#volver-al-listado-btn').addEventListener('click', () => {
        detalleContainer.innerHTML = '';
        if (tabla) tabla.style.display = '';
        if (pagination) pagination.style.display = '';
    });

    detalleDiv.querySelectorAll('.foto-galeria').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            showImageModal(img.src);
        });
    });
    cargarYMostrarComentarios(actividadId);
    activarFormularioComentarios(actividadId);
}

function activarFormularioComentarios(actividadId) {
    const form = document.getElementById('form-comentario');
    const errorContainer = document.getElementById('form-errors');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        const autorInput = document.getElementById('nombre');
        const textoInput = document.getElementById('texto');
        const autor = autorInput.value.trim();
        const texto = textoInput.value.trim();

        let clientErrors = [];
        if (autor.length < 3 || autor.length > 80) {
            clientErrors.push('El nombre debe tener entre 3 y 80 caracteres.');
        }
        if (texto.length < 5 || texto.length > 300) {
            clientErrors.push('El comentario debe tener entre 5 y 300 caracteres.');
        }

        if (clientErrors.length > 0) {
            errorContainer.innerHTML = clientErrors.join('<br>');
            errorContainer.style.display = 'block';
            return;
        }

        errorContainer.style.display = 'none'; 

        // Petición asíncrona con Fetch al backend
        try {
            const response = await fetch(`/api/actividades/${actividadId}/comentarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: autor, texto: texto })
            });

            const result = await response.json();

            if (!response.ok) { // Si el servidor devuelve un error (ej: 400)
                let serverErrors = Object.values(result.errors).join('<br>');
                errorContainer.innerHTML = serverErrors;
                errorContainer.style.display = 'block';
            } else { // Si el servidor devuelve éxito
                agregarComentarioALista(result.comentario, true); // Añadir el nuevo comentario a la lista
                form.reset(); // Limpiar el formulario
            }
        } catch (error) {
            errorContainer.innerHTML = 'Ocurrió un error de red. Inténtalo de nuevo.';
            errorContainer.style.display = 'block';
        }
    });
}

async function cargarYMostrarComentarios(actividadId) {
    const listaComentariosDiv = document.getElementById('lista-comentarios');
    try {
        const response = await fetch(`/api/actividades/${actividadId}/comentarios`);
        if (!response.ok) throw new Error('Error al cargar comentarios.');
        const comentarios = await response.json();

        listaComentariosDiv.innerHTML = ''; 

        if (comentarios.length === 0) {
            listaComentariosDiv.innerHTML = '<p id="no-comments-msg">Aún no hay comentarios. ¡Sé el primero en comentar!</p>';
        } else {
            comentarios.forEach(comentario => agregarComentarioALista(comentario, false));
        }
    } catch (error) {
        listaComentariosDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}


function agregarComentarioALista(comentario, esNuevo) {
    const listaComentariosDiv = document.getElementById('lista-comentarios');
    
    // Si se esta añadiendo un nuevo comentario y el mensaje de "no hay comentarios" está presente, lo quitamos.
    if (esNuevo) {
        const noCommentsMsg = document.getElementById('no-comments-msg');
        if (noCommentsMsg) {
            noCommentsMsg.remove();
        }
    }

    const comentarioItem = document.createElement('div');
    comentarioItem.className = 'comentario-item';

    const fechaUTC = new Date(comentario.fecha);
    const formateador = new Intl.DateTimeFormat('es-CL', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric'
    });
    const fechaLocalFormateada = formateador.format(fechaUTC);
    
    comentarioItem.innerHTML = `
        <p class="comentario-autor"><strong>${comentario.autor}</strong> comentó el ${fechaLocalFormateada}:</p>
        <p class="comentario-texto">${comentario.texto}</p>
    `;

    if (esNuevo) {
        // Añade el nuevo comentario al principio de la lista.
        listaComentariosDiv.prepend(comentarioItem);
    } else {
        // Añade los comentarios existentes al final de la lista.
        listaComentariosDiv.appendChild(comentarioItem);
    }
}
/**
 * Muestra una imagen ampliada en un overlay.
 */
function showImageModal(src) {
    if (document.querySelector('.image-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';

    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const largeImg = document.createElement('img');
    largeImg.src = src;
    largeImg.style.maxWidth = '800px';
    largeImg.style.maxHeight = '600px';
    largeImg.style.width = 'auto';
    largeImg.style.height = 'auto';
    largeImg.style.boxShadow = '0 0 25px rgba(0,0,0,0.5)';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cerrar';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.fontSize = '1rem';
    closeButton.style.backgroundColor = 'white';
    closeButton.style.color = 'black';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';

    const close = () => document.body.removeChild(overlay);
    closeButton.addEventListener('click', close);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            close();
        }
    });

    overlay.appendChild(largeImg);
    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);
}