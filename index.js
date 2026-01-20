// ====== Helpers: storage & utils ======
const STORAGE_PREFIX = 'Tracker:v1:';

const storage = {
  get(id){ return localStorage.getItem(STORAGE_PREFIX + id) === '1'; },
  set(id, val){ localStorage.setItem(STORAGE_PREFIX + id, val ? '1' : '0'); }
};

const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

const el = {
  sidebar: qs('#regionsSidebar'),
  main: qs('#mainPanel'),
  back: qs('#backBtn'),
  search: qs('#searchInput'),
  hideCompleted: qs('#hideCompleted'),
  opacityAddon1:qs('#opacityAddon'),
  opacityAddon2:qs('#opacityAddon2'),
  opacityAddon3:qs('#opacityAddon3')
};

const palettes = {
  Aether: { topBar: "#292022", regionsBar: "#2e2426", mainBcg: "#332829", buttons: "#3d3132", text: "#dcb37b", lighterText: "#f1e1ba", opacityAddon1:"rgba(0, 0, 0, 0.1)", opacityAddon2:"rgba(0, 0, 0, 0.2)", opacityAddon3:"rgba(0, 0, 0, 0.3)" },
  Lumine: { topBar: "#f4f4f4ff", regionsBar: "#ebebebff", mainBcg: "#e3e3e3ff", buttons: "#ffffffff", text: "#3d5870", lighterText: "#79adc9ff" , opacityAddon1:"rgba(255, 255, 255, 0.7)", opacityAddon2:"rgba(255, 255, 255, 0.6)", opacityAddon3:"rgba(255, 255, 255, 1)" },
  Anemo: { topBar:"#003233", regionsBar:"#003637", mainBcg:"#003a3a", buttons:"#004343", text:"#90c58c", lighterText:"#a5f3cb",opacityAddon1:"rgba(0, 0, 0, 0.1)", opacityAddon2:"rgba(0, 0, 0, 0.2)", opacityAddon3:"rgba(0, 0, 0, 0.3)" },
  Geo: { topBar:"#2d1500", regionsBar:"#321900", mainBcg:"#371d00", buttons:"#412600", text:"#e0a824", lighterText:"#f5d663",opacityAddon1:"rgba(0, 0, 0, 0.1)", opacityAddon2:"rgba(0, 0, 0, 0.2)", opacityAddon3:"rgba(0, 0, 0, 0.3)" },
  Electro: { topBar:"#150067", regionsBar:"#1a006b", mainBcg:"#1f026e", buttons:"#290b77", text:"#c88dc0", lighterText:"#ddbbff", opacityAddon1:"rgba(0, 0, 0, 0.1)", opacityAddon2:"rgba(0, 0, 0, 0.2)", opacityAddon3:"rgba(0, 0, 0, 0.3)" },
  Dendro: { topBar:"#002e00", regionsBar:"#003200", mainBcg:"#003600", buttons:"#033f00", text:"#a2c100", lighterText:"#b7ef2c", opacityAddon1:"rgba(0, 0, 0, 0.1)", opacityAddon2:"rgba(0, 0, 0, 0.2)", opacityAddon3:"rgba(0, 0, 0, 0.3)" },
  Hydro: { topBar:"#002466", regionsBar:"#00286a", mainBcg:"#002c6d", buttons:"#003576", text:"#00b7bf", lighterText:"#06e5fe",  opacityAddon1:"rgba(0, 0, 0, 0.1)", opacityAddon2:"rgba(0, 0, 0, 0.2)", opacityAddon3:"rgba(0, 0, 0, 0.3)" },
  Pyro: { topBar:"#370000", regionsBar:"#3c0000", mainBcg:"#410000", buttons:"#4b0000", text:"#ea7b2e", lighterText:"#ffa96d", opacityAddon1:"rgba(0, 0, 0, 0.1)", opacityAddon2:"rgba(0, 0, 0, 0.2)", opacityAddon3:"rgba(0, 0, 0, 0.3)" },
  Cryo: { topBar:"#063c63", regionsBar:"#0b4067", mainBcg:"#10446a", buttons:"#1a4d73", text:"#b9cfbc", lighterText:"#cefdfb", opacityAddon1:"rgba(0, 0, 0, 0.1)", opacityAddon2:"rgba(0, 0, 0, 0.2)", opacityAddon3:"rgba(0, 0, 0, 0.3)" }
};

// Funkcja do zmiany palety
function applyPalette(palette, name=null){
  const root = document.documentElement;
  root.style.setProperty('--top-bar', palette.topBar);
  root.style.setProperty('--regions-bar', palette.regionsBar);
  root.style.setProperty('--main-bcg', palette.mainBcg);
  root.style.setProperty('--buttons', palette.buttons);
  root.style.setProperty('--text', palette.text);
  root.style.setProperty('--lighter-text', palette.lighterText);
  root.style.setProperty('--opacityAddon1', palette.opacityAddon1);
  root.style.setProperty('--opacityAddon2', palette.opacityAddon2);
  root.style.setProperty('--opacityAddon3', palette.opacityAddon3);

  if(name) localStorage.setItem('selectedPalette', name);
}

// Przywracanie palety z localStorage
function loadPalette(){
  const saved = localStorage.getItem('selectedPalette');
  if(saved && palettes[saved]) applyPalette(palettes[saved]);
  else applyPalette(palettes.Aether);
}

// Wywołanie przy starcie
loadPalette();

// Wypełnienie menu przyciskami palet
const paletteMenu = document.getElementById('paletteMenu');
let selectedBtn = null; // przechowuje aktualnie zaznaczony przycisk

for (const name in palettes) {
  const btn = document.createElement('button');
  
  const img = document.createElement('img');
  img.src = `./images/colors/${name}.webp`;
  img.alt = name;
  img.classList.add('palette-icon'); 
  btn.appendChild(img);

  btn.onclick = () => {
    applyPalette(palettes[name], name);

    // usuwamy zaznaczenie z poprzedniego przycisku
    if(selectedBtn) selectedBtn.classList.remove('selected');

    // dodajemy zaznaczenie do klikniętego
    btn.classList.add('selected');
    selectedBtn = btn;
  }

  paletteMenu.appendChild(btn);

  // Jeśli ta paleta jest aktualnie zapisana w localStorage, zaznacz ją od razu
  const saved = localStorage.getItem('selectedPalette');
  if(saved === name) {
    btn.classList.add('selected');
    selectedBtn = btn;
  }
};



// Toggle menu po kliknięciu przycisku
document.getElementById('paletteBtn').addEventListener('click', () => {
  paletteMenu.style.display = paletteMenu.style.display === 'block' ? 'none' : 'block';
});
// Funkcja do wczytywania ikon i dodawania ich do przycisków
function addIconsToSidebar() {
  const buttons = document.querySelectorAll(".sidebar button");

  buttons.forEach(btn => {
    // pobieramy tekst przycisku (np. "Quests")
    const text = btn.textContent.trim().toLowerCase();

    // tworzymy element <img>
    const icon = document.createElement("img");
    icon.src = `images/main/${text}.webp`;   // np. icons/quests.png
    icon.alt = text + " icon";
    icon.classList.add("btn-icon");

    // czyścimy przycisk i dodajemy ikonę + tekst
    btn.textContent = "";
    btn.appendChild(icon);
    btn.appendChild(document.createTextNode(" " + text.charAt(0).toUpperCase() + text.slice(1)));
  });
}

// Wywołaj po załadowaniu strony
document.addEventListener("DOMContentLoaded", addIconsToSidebar);


// Zamknięcie menu po kliknięciu gdziekolwiek poza nim
document.addEventListener('click', e => {
  if(!document.getElementById('paletteBtn').contains(e.target) && 
     !paletteMenu.contains(e.target)) {
    paletteMenu.style.display = 'none';
  }
});

