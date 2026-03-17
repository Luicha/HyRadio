const defaultStations = [
    // --- NACIONALES E INFORMATIVAS ---
    { name: "Aspen Radio 102.3", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/ASPEN.mp3", api_url: "" },
    { name: "Radio Madre", url: "http://cdn.instream.audio:9288/stream", api_url: "" },
    { name: "Radio Colonia", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/COLONIAAAC.aac", api_url: "" },
    { name: "Radio Argentina", url: "https://server.laradio.online:15224/live.mp3", api_url: "" },
    { name: "Radio Continental", url: "https://edge05.radiohdvivo.com/continental", api_url: "" },
    { name: "Infobae 97.1", url: " https://playerservices.streamtheworld.com/api/livestream-redirect/INFOBAE.mp3", api_url: "" },
    { name: "Public Radio (NPR)", url: "https://npr-ice.streamguys1.com/live.mp3", api_url: "" },

    // --- CONCENTRACIÓN Y ESTUDIO ---
    { name: "Radio Swiss Classic", url: "https://stream.srg-ssr.ch/m/rsc_de/mp3_128", api_url: "" },
    { name: "Chillhop Radio (Lo-Fi)", url: "http://stream.zeno.fm/f3wvbbqmdg8uv", api_url: "" },
    { name: "Ambient Sleeping Pill", url: "http://radio.stereoscenic.com/asp-s", api_url: "" },
    { name: "JazzGroove", url: "http://199.180.72.2:8015/listen.pls?sid=1", api_url: "" },

    // Estaciones de la BBC (Bloque Completo)
    { name: "BBC Radio 1", url: "http://lsn.lv/bbcradio.m3u8?station=bbc_radio_one&bitrate=96000", api_url: "" },
    { name: "BBC Radio 1Xtra", url: "hhttp://lsn.lv/bbcradio.m3u8?station=bbc_1xtra&bitrate=96000", api_url: "" },
    { name: "BBC Radio 2", url: "http://lsn.lv/bbcradio.m3u8?station=bbc_radio_two&bitrate=96000", api_url: "" },
    { name: "BBC Radio 3", url: "http://lsn.lv/bbcradio.m3u8?station=bbc_radio_three&bitrate=96000", api_url: "" },
    { name: "BBC Radio 4", url: "hhttp://lsn.lv/bbcradio.m3u8?station=bbc_radio_fourfm&bitrate=96000", api_url: "" },
    { name: "BBC Radio 4 Extra", url: "http://lsn.lv/bbcradio.m3u8?station=bbc_radio_four_extra&bitrate=96000", api_url: "" },
    { name: "BBC Radio 5 Live", url: "http://lsn.lv/bbcradio.m3u8?station=bbc_radio_five_live&bitrate=96000", api_url: "" },
    { name: "BBC Radio 6 Music", url: "http://lsn.lv/bbcradio.m3u8?station=bbc_6music&bitrate=96000", api_url: "" },
    { name: "BBC World Service", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service", api_url: "" },


    // --- RADIO PARADISE (Mixes) ---
    { name: "Radio Paradise - Main", url: "http://stream.radioparadise.com/aac-128", api_url: "" },
    { name: "Radio Paradise - Mellow", url: "http://stream.radioparadise.com/mellow-128", api_url: "" },
    { name: "Radio Paradise - Rock", url: "http://stream.radioparadise.com/rock-128", api_url: "" },
    { name: "Radio Paradise - Eclectic", url: "http://stream.radioparadise.com/eclectic-128", api_url: "" },
    
    // --- SOMAFM  ---
    { name: "SomaFM - Groove Salad", url: "https://ice1.somafm.com/groovesalad-128-mp3" },
    { name: "SomaFM - SomaFM Live", url: "https://ice2.somafm.com/live-128-aac", api_url: "https://somafm.com/songs/live.json" },
    { name: "SomaFM - Covers", url: "https://ice2.somafm.com/covers-128-aac", api_url: "https://somafm.com/songs/covers.json" },
    { name: "SomaFM - Drone Zone", url: "https://ice2.somafm.com/dronezone-128-aac", api_url: "https://somafm.com/songs/dronezone.json" },
    { name: "SomaFM - Deep Space One", url: "https://ice2.somafm.com/deepspaceone-128-aac", api_url: "https://somafm.com/songs/deepspaceone.json" },
    { name: "SomaFM - Indie Pop Rocks!", url: "https://ice2.somafm.com/indiepop-128-aac", api_url: "https://somafm.com/songs/indiepop.json" },
    { name: "SomaFM - Space Station Soma", url: "https://ice2.somafm.com/spacestation-128-aac", api_url: "https://somafm.com/songs/spacestation.json" },
    { name: "SomaFM - Secret Agent", url: "https://ice2.somafm.com/secretagent-128-aac", api_url: "https://somafm.com/songs/secretagent.json" },
    { name: "SomaFM - Lush", url: "https://ice2.somafm.com/lush-128-aac", api_url: "https://somafm.com/songs/lush.json" },
    { name: "SomaFM - Underground 80s", url: "https://ice2.somafm.com/u80s-128-aac", api_url: "https://somafm.com/songs/u80s.json" },
    { name: "SomaFM - Left Coast 70s", url: "https://ice2.somafm.com/seventies-128-aac", api_url: "https://somafm.com/songs/seventies.json" },
    { name: "SomaFM - DEF CON Radio", url: "https://ice2.somafm.com/defcon-128-aac", api_url: "https://somafm.com/songs/defcon.json" },
    { name: "SomaFM - Folk Forward", url: "https://ice2.somafm.com/folkfwd-128-aac", api_url: "https://somafm.com/songs/folkfwd.json" },
    { name: "SomaFM - The Trip", url: "https://ice2.somafm.com/thetrip-128-aac", api_url: "https://somafm.com/songs/thetrip.json" },
    { name: "SomaFM - Suburbs of Goa", url: "https://ice2.somafm.com/suburbsofgoa-128-aac", api_url: "https://somafm.com/songs/suburbsofgoa.json" },
    { name: "SomaFM - Seven Inch Soul", url: "https://ice2.somafm.com/7soul-128-aac", api_url: "https://somafm.com/songs/7soul.json" },
    { name: "SomaFM - Mission Control", url: "https://ice2.somafm.com/missioncontrol-128-aac", api_url: "https://somafm.com/songs/missioncontrol.json" },
    { name: "SomaFM - cliqhop idm", url: "https://ice2.somafm.com/cliqhop-128-aac", api_url: "https://somafm.com/songs/cliqhop.json" },
    { name: "SomaFM - Black Rock FM", url: "https://ice2.somafm.com/brfm-128-aac", api_url: "https://somafm.com/songs/brfm.json" },
    { name: "SomaFM - Doomed (Special)", url: "https://ice2.somafm.com/specials-128-aac", api_url: "https://somafm.com/songs/specials.json" },
    { name: "SomaFM - Metal Detector", url: "https://ice2.somafm.com/metal-128-aac", api_url: "https://somafm.com/songs/metal.json" }
];

// --- MOTOR DE MARQUESINA DINÁMICA ---
let displayTimer = null;

async function updateMarquee() {
    const station = stations[currentIndex];
    if (!station) return;

    // Si tiene API, buscamos la canción real
    if (station.api_url) {
        try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(station.api_url)}`;
            const response = await fetch(proxyUrl);
            const data = await response.json();
            const realData = JSON.parse(data.contents);

            if (realData.songs && realData.songs.length > 0) {
                const song = realData.songs[0];
                nowPlayingText.textContent = `♪ AHORA EN ${station.name.toUpperCase()}: ${song.artist} - ${song.title} ♪`;
                return;
            }
        } catch (e) {
            console.log("Error de API, usando frases...");
        }
    }

    // Si no tiene API o falla, usamos frases random
    const randomIndex = Math.floor(Math.random() * randomQuotes.length);
    nowPlayingText.textContent = randomQuotes[randomIndex];
}

function playRadio() {
    if (currentIndex === -1) return;
    audioPlayer.play();
    statusText.textContent = "Conectando...";
    
    audioPlayer.onplaying = () => {
        statusText.textContent = "En Línea";
        statusText.style.color = "var(--green)";
        
        updateMarquee();
        if (displayTimer) clearInterval(displayTimer);
        displayTimer = setInterval(updateMarquee, 20000); 
    };
}

let stations = JSON.parse(localStorage.getItem('webradio_stations')) || defaultStations;

const listElement = document.getElementById('station-list');
const audioPlayer = document.getElementById('audio-player');
const statusText = document.getElementById('status');
const currentStationText = document.getElementById('current-station');
const nowPlayingText = document.getElementById('now-playing');

const volumeSlider = document.getElementById('volume-slider');
const volumeText = document.getElementById('volume-text');

let currentIndex = -1;

let savedVolume = localStorage.getItem('webradio_volume');
if (savedVolume !== null) {
    audioPlayer.volume = parseFloat(savedVolume);
    volumeSlider.value = savedVolume;
} else {
    audioPlayer.volume = 0.5;
    volumeSlider.value = 0.5;
}
updateVolumeText();

volumeSlider.addEventListener('input', (e) => {
    const vol = e.target.value;
    audioPlayer.volume = vol;
    localStorage.setItem('webradio_volume', vol);
    updateVolumeText();
});

function updateVolumeText() {
    const percentage = Math.round(volumeSlider.value * 100);
    volumeText.textContent = `[ ${percentage.toString().padStart(3, ' ')}% ]`;
}

function saveStations() {
    localStorage.setItem('webradio_stations', JSON.stringify(stations));
}

function renderStations() {
    listElement.innerHTML = ''; 
    
    stations.forEach((station, index) => {
        let li = document.createElement('li');
        li.className = 'station-item';
        if (index === currentIndex) {
            li.classList.add('active-station');
        }
        
        let textSpan = document.createElement('span');
        textSpan.className = 'station-text';
        textSpan.textContent = `${(index + 1).toString().padStart(2, '0')} - ${station.name}`;
        textSpan.onclick = () => selectStation(index);

        let actionDiv = document.createElement('div');
        
        let editBtn = document.createElement('button');
        editBtn.className = 'action-btn btn-edit';
        editBtn.textContent = '[E]';
        editBtn.title = 'Editar';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            editStation(index);
        };

        let deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn btn-delete';
        deleteBtn.textContent = '[X]';
        deleteBtn.title = 'Eliminar';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteStation(index);
        };

        actionDiv.appendChild(editBtn);
        actionDiv.appendChild(deleteBtn);

        li.appendChild(textSpan);
        li.appendChild(actionDiv);
        listElement.appendChild(li);
    });
}

function selectStation(index) {
    currentIndex = index;
    const station = stations[index];
    audioPlayer.src = station.url;
    currentStationText.textContent = station.name;
    renderStations(); 
    playRadio(); 
}

function playRadio() {
    if (currentIndex === -1) {
        alert(">> EXCEPCIÓN: Ninguna emisora seleccionada.");
        return;
    }
    audioPlayer.play();
    statusText.textContent = "Conectando...";
    statusText.style.color = "var(--blue)";
    nowPlayingText.textContent = "[ Analizando stream de audio... ]";
    
    audioPlayer.onplaying = () => {
        statusText.textContent = "En Línea";
        statusText.style.color = "var(--green)";
        nowPlayingText.textContent = "[ Metadatos bloqueados por CORS en navegador cliente. Audio transmitiendo correctamente. ]";
    };
}

function stopRadio() {
    audioPlayer.pause();
    statusText.textContent = "Detenido";
    statusText.style.color = "var(--subtext0)";
    nowPlayingText.textContent = "[ -- ]";
}

function addNewStation() {
    const nameInput = document.getElementById('new-name');
    const urlInput = document.getElementById('new-url');
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();

    if (name === "" || url === "") {
        alert(">> EXCEPCIÓN: Debes ingresar un nombre y una URL válida.");
        return;
    }

    stations.push({ name: name, url: url });
    saveStations();
    
    nameInput.value = '';
    urlInput.value = '';
    renderStations();
}

function editStation(index) {
    const station = stations[index];
    const newName = prompt(">> EDITAR NOMBRE:", station.name);
    if (newName === null) return; 
    
    const newUrl = prompt(">> EDITAR URL:", station.url);
    if (newUrl === null) return;

    if (newName.trim() !== "" && newUrl.trim() !== "") {
        stations[index] = { name: newName.trim(), url: newUrl.trim() };
        saveStations();
        
        if (currentIndex === index) {
            currentStationText.textContent = stations[index].name;
            if (audioPlayer.src !== stations[index].url) {
                audioPlayer.src = stations[index].url;
                playRadio();
            }
        }
        renderStations();
    } else {
        alert(">> EXCEPCIÓN: Los campos no pueden estar vacíos.");
    }
}

function deleteStation(index) {
    const station = stations[index];
    if (confirm(`¿Estás seguro de que deseas eliminar [ ${station.name} ]?`)) {
        stations.splice(index, 1);
        
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

function exportStations() {
    // Convertimos nuestra lista a un formato de texto JSON ordenado
    const dataStr = JSON.stringify(stations, null, 2);
    // Creamos un "archivo" virtual en la memoria del navegador
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Creamos un enlace invisible, le hacemos clic automáticamente y lo borramos
    const a = document.createElement('a');
    a.href = url;
    a.download = "estaciones_backup.json"; // Nombre del archivo
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importStations(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Intentamos interpretar el texto del archivo como JSON
            const importedData = JSON.parse(e.target.result);
            
            // Verificamos que sea una lista válida antes de romper nuestra app
            if (Array.isArray(importedData)) {
                stations = importedData;
                saveStations(); // Guardamos en el localStorage
                
                // Detenemos la radio si estaba sonando para evitar conflictos
                stopRadio();
                currentIndex = -1;
                currentStationText.textContent = "Ninguno";
                
                renderStations(); // Redibujamos la lista
                alert(">> ÉXITO: Base de datos importada correctamente.");
            } else {
                alert(">> EXCEPCIÓN: El archivo no tiene el formato correcto.");
            }
        } catch (error) {
            alert(">> EXCEPCIÓN: No se pudo leer el archivo JSON.");
        }
    };
    // Leemos el contenido del archivo
    reader.readAsText(file);
    
    // Reseteamos el input por si el usuario quiere volver a subir el mismo archivo después
    event.target.value = '';
}

// --- SISTEMA DE TEMAS ---

const themeSelect = document.getElementById('theme-select');

// 1. Cargamos el tema guardado al iniciar (o usamos 'mocha' por defecto)
let savedTheme = localStorage.getItem('webradio_theme') || 'mocha';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeSelect) {
    themeSelect.value = savedTheme;
}

// 2. Función que se ejecuta cuando cambias el menú desplegable
function changeTheme() {
    const newTheme = themeSelect.value;
    
    // Cambia el atributo en la etiqueta <html> de la página
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Lo guardamos en el navegador para la próxima visita
    localStorage.setItem('webradio_theme', newTheme);
}

// --- CONTROL POR TECLADO (BARRA ESPACIADORA) ---
document.addEventListener('keydown', function(event) {
    // Si el usuario está escribiendo en un input, ignoramos la tecla
    if (event.target.tagName.toLowerCase() === 'input') return;

    if (event.code === 'Space') {
        event.preventDefault(); // Evita que la página haga scroll hacia abajo
        
        if (audioPlayer.paused) {
            // Si está pausado y hay una emisora seleccionada, reproducimos
            if (currentIndex !== -1) {
                playRadio();
            } else {
                // Si no hay emisora seleccionada, reproducimos la primera (0) por defecto
                selectStation(0);
            }
        } else {
            // Si está sonando, detenemos
            stopRadio();
        }
    }
});

function renderStations() {
    listElement.innerHTML = ''; 
    
    // Hacemos una copia para ordenar, pero le pegamos una etiqueta con su 'índice original' 
    // a cada emisora para no perder el rastro de quién es quién en la base de datos.
    const displayOrder = stations.map((station, index) => {
        return { ...station, originalIndex: index };
    }).sort((a, b) => (b.favorite === true) - (a.favorite === true));

    displayOrder.forEach((station) => {
        const index = station.originalIndex; // Recuperamos su número real
        
        let li = document.createElement('li');
        li.className = 'station-item';
        if (index === currentIndex) li.classList.add('active-station');
        if (station.favorite) li.classList.add('is-favorite');
        
        // --- 1. Botón de Corazón ---
        let favSpan = document.createElement('span');
        favSpan.className = `fav-btn ${station.favorite ? 'active' : ''}`;
        favSpan.textContent = station.favorite ? '♥' : '♡';
        favSpan.onclick = (e) => toggleFavorite(index, e);

        // --- 2. Texto de la estación ---
        let textSpan = document.createElement('span');
        textSpan.className = 'station-text';
        textSpan.textContent = `${(index + 1).toString().padStart(2, '0')} - ${station.name}`;
        textSpan.onclick = () => selectStation(index);

        // --- 3. Botones de Acción [E] y [X] ---
        let actionDiv = document.createElement('div');
        
        let editBtn = document.createElement('button');
        editBtn.className = 'action-btn btn-edit';
        editBtn.textContent = '[E]';
        editBtn.onclick = (e) => { e.stopPropagation(); editStation(index); };

        let deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn btn-delete';
        deleteBtn.textContent = '[X]';
        deleteBtn.onclick = (e) => { e.stopPropagation(); deleteStation(index); };

        // Ensamblamos las piezas
        actionDiv.appendChild(editBtn);
        actionDiv.appendChild(deleteBtn);
        li.appendChild(favSpan);
        li.appendChild(textSpan);
        li.appendChild(actionDiv);
        
        listElement.appendChild(li);
    });
}

function toggleFavorite(index, event) {
    event.stopPropagation(); // Frenamos el clic para que no active la radio por accidente
    
    // Si la estación no tenía la propiedad favorite, al negarla se vuelve 'true'
    stations[index].favorite = !stations[index].favorite;
    
    saveStations();
    renderStations(); // Redibujamos la pantalla para que la emisora salte arriba
}
 
renderStations();
