const defaultStations = [
    { name: "Aspen Radio", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/ASPEN.mp3" },
    { name: "ESPN", url: "http://edge.espn.cdn.abacast.net/espn-deportesmp3-48" }, // Corregí un pequeño error de tipeo "hhttp" que tenías aquí
    { name: "[530] - Radio Madre" , url: "http://cdn.instream.audio:9288/stream" },
    { name: "[550] - Radio Colonia", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/COLONIAAAC.aac" },
    { name: "[570] - Radio Argentina", url: "https://server.laradio.online:15224/live.mp3" },
    { name: "[590] - Radio Continental", url: "https://edge05.radiohdvivo.com/continental" },
    { name: "SomaFM - Groove Salad (Ambient)", url: "https://ice1.somafm.com/groovesalad-128-mp3" },
    { name: "Radio Swiss Classic (Clásica)", url: "https://stream.srg-ssr.ch/m/rsc_de/mp3_128" },
    { name: "Lofi Radio (Beats)", url: "https://play.streamafrica.net/lofi" },
    { name: "BBC World Service (Noticias)", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service" }
];

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
 
renderStations();