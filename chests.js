// ====== Helpers: storage & utils ======
const STORAGE_PREFIX = 'Tracker:v1:';

/*
  IMPORTANT:
  Chest tracker needs NUMBERS, not booleans.
  This keeps your prefix + API but adapts behavior.
*/
const storage = {
  get(id, total = Infinity) {
    const v = localStorage.getItem(STORAGE_PREFIX + id);
    if (v === null) return 0;
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : Math.min(n, total);
  },
  set(id, val) {
    localStorage.setItem(STORAGE_PREFIX + id, String(val));
  }
};

const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

const state = {
  regions: [],        // chest regions
  selectedRegionId: null,
  search: ''
};

const el = {
  main: qs('#mainPanel'),
  back: qs('#backBtn'),
  search: qs('#searchInput')
};

// ====== Palettes (UNCHANGED) ======
const palettes = {
  Aether: { topBar: "#292022", regionsBar: "#2e2426", mainBcg: "#332829", buttons: "#3d3132", text: "#dcb37b", lighterText: "#f1e1ba", opacityAddon1:"rgba(0, 0, 0, 0.1)", opacityAddon2:"rgba(0, 0, 0, 0.2)", opacityAddon3:"rgba(0, 0, 0, 0.3)" },
  Lumine: { topBar: "#f4f4f4ff", regionsBar: "#ebebebff", mainBcg: "#e3e3e3ff", buttons: "#ffffffff", text: "#3d5870", lighterText: "#79adc9ff", opacityAddon1:"rgba(255,255,255,1)", opacityAddon2:"rgba(255,255,255,0.6)", opacityAddon3:"rgba(255,255,255,1)" },
  Anemo: { topBar:"#003233", regionsBar:"#003637", mainBcg:"#003a3a", buttons:"#004343", text:"#90c58c", lighterText:"#a5f3cb", opacityAddon1:"rgba(0,0,0,0.1)", opacityAddon2:"rgba(0,0,0,0.2)", opacityAddon3:"rgba(0,0,0,0.3)" },
  Geo: { topBar:"#2d1500", regionsBar:"#321900", mainBcg:"#371d00", buttons:"#412600", text:"#e0a824", lighterText:"#f5d663", opacityAddon1:"rgba(0,0,0,0.1)", opacityAddon2:"rgba(0,0,0,0.2)", opacityAddon3:"rgba(0,0,0,0.3)" },
  Electro: { topBar:"#150067", regionsBar:"#1a006b", mainBcg:"#1f026e", buttons:"#290b77", text:"#c88dc0", lighterText:"#ddbbff", opacityAddon1:"rgba(0,0,0,0.1)", opacityAddon2:"rgba(0,0,0,0.2)", opacityAddon3:"rgba(0,0,0,0.3)" },
  Dendro: { topBar:"#002e00", regionsBar:"#003200", mainBcg:"#003600", buttons:"#033f00", text:"#a2c100", lighterText:"#b7ef2c", opacityAddon1:"rgba(0,0,0,0.1)", opacityAddon2:"rgba(0,0,0,0.2)", opacityAddon3:"rgba(0,0,0,0.3)" },
  Hydro: { topBar:"#002466", regionsBar:"#00286a", mainBcg:"#002c6d", buttons:"#003576", text:"#00b7bf", lighterText:"#06e5fe", opacityAddon1:"rgba(0,0,0,0.1)", opacityAddon2:"rgba(0,0,0,0.2)", opacityAddon3:"rgba(0,0,0,0.3)" },
  Pyro: { topBar:"#370000", regionsBar:"#3c0000", mainBcg:"#410000", buttons:"#4b0000", text:"#ea7b2e", lighterText:"#ffa96d", opacityAddon1:"rgba(0,0,0,0.1)", opacityAddon2:"rgba(0,0,0,0.2)", opacityAddon3:"rgba(0,0,0,0.3)" },
  Cryo: { topBar:"#063c63", regionsBar:"#0b4067", mainBcg:"#10446a", buttons:"#1a4d73", text:"#b9cfbc", lighterText:"#cefdfb", opacityAddon1:"rgba(0,0,0,0.1)", opacityAddon2:"rgba(0,0,0,0.2)", opacityAddon3:"rgba(0,0,0,0.3)" }
};

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

function loadPalette(){
  const saved = localStorage.getItem('selectedPalette');
  if(saved && palettes[saved]) applyPalette(palettes[saved]);
  else applyPalette(palettes.Aether);
}

loadPalette();

// Palette menu (unchanged)
const paletteMenu = document.getElementById('paletteMenu');
let selectedBtn = null;

for (const name in palettes) {
  const btn = document.createElement('button');
  const img = document.createElement('img');
  img.src = `./images/colors/${name}.webp`;
  img.className = 'palette-icon';
  btn.appendChild(img);

  btn.onclick = () => {
    applyPalette(palettes[name], name);
    if (selectedBtn) selectedBtn.classList.remove('selected');
    btn.classList.add('selected');
    selectedBtn = btn;
  };

  paletteMenu.appendChild(btn);

  if (localStorage.getItem('selectedPalette') === name) {
    btn.classList.add('selected');
    selectedBtn = btn;
  }
}

qs('#paletteBtn').addEventListener('click', () => {
  paletteMenu.style.display =
    paletteMenu.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', e => {
  if (!qs('#paletteBtn').contains(e.target) && !paletteMenu.contains(e.target)) {
    paletteMenu.style.display = 'none';
  }
});

// ====== Chest logic ======

async function loadChests(){
  const res = await fetch('./data/chests.json');
  state.regions = await res.json();
  render();
}

function render(){
  const wrap = document.createElement('section');
  wrap.className = 'section';

  const list = document.createElement('ul');
  list.className = 'quests';

  const search = state.search.toLowerCase();

  for (const r of state.regions){
    if (search && !r.name.toLowerCase().includes(search)) continue;
    list.appendChild(renderRow(r));
  }

  if (!list.children.length) {
    wrap.innerHTML = `<div class="empty">No regions found.</div>`;
  } else {
    wrap.appendChild(list);
  }

  el.main.replaceChildren(wrap);
}

function renderRow(r){
  const li = document.createElement('li');
  li.className = 'quest';

  const collected = storage.get(r.id, r.total);
  const remaining = r.total - collected;
  const pct = r.total ? Math.round((collected / r.total) * 100) : 0;

  li.innerHTML = `
    <img src="${r.icon}" class="region-icon">
    <span class="region-name">${r.name}</span>

    <span>
      <input
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        value="${collected}"
        class="chest-input"
      >
      / ${r.total} (<span class="pct-text">${pct}%</span>)
    </span>

    <span class="remaining-text">
      ${remaining === 0 ? 'Complete!' : `${remaining} left`}
    </span>
  `;

  const input = li.querySelector('.chest-input');
  const pctText = li.querySelector('.pct-text');
  const remainingText = li.querySelector('.remaining-text');

  // ✅ Set class on initial render
  remainingText.classList.toggle('complete', remaining === 0);

  input.addEventListener('input', () => {
    const cleaned = input.value.replace(/\D+/g, '');
    let val = cleaned === '' ? 0 : Math.min(parseInt(cleaned, 10), r.total);

    storage.set(r.id, val);

    const remaining = r.total - val;
    const pct = r.total ? Math.round((val / r.total) * 100) : 0;

    pctText.textContent = `${pct}%`;
    remainingText.textContent =
      remaining === 0 ? 'Complete' : `${remaining} left`;

    // ✅ Toggle class dynamically
    remainingText.classList.toggle('complete', remaining === 0);

    input.value = val === 0 ? '' : val;
  });

  return li;
}






// ====== Events ======
el.search.addEventListener('input', () => {
  state.search = el.search.value;
  render();
});

el.back.addEventListener('click', () => {
  window.location.href = 'main.html';
});

// ====== Init ======
loadChests().catch(err => {
  console.error(err);
  el.main.innerHTML = `<div class="empty">Failed to load chests.json</div>`;
});
