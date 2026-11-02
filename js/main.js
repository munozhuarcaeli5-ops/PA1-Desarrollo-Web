/**
 * ==============================================================================
 * APEX MOTORSPORT - LÓGICA PRINCIPAL (VANILLA JAVASCRIPT)
 * ==============================================================================
 * Funcionalidades obligatorias:
 * 1. Filtro Dinámico de Noticias por categoría (data-category) sin recargar página.
 * 2. Temporizador Matemático de Cuenta Regresiva (Countdown) actualizado con setInterval.
 * 3. Renderizado Dinámico de la Tabla de Posiciones F1 (Top 5 incluyendo a Max Verstappen).
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de módulos
    initCategoryFilter();
    initCountdownTimer();
    renderStandingsTable();
});

/* 1. FILTRO DINÁMICO DE NOTICIAS */
/**
 * Escucha los clics en los botones de categoría del Navbar y filtra los artículos
 * manipulando su visibilidad en el DOM según el atributo `data-category`.
 */
function initCategoryFilter() {
    const filterButtons = document.querySelectorAll('#categoryFilters .filter-btn');
    const newsCards = document.querySelectorAll('.news-card');
    const articlesCountSpan = document.getElementById('articlesCount');
    const noResultsBox = document.getElementById('noResultsMessage');
    const navbarCollapse = document.getElementById('navbarMotorsport');

    if (!filterButtons.length || !newsCards.length) {
        console.warn('Elementos de filtro o tarjetas no encontrados en el DOM.');
        return;
    }

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();

            // 1.1 Gestionar clases activas en los botones de filtrado
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            // 1.2 Obtener la categoría seleccionada ('all', 'f1', 'wrc', 'motogp')
            const selectedCategory = btn.getAttribute('data-category');
            let visibleCount = 0;

            // 1.3 Iterar sobre cada tarjeta de noticia y aplicar filtrado
            newsCards.forEach((card) => {
                const cardCategory = card.getAttribute('data-category');

                // Si la categoría es 'all' o coincide con la del artículo
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'flex';
                    // Reiniciar animación para una transición visual suave
                    card.classList.remove('card-fade-in');
                    void card.offsetWidth; // Forzar reflow para reiniciar la animación CSS
                    card.classList.add('card-fade-in');
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                    card.classList.remove('card-fade-in');
                }
            });

            // 1.4 Actualizar el contador de artículos visibles en la interfaz
            if (articlesCountSpan) {
                articlesCountSpan.textContent = visibleCount;
            }

            // 1.5 Mostrar u ocultar mensaje en caso de no haber resultados
            if (noResultsBox) {
                if (visibleCount === 0) {
                    noResultsBox.classList.remove('d-none');
                } else {
                    noResultsBox.classList.add('d-none');
                }
            }

            // 1.6 En dispositivos móviles, colapsar el menú al seleccionar una opción
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
}

/* ==============================================================================
   2. TEMPORIZADOR MATEMÁTICO DE CUENTA REGRESIVA (COUNTDOWN)
   ============================================================================== */
/**
 * Calcula matemáticamente la diferencia en Días, Horas, Minutos y Segundos
 * hacia un evento futuro ficticio y actualiza el DOM cada segundo con setInterval.
 */
function initCountdownTimer() {
    const daysEl = document.getElementById('countdownDays');
    const hoursEl = document.getElementById('countdownHours');
    const minutesEl = document.getElementById('countdownMinutes');
    const secondsEl = document.getElementById('countdownSeconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
        console.warn('Elementos del temporizador no encontrados en el DOM.');
        return;
    }

    /**
     * Obtiene una fecha objetivo siempre en el futuro.
     * Para que la evaluación académica no caduque nunca, si la fecha guardada
     * expira, proyecta dinámicamente el próximo Gran Premio 14 días hacia adelante.
     */
    function getFutureEventDate() {
        const STORAGE_KEY = 'apex_event_target_timestamp';
        const now = Date.now();
        let targetTimestamp = parseInt(localStorage.getItem(STORAGE_KEY), 10);

        // Si no existe o ya venció, fijar a 14 días, 18 horas y 30 minutos a partir de hoy
        if (!targetTimestamp || targetTimestamp <= now) {
            const futureDate = new Date(now + (14 * 24 * 60 * 60 * 1000) + (18 * 60 * 60 * 1000) + (30 * 60 * 1000));
            targetTimestamp = futureDate.getTime();
            localStorage.setItem(STORAGE_KEY, targetTimestamp.toString());
        }

        return targetTimestamp;
    }

    const targetTime = getFutureEventDate();

    function updateCountdown() {
        const currentTime = Date.now();
        const difference = targetTime - currentTime;

        // Si se alcanza el tiempo cero o negativo
        if (difference <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        // Fórmulas matemáticas de conversión de milisegundos
        const totalSeconds = Math.floor(difference / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        // Formateo con ceros a la izquierda (2 dígitos)
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Ejecución inmediata inicial para evitar retraso visual de 1 segundo
    updateCountdown();

    // Actualización recurrente cada segundo
    setInterval(updateCountdown, 1000);
}

/* ==============================================================================
   3. RENDERIZADO DINÁMICO DE DATOS (TABLA DE POSICIONES F1)
   ============================================================================== */
/**
 * Array de objetos con el Top 5 del Campeonato Mundial de Pilotos (incluye a Max Verstappen).
 */
const driversStandingsData = [
    { pos: 1, driver: "Max Verstappen", team: "Red Bull Racing", points: 393, country: "NED" },
    { pos: 2, driver: "Lando Norris", team: "McLaren F1 Team", points: 331, country: "GBR" },
    { pos: 3, driver: "Charles Leclerc", team: "Scuderia Ferrari", points: 307, country: "MON" },
    { pos: 4, driver: "Oscar Piastri", team: "McLaren F1 Team", points: 262, country: "AUS" },
    { pos: 5, driver: "Carlos Sainz", team: "Scuderia Ferrari", points: 244, country: "ESP" }
];

/**
 * Itera sobre el array de pilotos, crea dinámicamente las etiquetas <tr> y <td>,
 * y las inyecta en el <tbody> de la tabla de posiciones.
 */
function renderStandingsTable() {
    const tableBody = document.getElementById('standingsBody');

    if (!tableBody) {
        console.warn('Contenedor tbody "standingsBody" no encontrado en el DOM.');
        return;
    }

    // Limpiar contenido previo para prevenir duplicados
    tableBody.innerHTML = '';

    // Iteración sobre los datos
    driversStandingsData.forEach((item) => {
        // Crear elemento fila de tabla (<tr>)
        const tr = document.createElement('tr');

        // Resaltar de manera especial al líder del campeonato (Posición 1)
        if (item.pos === 1) {
            tr.classList.add('standings-row-p1');
        }

        // Definir clase de estilo según la posición
        let posClass = 'pos-badge';
        if (item.pos === 1) posClass += ' pos-p1';
        else if (item.pos === 2) posClass += ' pos-p2';
        else if (item.pos === 3) posClass += ' pos-p3';

        // Estructura interna de celdas (<td>)
        tr.innerHTML = `
            <td class="text-center">
                <span class="${posClass}">${item.pos}</span>
            </td>
            <td>
                <div class="driver-info">
                    <span class="driver-name">${item.driver}</span>
                    <span class="driver-country">${item.country}</span>
                </div>
            </td>
            <td>
                <span class="team-name">${item.team}</span>
            </td>
            <td class="text-end">
                <span class="points-pill">${item.points}</span>
            </td>
        `;

        // Inyectar fila en el DOM
        tableBody.appendChild(tr);
    });
}
