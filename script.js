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
let allStations = []; // Json
let draggedIndex = null; // Drag & Drop
let sortTimeout = null;

// DOM
const listElement = document.getElementById('station-list');
const audioPlayer = document.getElementById('audio-player');
const statusText = document.getElementById('status');
const currentStationText = document.getElementById('current-station');
const volumeSlider = document.getElementById('volume-slider');
const volumeText = document.getElementById('volume-text');
const themeSelect = document.getElementById('theme-select');
const streamBadge = document.getElementById('stream-badge');
const streamStatusText = document.getElementById('stream-status-text');

async function initApp() {
    // Carga de favoritos o defaults
    const saved = localStorage.getItem('favorites');
    if (saved && JSON.parse(saved).length > 0) {
        favoriteStations = JSON.parse(saved);
    } else {
        favoriteStations = [...defaultStations];
        saveStations();
    }

    // Carga del JSON principal para el buscador
    try {
        const response = await fetch("estacioneslimpias.json");
        allStations = await response.json();
    } catch (error) {
        console.warn("> ADVERTENCIA: No se pudo cargar la lista de estaciones");
    }

    // Carga del tema elegido
    let savedTheme = localStorage.getItem('webradio_theme') || 'rose-gold';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeSelect) themeSelect.value = savedTheme;

    renderStations();
    loadVolume();
}

window.onload = initApp;

function saveStations() {
    localStorage.setItem('favorites', JSON.stringify(favoriteStations));
}

function reorderStations(fromIndex, toIndex) {
    const movedItem = favoriteStations.splice(fromIndex, 1)[0];
    favoriteStations.splice(toIndex, 0, movedItem);

    if (currentIndex === fromIndex) {
        currentIndex = toIndex;
    } else if (currentIndex > fromIndex && currentIndex <= toIndex) {
        currentIndex--;
    } else if (currentIndex < fromIndex && currentIndex >= toIndex) {
        currentIndex++;
    }

    saveStations();
    renderStations();
}

function renderStations() {
    listElement.innerHTML = '';

    favoriteStations.forEach((station, index) => {
        const stationColor = station.color || 'none';

        let li = document.createElement('li');
        li.className = 'station-item';
        li.draggable = true;

        if (index === currentIndex) li.classList.add('active-station');

        // Drag & Drop
        li.addEventListener('dragstart', (e) => {
            draggedIndex = index;
            e.dataTransfer.effectAllowed = 'move';
            li.classList.add('is-dragging');
        });

        li.addEventListener('dragover', (e) => {
            if (draggedIndex !== null) {
                const draggedColor = favoriteStations[draggedIndex].color || 'none';
                if (draggedColor === stationColor) {
                    e.preventDefault(); 
                    e.dataTransfer.dropEffect = 'move';
                    li.style.borderTop = "2px dashed var(--blue)";
                }
            }
        });

        li.addEventListener('dragleave', () => {
            li.style.borderTop = "";
        });

        li.addEventListener('drop', (e) => {
            e.preventDefault();
            li.style.borderTop = "";
            const targetIndex = index;

            if (draggedIndex !== null && draggedIndex !== targetIndex) {
                reorderStations(draggedIndex, targetIndex);
            }
        });

        li.addEventListener('dragend', () => {
            draggedIndex = null;
            li.classList.remove('is-dragging');
        });
        
        // Badge
        let badgeSpan = document.createElement('span');
        badgeSpan.className = `badge-color badge-${stationColor}`;
        badgeSpan.onclick = (e) => { e.stopPropagation(); toggleBadge(index, badgeSpan); };

        let textSpan = document.createElement('span');
        textSpan.className = 'station-text';
        textSpan.textContent = `${(index + 1).toString().padStart(2, '0')}. ${station.name}`;
        textSpan.onclick = () => selectStation(index);

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

        li.appendChild(badgeSpan);
        li.appendChild(textSpan);
        li.appendChild(actionDiv);

        listElement.appendChild(li);
    });
}

function selectStation(index) {
    currentIndex = index;
    const station = favoriteStations[index];
    
    audioPlayer.pause();
    audioPlayer.src = station.url;
    currentStationText.textContent = station.name;
    
    renderStations();
    
    setTimeout(() => {
        playRadio();
    }, 100);
}

function playRadio() {
    if (!audioPlayer.src || audioPlayer.src === "") {
        alert("> EXCEPCIÓN: Ninguna emisora seleccionada.");
        return;
    }

    setStreamState('connecting');

    audioPlayer.play().catch(err => {
        setStreamState('error');
        console.error("Fallo al reproducir:", err);
    });
    
    const stopBtn = document.getElementById("stop-btn");
    if (stopBtn) stopBtn.classList.add("is-playing");
}

function stopRadio() {
    audioPlayer.pause();
    setStreamState('stopped');
    const stopBtn = document.getElementById("stop-btn");
    if (stopBtn) stopBtn.classList.remove("is-playing");
}

// Sincronización de estados (pastilla izquierda y badge derecho)
function setStreamState(state) {
    if (streamBadge) {
        streamBadge.classList.remove('state-stopped', 'state-connecting', 'state-online', 'state-error');
    }

    switch (state) {
        case 'connecting':
            if (streamBadge) streamBadge.classList.add('state-connecting');
            if (streamStatusText) streamStatusText.textContent = 'CONECTANDO...';
            if (statusText) {
                statusText.textContent = "Conectando...";
                statusText.style.color = "var(--blue)";
            }
            break;

        case 'online':
            if (streamBadge) streamBadge.classList.add('state-online');
            if (streamStatusText) streamStatusText.textContent = 'EN LÍNEA';
            if (statusText) {
                statusText.textContent = "En Línea";
                statusText.style.color = "var(--green)";
            }
            break;

        case 'error':
            if (streamBadge) streamBadge.classList.add('state-error');
            if (streamStatusText) streamStatusText.textContent = 'ERROR';
            if (statusText) {
                statusText.textContent = "Error";
                statusText.style.color = "var(--red)";
            }
            break;

        case 'stopped':
        default:
            if (streamBadge) streamBadge.classList.add('state-stopped');
            if (streamStatusText) streamStatusText.textContent = 'DETENIDO';
            if (statusText) {
                statusText.textContent = "Detenido";
                statusText.style.color = "var(--subtext0)";
            }
            break;
    }
}

// Eventos nativos del reproductor
if (audioPlayer) {
    audioPlayer.addEventListener('loadstart', () => setStreamState('connecting'));
    audioPlayer.addEventListener('waiting', () => setStreamState('connecting'));
    audioPlayer.addEventListener('playing', () => setStreamState('online'));
    audioPlayer.addEventListener('pause', () => setStreamState('stopped'));
    audioPlayer.addEventListener('ended', () => setStreamState('stopped'));
    audioPlayer.addEventListener('error', () => setStreamState('error'));
}

// Control para barra espaciadora
document.addEventListener('keydown', function (event) {
    if (event.target.tagName.toLowerCase() === 'input') return;
    if (event.code === 'Space') {
        event.preventDefault();
        if (audioPlayer.paused) {
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
        if (currentIndex === index) { 
            stopRadio(); 
            currentIndex = -1; 
            currentStationText.textContent = "Ninguno"; 
        } else if (currentIndex > index) { 
            currentIndex--; 
        }
        saveStations();
        renderStations();
    }
}

// Buscador
const searchInput = document.getElementById("search-input");
if (searchInput) {
    searchInput.addEventListener("input", e => {
        const query = e.target.value.toLowerCase();
        const container = document.getElementById("search-results");
        
        if (query.length < 3) {
            container.innerHTML = "";
            return;
        }

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
}

window.removeFromSearch = function(url) {
    const index = favoriteStations.findIndex(s => s.url === url);
    if (index !== -1) {
        favoriteStations.splice(index, 1);
        
        if (currentIndex === index) { 
            stopRadio(); 
            currentIndex = -1; 
            currentStationText.textContent = "Ninguno"; 
        } else if (currentIndex > index) { 
            currentIndex--; 
        }

        saveStations();
        renderStations();
        const input = document.getElementById("search-input");
        if (input) input.dispatchEvent(new Event('input'));
    }
};

window.previewFromSearch = function(name, url) {
    currentIndex = -1; 
    renderStations();  
    
    audioPlayer.src = url;
    currentStationText.textContent = `${name} (Preview)`;
    
    playRadio(); 
};

window.addFromSearch = function(name, url) {
    favoriteStations.push({ name: name, url: url, favorite: false });
    saveStations();
    renderStations();
    const input = document.getElementById("search-input");
    if (input) input.dispatchEvent(new Event('input'));
};

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

function loadVolume() {
    let savedVolume = localStorage.getItem('webradio_volume') || 0.5;
    audioPlayer.volume = savedVolume;
    if (volumeSlider) {
        volumeSlider.value = savedVolume;
        updateVolumeText();
    }
}

if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value;
        localStorage.setItem('webradio_volume', e.target.value);
        updateVolumeText();
    });
}

function updateVolumeText() {
    if (volumeText && volumeSlider) {
        volumeText.textContent = `[ ${Math.round(volumeSlider.value * 100).toString().padStart(3, ' ')}% ]`;
    }
}

function changeTheme() {
    const newTheme = themeSelect.value;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('webradio_theme', newTheme);
}

function nextTheme() {
    const select = document.getElementById("theme-select");
    if (select.selectedIndex < select.options.length - 1) {
        select.selectedIndex++;
    } else {
        select.selectedIndex = 0; 
    }
    changeTheme();
}

function prevTheme() {
    const select = document.getElementById("theme-select");
    if (select.selectedIndex > 0) {
        select.selectedIndex--;
    } else {
        select.selectedIndex = select.options.length - 1; 
    }
    changeTheme();
}

window.buscarRadiosAlAzar = function() {
    const container = document.getElementById("search-results");
    
    if (allStations.length === 0) {
        container.innerHTML = "> [ERROR] La base de datos local aún no ha cargado.";
        return;
    }

    container.innerHTML = "> Buscando frecuencias estáticas...";

    const extensionesInvalidas = ['.pls', '.m3u', '.asx'];
    const validStations = allStations.filter(s => {
        const url = (s.url_stream || "").toLowerCase();
        return !extensionesInvalidas.some(ext => url.endsWith(ext));
    });

    const mezcladas = [...validStations].sort(() => 0.5 - Math.random());
    const resultados = mezcladas.slice(0, 25);

    container.innerHTML = "";
    resultados.forEach(station => {
        const exists = favoriteStations.some(f => f.url === station.url_stream);
        
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.padding = "5px 0";
        div.style.borderBottom = "1px dashed var(--surface2)";
        div.style.alignItems = "center";
        
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
};

function toggleBadge(index, badgeElement) {
    const cycle = ['none', 'red', 'blue', 'yellow'];
    const station = favoriteStations[index];
    const currentColor = station.color || 'none';
    
    const nextColorIndex = (cycle.indexOf(currentColor) + 1) % cycle.length;
    const newColor = cycle[nextColorIndex];
    
    station.color = newColor;
    saveStations();

    badgeElement.className = `badge-color badge-${newColor}`;

    clearTimeout(sortTimeout);

    sortTimeout = setTimeout(() => {
        const currentPlayingUrl = currentIndex !== -1 ? favoriteStations[currentIndex].url : null;
        
        const priority = { 'red': 1, 'blue': 2, 'yellow': 3, 'none': 4 };
        favoriteStations.sort((a, b) => {
            const pA = priority[a.color || 'none'];
            const pB = priority[b.color || 'none'];
            return pA - pB;
        });
        
        if (currentPlayingUrl) {
            currentIndex = favoriteStations.findIndex(s => s.url === currentPlayingUrl);
        }

        saveStations();
        renderStations(); 
    }, 1500); 
}

// ==========================================
// SECCIÓN: TEMPORIZADOR POMODORO & AUDIO DUCKING
// ==========================================

// 1. Archivo de audio para la campana/alarma (ajustá la ruta si difiere)
const alertAudio = new Audio('./assets/sounds/notificacion.mp3');
alertAudio.preload = 'auto';

// 2. Variables de estado del temporizador
let workTime = 20 * 60; // 20 min por defecto
let breakTime = 5 * 60;  // 5 min de descanso
let timeLeft = workTime;
let isRunning = false;
let isBreak = false;
let endTime = null;
let timerId = null;

// 3. Elementos del DOM del Pomodoro
const pomoDisplayTime = document.getElementById('pomo-time');
const pomoDisplayMode = document.getElementById('pomo-mode');
const pomoToggleBtn = document.getElementById('pomo-toggle');
const pomoResetBtn = document.getElementById('pomo-reset');
const pomoPresetBtns = document.querySelectorAll('.pomo-preset');
const pomoContainer = document.getElementById('pomodoro');
const pomoMinBtn = document.getElementById('pomo-min-btn');

// 4. Funciones de Audio Ducking (atenuación y restauración de volumen)
function fadeVolume(audioEl, targetVolume, duration = 400) {
    if (!audioEl) return Promise.resolve();

    return new Promise((resolve) => {
        const startVolume = audioEl.volume;
        const volumeDelta = targetVolume - startVolume;
        const startTime = performance.now();

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            audioEl.volume = Math.max(0, Math.min(1, startVolume + volumeDelta * progress));

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                audioEl.volume = targetVolume;
                resolve();
            }
        }

        requestAnimationFrame(step);
    });
}

async function triggerNotificationWithDucking() {
    // Si la radio está apagada o no hay audio, solo suena la campana
    if (!audioPlayer || audioPlayer.paused) {
        alertAudio.currentTime = 0;
        alertAudio.play().catch(() => {});
        return;
    }

    const originalVolume = audioPlayer.volume;
    const duckedVolume = Math.max(0.08, originalVolume * 0.25); // Baja al 25%

    // Atenúa la radio en 300 ms
    await fadeVolume(audioPlayer, duckedVolume, 300);

    // Reproduce la notificación
    alertAudio.currentTime = 0;
    try {
        await alertAudio.play();
    } catch (err) {
        console.warn("Fallo al reproducir audio de notificación:", err);
    }

    // Cuando termina el MP3, restaura el volumen de la radio gradualmente
    alertAudio.onended = () => {
        fadeVolume(audioPlayer, originalVolume, 500);
    };
}

// 5. Render y lógica de cuenta regresiva
function updatePomoDisplay() {
    if (!pomoDisplayTime) return;

    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');
    pomoDisplayTime.textContent = `${mins}:${secs}`;

    if (isRunning) {
        document.title = `(${mins}:${secs}) HyRadio`;
    }
}

function pomoTick() {
    const now = Date.now();
    const remaining = Math.round((endTime - now) / 1000);

    if (remaining <= 0) {
        triggerNotificationWithDucking();

        // Alterna entre foco y descanso
        isBreak = !isBreak;
        timeLeft = isBreak ? breakTime : workTime;

        if (pomoDisplayMode) {
            pomoDisplayMode.textContent = isBreak ? 'BREAK' : 'FOCUS';
            pomoDisplayMode.style.color = isBreak ? '#5cff8a' : '#ff5c5c';
        }

        endTime = Date.now() + timeLeft * 1000;
    } else {
        timeLeft = remaining;
    }

    updatePomoDisplay();
}

// 6. Listeners de control (Play/Pausa, Reset, Presets)
if (pomoToggleBtn) {
    pomoToggleBtn.addEventListener('click', () => {
        if (isRunning) {
            clearInterval(timerId);
            isRunning = false;
            pomoToggleBtn.textContent = '▶';
            pomoContainer.classList.remove('is-running'); // Vuelve al rojo
        } else {
            isRunning = true;
            endTime = Date.now() + timeLeft * 1000;
            timerId = setInterval(pomoTick, 250);
            pomoToggleBtn.textContent = '❚❚';
            pomoContainer.classList.add('is-running'); // Pasa al azul GitHub
        }
    });
}

if (pomoResetBtn) {
    pomoResetBtn.addEventListener('click', () => {
        clearInterval(timerId);
        isRunning = false;
        isBreak = false;
        timeLeft = workTime;

        // Quita los estados activos
        pomoContainer.classList.remove('is-running', 'is-break');

        if (pomoDisplayMode) {
            pomoDisplayMode.textContent = 'FOCUS';
        }

        if (pomoToggleBtn) pomoToggleBtn.textContent = '▶';
        document.title = 'HyRadio';
        updatePomoDisplay();
    });
}

// Selección de botones de tiempo (20m, 25m, 30m, 40m)
if (pomoPresetBtns.length > 0) {
    pomoPresetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pomoPresetBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            const mins = parseInt(btn.dataset.mins, 10);
            workTime = mins * 60;

            if (!isBreak) {
                clearInterval(timerId);
                isRunning = false;
                pomoContainer.classList.remove('is-running');
                if (pomoToggleBtn) pomoToggleBtn.textContent = '▶';
                timeLeft = workTime;
                updatePomoDisplay();
            }
        });
    });
}

// Botón colapsar / minimizar (si existe en el HTML)
if (pomoMinBtn && pomoContainer) {
    pomoMinBtn.addEventListener('click', () => {
        pomoContainer.classList.toggle('is-minimized');
        pomoMinBtn.textContent = pomoContainer.classList.contains('is-minimized') ? '+' : '–';
    });
}

function pomoTick() {
    const now = Date.now();
    const remaining = Math.round((endTime - now) / 1000);

    if (remaining <= 0) {
        triggerNotificationWithDucking();

        isBreak = !isBreak;
        timeLeft = isBreak ? breakTime : workTime;

        if (pomoDisplayMode) {
            pomoDisplayMode.textContent = isBreak ? 'BREAK' : 'FOCUS';
        }

        // Alterna la clase de descanso
        if (isBreak) {
            pomoContainer.classList.add('is-break');
        } else {
            pomoContainer.classList.remove('is-break');
        }

        endTime = Date.now() + timeLeft * 1000;
    } else {
        timeLeft = remaining;
    }

    updatePomoDisplay();
}

// Inicialización de pantalla al cargar
updatePomoDisplay();

