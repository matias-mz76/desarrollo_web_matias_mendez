document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/estadisticas')
        .then(response => {
            if (!response.ok) {
                throw new Error('La respuesta de la red no fue exitosa');
            }
            return response.json();
        })
        .then(data => {
            crearGraficoActividadesPorDia(data.actividadesPorDia);
            crearGraficoActividadesPorTema(data.actividadesPorTema);
            crearGraficoActividadesPorJornada(data.actividadesPorJornada);
        })
        .catch(error => {
            console.error('Error al cargar datos para estadísticas:', error);
            document.querySelector('.stats-container').innerHTML = '<p>Error al cargar los gráficos.</p>';
        });
});


function crearGraficoActividadesPorDia(datos) {
    const ctx = document.getElementById('actividadesPorDiaChart');
    if (!ctx || !datos || datos.labels.length === 0) return;
    new Chart(ctx, { type: 'line', data: { labels: datos.labels, datasets: [{ label: 'Nº Actividades', data: datos.data, borderColor: '#3498db', tension: 0.1 }] } });
}

function crearGraficoActividadesPorTema(datos) {
    const ctx = document.getElementById('actividadesPorTemaChart');
    if (!ctx || !datos || datos.labels.length === 0) return;
    new Chart(ctx, { type: 'pie', data: { labels: datos.labels, datasets: [{ data: datos.data, backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'] }] } });
}

function crearGraficoActividadesPorJornada(datos) {
    const ctx = document.getElementById('actividadesPorJornadaChart');
    if (!ctx || !datos || datos.labels.length === 0) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datos.labels,
            datasets: [
                { label: 'Mañana', data: datos.manana_data, backgroundColor: '#FFCE56' },
                { label: 'Mediodía', data: datos.mediodia_data, backgroundColor: '#4BC0C0' },
                { label: 'Tarde', data: datos.tarde_data, backgroundColor: '#9966FF' }
            ]
        },
        options: { scales: { x: { stacked: false }, y: { stacked: false } } }
    });
}