// ==========================================
// CONFIGURACIÓN INICIAL Y ESTADO GLOBAL
// ==========================================
const defaultStations = [
    { name: "Aspen Radio 102.3", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/ASPEN.mp3", api_url: "", tags: "Classics", favorite: false },
    { name: "Infobae 97.1", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/INFOBAE.mp3", api_url: "", tags: "News", favorite: false },
    { name: "Public Radio (NPR)", url: "https://npr-ice.streamguys1.com/live.mp3", api_url: "", tags: "News", favorite: false },
    { name: "Radio Swiss Classic", url: "https://stream.srg-ssr.ch/m/rsc_de/mp3_128", api_url: "", tags: "Classical", favorite: false },
    { name: "Chillhop Radio (Lo-Fi)", url: "http://stream.zeno.fm/f3wvbbqmdg8uv", api_url: "", tags: "Lo-Fi", favorite: false },
    { name: "Ambient Sleeping Pill", url: "http://radio.stereoscenic.com/asp-s", api_url: "", tags: "Ambient", favorite: false },
    { name: "BBC World Service", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service", api_url: "", tags: "News", favorite: false }
];

let favoriteStations = [];
let currentIndex = -1;
let allStations = []; // Para el JSON gigante de 600 emisoras

// Elementos del DOM
const listElement = document.getElementById('station-list');
const audioPlayer = document.getElementById('audio-player');
const statusText = document.getElementById('status');
const currentStationText = document.getElementById('current-station');
const nowPlayingText = document.getElementById('now-playing');
const volumeSlider = document.getElementById('volume-slider');
const volumeText = document.getElementById('volume-text');
const themeSelect = document.getElementById('theme-select');

// ==========================================
// INICIALIZACIÓN
// ==========================================
async function initApp() {
    // 1. Cargar favoritos o defaults
    const saved = localStorage.getItem('favorites');
    if (saved && JSON.parse(saved).length > 0) {
        favoriteStations = JSON.parse(saved);
    } else {
        favoriteStations = [...defaultStations];
        saveStations();
    }

    // 2. Cargar el JSON maestro para el buscador
    try {
        const response = await fetch("estacioneslimpias.json");
        allStations = await response.json();
    } catch (error) {
        console.warn("> ADVERTENCIA: No se pudo cargar la lista de estaciones");
    }

    // 3. Cargar Tema Guardado
    let savedTheme = localStorage.getItem('webradio_theme') || 'mocha';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeSelect) themeSelect.value = savedTheme;

    renderStations();
    loadVolume();
}

window.onload = initApp;

function saveStations() {
    localStorage.setItem('favorites', JSON.stringify(favoriteStations));
}

function renderStations() {
    listElement.innerHTML = '';

    // Ordenamos: primero las favoritas, pero guardamos el índice original para no romper la reproducción
    const displayOrder = favoriteStations.map((station, index) => {
        return { ...station, originalIndex: index };
    }).sort((a, b) => (b.favorite === true) - (a.favorite === true));

    displayOrder.forEach((station) => {
        const index = station.originalIndex;

        let li = document.createElement('li');
        li.className = 'station-item';
        if (index === currentIndex) li.classList.add('active-station');
        if (station.favorite) li.classList.add('is-favorite');

        // Botón Corazón
        let favSpan = document.createElement('span');
        favSpan.className = `fav-btn ${station.favorite ? 'active' : ''}`;
        favSpan.textContent = station.favorite ? '♥' : '♡';
        favSpan.onclick = (e) => { e.stopPropagation(); toggleFavorite(index); };

        // Texto de la emisora
        let textSpan = document.createElement('span');
        textSpan.className = 'station-text';
        textSpan.textContent = `${(index + 1).toString().padStart(2, '0')} - ${station.name}`;
        textSpan.onclick = () => selectStation(index);

        // Botones de Acción
        let actionDiv = document.createElement('div');
        
        let editBtn = document.createElement('button');
        editBtn.style.color = "var(--green)";
        editBtn.className = 'action-btn btn-edit';
        editBtn.textContent = '[E]';
        editBtn.onclick = (e) => { e.stopPropagation(); editStation(index); };

        let deleteBtn = document.createElement('button');
        deleteBtn.style.color = "var(--red)";
        deleteBtn.className = 'action-btn btn-delete';
        deleteBtn.textContent = '[X]';
        deleteBtn.onclick = (e) => { e.stopPropagation(); deleteStation(index); };

        actionDiv.appendChild(editBtn);
        actionDiv.appendChild(deleteBtn);

        li.appendChild(favSpan);
        li.appendChild(textSpan);
        li.appendChild(actionDiv);

        listElement.appendChild(li);
    });
}
function selectStation(index) {
    currentIndex = index;
    const station = favoriteStations[index];
    
    // Detenemos antes de cambiar la fuente
    audioPlayer.pause();
    audioPlayer.src = station.url;
    currentStationText.textContent = station.name;
    
    renderStations();
    
    // Pequeño delay para que el navegador procese el cambio de URL
    setTimeout(() => {
        playRadio();
    }, 100);
}

let marqueeTimer = null;
let sessionStartTime = null;

function playRadio() {
    if (!audioPlayer.src || audioPlayer.src === "") {
        alert("> EXCEPCIÓN: Ninguna emisora seleccionada.");
        return;
    }

    statusText.textContent = "Conectando...";
    statusText.style.color = "var(--blue)";
    nowPlayingText.textContent = "[ Estableciendo conexión TCP... ]";

    audioPlayer.play().then(() => {
        statusText.textContent = "En Línea";
        statusText.style.color = "var(--green)";
        
        // Iniciamos el cronómetro de la sesión
        sessionStartTime = Date.now();
        
        // Iniciamos la marquesina (actualización cada 1 segundo)
        if (marqueeTimer) clearInterval(marqueeTimer);
        updateMarquee();
        marqueeTimer = setInterval(updateMarquee, 1000);

    }).catch(err => {
        statusText.textContent = "Error";
        statusText.style.color = "var(--red)";
        console.error("Fallo al reproducir:", err);
    });
}

function stopRadio() {
    audioPlayer.pause();
    statusText.textContent = "Detenido";
    statusText.style.color = "var(--subtext0)";
    nowPlayingText.textContent = "[ -- ]";
    if (marqueeTimer) clearInterval(marqueeTimer);
}

function updateMarquee() {
    const stationName = currentStationText.textContent;
    
    // 1. Hora Actual (Sistema)
    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    // 2. Tiempo de Escucha (Uptime)
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    const uptimeStr = `${h}:${m}:${s}`;

  
    // 4. Actualización del Texto
    nowPlayingText.textContent = `${stationName}   >>   STATUS: OK   >>`;
}

// Control por Barra Espaciadora actualizado
document.addEventListener('keydown', function (event) {
    if (event.target.tagName.toLowerCase() === 'input') return;
    if (event.code === 'Space') {
        event.preventDefault();
        if (audioPlayer.paused) {
            // Si hay algo cargado (sea de la lista o una pre-escucha), dale play. Si no, pon la estación 0.
            if (audioPlayer.getAttribute('src')) {
                playRadio();
            } else {
                selectStation(0);
            }
        } else {
            stopRadio();
        }
    }
});


// Control por Barra Espaciadora
document.addEventListener('keydown', function (event) {
    if (event.target.tagName.toLowerCase() === 'input') return;
    if (event.code === 'Space') {
        event.preventDefault();
        audioPlayer.paused ? (currentIndex !== -1 ? playRadio() : selectStation(0)) : stopRadio();
    }
});

// ==========================================
// GESTIÓN DE LA LISTA
// ==========================================
function toggleFavorite(index) {
    favoriteStations[index].favorite = !favoriteStations[index].favorite;
    saveStations();
    renderStations();
}

function editStation(index) {
    const station = favoriteStations[index];
    const newName = prompt("> EDITAR NOMBRE:", station.name);
    if (newName === null) return;
    const newUrl = prompt("> EDITAR URL:", station.url);
    if (newUrl === null) return;

    if (newName.trim() && newUrl.trim()) {
        favoriteStations[index].name = newName.trim();
        favoriteStations[index].url = newUrl.trim();
        saveStations();
        if (currentIndex === index) {
            currentStationText.textContent = favoriteStations[index].name;
            audioPlayer.src = favoriteStations[index].url;
            playRadio();
        }
        renderStations();
    }
}

function deleteStation(index) {
    if (confirm(`¿Eliminar [ ${favoriteStations[index].name} ]?`)) {
        favoriteStations.splice(index, 1);
        if (currentIndex === index) { stopRadio(); currentIndex = -1; currentStationText.textContent = "Ninguno"; } 
        else if (currentIndex > index) { currentIndex--; }
        saveStations();
        renderStations();
    }
}

// ==========================================
// BUSCADOR EN EL JSON
// ==========================================
document.getElementById("search-input").addEventListener("input", e => {
    const query = e.target.value.toLowerCase();
    const container = document.getElementById("search-results");
    
    if (query.length < 3) {
        container.innerHTML = "";
        return;
    }

    // Lista negra (HTML5 no lee playlists)
    const extensionesInvalidas = ['.pls', '.m3u', '.asx'];

    const results = allStations.filter(s => {
        const url = s.url_stream.toLowerCase();
        const esInvalida = extensionesInvalidas.some(ext => url.endsWith(ext));
        const coincideBusqueda = s.name.toLowerCase().includes(query) || 
                                 (s.iso_3166_1 && s.iso_3166_1.toLowerCase().includes(query));

        return !esInvalida && coincideBusqueda;
    }).slice(0, 15);

    container.innerHTML = "";
    results.forEach(station => {
        const exists = favoriteStations.some(f => f.url === station.url_stream);
        
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.padding = "5px 0";
        div.style.borderBottom = "1px dashed var(--surface2)";
        div.style.alignItems = "center";
        
        // Generación dinámica de los botones
        let actionButton = exists 
            ? `<button class="action-btn" style="color: var(--red)" onclick='removeFromSearch(${JSON.stringify(station.url_stream)})'>[&nbsp;- Quitar&nbsp; ]</button>`
            : `<button class="action-btn" style="color: var(--green)" onclick='addFromSearch(${JSON.stringify(station.name)}, ${JSON.stringify(station.url_stream)})'>[ + Agregar ]</button>`;

        div.innerHTML = `
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; padding-right: 15px;" title="${station.name}">
                ${station.name} <em>(${station.iso_3166_1 || '??'})</em>
            </span>
            <div style="display: flex; gap: 10px; flex-shrink: 0;">
                <button class="action-btn" style="color: var(--blue)" 
                        onclick='previewFromSearch(${JSON.stringify(station.name)}, ${JSON.stringify(station.url_stream)})'>
                    [ Escuchar ]
                </button>
                ${actionButton}
            </div>
        `;
        container.appendChild(div);
    });
});

// Función para pre-escuchar sin guardar
window.previewFromSearch = function(name, url) {
    currentIndex = -1;
    renderStations();
    audioPlayer.src = url;
    currentStationText.textContent = `${name} (Preview)`;
    playRadio();
};

// Función para guardar
window.addFromSearch = function(name, url) {
    favoriteStations.push({ name: name, url: url, favorite: false });
    saveStations();
    renderStations();
    document.getElementById("search-input").dispatchEvent(new Event('input')); // Refresca el botón
};

// Función para quitar desde el buscador
window.removeFromSearch = function(url) {
    const index = favoriteStations.findIndex(s => s.url === url);
    if (index !== -1) {
        favoriteStations.splice(index, 1);
        
        // Prevenir que la radio siga sonando si justo borramos la emisora activa de la lista
        if (currentIndex === index) { 
            stopRadio(); 
            currentIndex = -1; 
            currentStationText.textContent = "Ninguno"; 
        } else if (currentIndex > index) { 
            currentIndex--; 
        }

        saveStations();
        renderStations();
        document.getElementById("search-input").dispatchEvent(new Event('input')); // Refresca el botón de nuevo a [+ Agregar]
    }
};

// Función para pre-escuchar sin guardar
window.previewFromSearch = function(name, url) {
    currentIndex = -1; // Deseleccionamos cualquier radio de la lista principal
    renderStations();  // Actualizamos la lista visual (para que se quite el resaltado azul)
    
    audioPlayer.src = url;
    currentStationText.textContent = `${name} (Preview)`; // Le ponemos la etiqueta preview
    
    playRadio(); // Ejecutamos la radio
};

// Función para guardar
window.addFromSearch = function(name, url) {
    favoriteStations.push({ name: name, url: url, favorite: false });
    saveStations();
    renderStations();
    document.getElementById("search-input").dispatchEvent(new Event('input')); // Refresca el botón
};

// ==========================================
// IMPORTAR / EXPORTAR
// ==========================================
function exportStations() {
    const dataStr = JSON.stringify(favoriteStations, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "hyradio_backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importStations(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                favoriteStations = importedData;
                saveStations();
                stopRadio();
                currentIndex = -1;
                currentStationText.textContent = "Ninguno";
                renderStations();
                alert("> ÉXITO: Lista importada.");
            }
        } catch (error) { alert("> EXCEPCIÓN: Archivo inválido."); }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ==========================================
// UTILIDADES (Volumen y Tema)
// ==========================================
function loadVolume() {
    let savedVolume = localStorage.getItem('webradio_volume') || 0.5;
    audioPlayer.volume = savedVolume;
    volumeSlider.value = savedVolume;
    updateVolumeText();
}

volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
    localStorage.setItem('webradio_volume', e.target.value);
    updateVolumeText();
});

function updateVolumeText() {
    volumeText.textContent = `[ ${Math.round(volumeSlider.value * 100).toString().padStart(3, ' ')}% ]`;
}

function changeTheme() {
    const newTheme = themeSelect.value;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('webradio_theme', newTheme);
}