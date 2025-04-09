document.addEventListener('DOMContentLoaded', () => {
    const activityImages = document.querySelectorAll('.activity-image');
    activityImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation(); // evitar que el clickeo en la imagen active la fila
            showImage(img);
        });
        img.style.cursor = 'pointer';
    });
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => showActivityDetail(row));
    });
});

function showActivityDetail(row) {
    //datos de la fila
    const cells = row.cells;
    const activityData = {
        inicio: cells[0].textContent,
        termino: cells[1].textContent,
        comuna: cells[2].textContent,
        sector: cells[3].textContent,
        tema: cells[4].textContent,
        nombre: cells[5].textContent,
        imagenes: Array.from(cells[6].getElementsByTagName('img')).map(img => img.src)
    };

    const detailView = document.createElement('div');
    detailView.style.padding = '20px';
    detailView.style.backgroundColor = '#fff';
    detailView.style.maxWidth = '800px';
    detailView.style.margin = '0 auto';

    //HTML para los detalles
    detailView.innerHTML = `
        <h2>${activityData.tema}</h2>
        <div class="activity-details">
            <p><strong>Organizador:</strong> ${activityData.nombre}</p>
            <p><strong>Fecha de inicio:</strong> ${activityData.inicio}</p>
            <p><strong>Fecha de término:</strong> ${activityData.termino !== '-' ? activityData.termino : 'No especificado'}</p>
            <p><strong>Comuna:</strong> ${activityData.comuna}</p>
            <p><strong>Sector:</strong> ${activityData.sector}</p>
            
            <h3>Imágenes de la actividad:</h3>
            <div class="activity-images" style="display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0;">
                ${activityData.imagenes.map(src => `
                    <img src="${src}" alt="Foto de actividad" 
                         style="width: 200px; height: 150px; object-fit: cover; cursor: pointer;"
                         class="activity-image">
                `).join('')}
            </div>
            
            <div style="margin-top: 20px;">
                <button onclick="window.location.reload()" style="margin-right: 10px; padding: 10px 20px;">
                    Volver al listado
                </button>
                <button onclick="window.location.href='/html/portada.html'" style="padding: 10px 20px;">
                    Ir a la portada
                </button>
            </div>
        </div>
    `;

    // Guarda el contenido original
    const originalContent = document.body.innerHTML;

    // Reemplazar el contenido de la página
    document.body.innerHTML = '';
    document.body.appendChild(detailView);

    // Reactivar la funcionalidad de las imágenes en la vista detallada
    const detailImages = document.querySelectorAll('.activity-image');
    detailImages.forEach(img => {
        img.addEventListener('click', () => showImage(img));
    });
}

function showImage(img) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    //imagen ampliada con tamaño fijo de 800x600
    const largeImg = document.createElement('img');
    largeImg.src = img.src;
    largeImg.style.width = '800px';
    largeImg.style.height = '600px';
    largeImg.style.objectFit = 'contain';

    // botón de cierre
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = '#fff';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';

    //para cerrar el overlay
    const closeOverlay = () => {
        document.body.removeChild(overlay);
    };

    // añadir evento al botón de cierre
    closeButton.addEventListener('click', closeOverlay);

    // añadir elementos al overlay
    overlay.appendChild(largeImg);
    overlay.appendChild(closeButton);
    
    // añadir overlay al body
    document.body.appendChild(overlay);
}