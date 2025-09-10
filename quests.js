// ====== Helpers: storage & utils ======
const STORAGE_PREFIX = 'questTracker:v1:';

const storage = {
  get(id){ return localStorage.getItem(STORAGE_PREFIX + id) === '1'; },
  set(id, val){ localStorage.setItem(STORAGE_PREFIX + id, val ? '1' : '0'); }
};

const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

const state = {
  regions: [],
  regionData: {},
  selectedRegionId: null,
  search: '',
  hideCompleted: false
};

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
  Lumine: { topBar: "#f4f4f4ff", regionsBar: "#ebebebff", mainBcg: "#e3e3e3ff", buttons: "#ffffffff", text: "#3d5870", lighterText: "#79adc9ff" , opacityAddon1:"rgba(255, 255, 255, 1)", opacityAddon2:"rgba(255, 255, 255, 0.6)", opacityAddon3:"rgba(255, 255, 255, 1)" },
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

// Zamknięcie menu po kliknięciu gdziekolwiek poza nim
document.addEventListener('click', e => {
  if(!document.getElementById('paletteBtn').contains(e.target) && 
     !paletteMenu.contains(e.target)) {
    paletteMenu.style.display = 'none';
  }
});

// ====== Load regions and compute progress ======
async function loadRegions() {
  const res = await fetch('./data/regions.json');
  const regions = await res.json();

  state.regions = regions.map(r => ({
    ...r,
    icon: `images/regions/${r.id}.webp`
  }));

  await Promise.all(state.regions.map(async (r) => {
    try {
      const data = await fetch('./data/' + r.file).then(x => x.json());
      state.regionData[r.id] = data;
      r.progress = computeProgressForRegionData(data);
    } catch (e) {
      console.error('Nie udało się wczytać regionu', r, e);
      r.progress = { done: 0, total: 0, pct: 0 };
    }
  }));

  renderRegions();
}

function flatQuestsFromRegion(data){
  const all = [];
  if (Array.isArray(data.groups)){
    for (const g of data.groups){
      if (Array.isArray(g.chapters)){
        for (const ch of g.chapters){
          if (Array.isArray(ch.quests)) all.push(...ch.quests);
        }
      }
      if (Array.isArray(g.quests)) all.push(...g.quests);
    }
  }
  if (Array.isArray(data.quests)) all.push(...data.quests);
  return all;
}

function computeProgressForRegionData(data){
  const all = flatQuestsFromRegion(data);
  const total = all.length;
  const done = all.reduce((n,q)=> n + (storage.get(q.id) ? 1 : 0), 0);
  const pct = total ? Math.round((done/total)*100) : 0;
  return { done, total, pct };
}

function renderRegions(){
  el.sidebar.innerHTML = '';
  for (const r of state.regions){
    const btn = document.createElement('button');
    btn.className = 'region';
    if (r.id === state.selectedRegionId) {
      btn.classList.add('selected'); // <--- nowa klasa
    }
    btn.innerHTML = `
      <img src="${r.icon}" alt="" class="region-icon">
      <div class="region-info">
        <span class="region-name">${escapeHtml(r.name)}</span>
        <span class="region-progress">${r.progress.pct === 100 ? 'All quests completed!' : `${r.progress.done}/${r.progress.total} (${r.progress.pct}%)`}</span>
      </div>
    `;
    btn.addEventListener('click', ()=> selectRegion(r.id));
    el.sidebar.appendChild(btn);
  }
}


async function selectRegion(regionId){
  state.selectedRegionId = regionId;
  let data = state.regionData[regionId];
  if (!data){
    const meta = state.regions.find(x=>x.id===regionId);
    data = await fetch('./data/'+ meta.file).then(x=>x.json());
    state.regionData[regionId] = data;
  }
  renderRegion(data);
  renderRegions(); // <--- odśwież sidebar, żeby zaznaczyć wybrany region
  el.search.focus({preventScroll:true});
}


function renderRegion(data){
  const search = state.search.trim().toLowerCase();
  const hide = state.hideCompleted;

  const matches = (title, id) => {
    if (!title) return true;
    const completed = storage.get(id);
    if (hide && completed) return false;
    if (!search) return true;
    return title.toLowerCase().includes(search);
  };

  const wrap = document.createElement('div');

  if (Array.isArray(data.groups) && data.groups.length){
    for (const g of data.groups){
      const sec = document.createElement('section');
      sec.className = 'section';
      sec.innerHTML = `<div class="section-group">
        <div class="section-name">
          <div class="section-title">${escapeHtml(g.name)}</div>
          <div class="section-subtitle">World Quest Series</div>
        </div>
      </div>`;

      const secTitleEl = sec.querySelector('.section-group');
      const markGroup = document.createElement('span');
      markGroup.className = 'mark-completed';

      // funkcja ustawiająca tekst dla grup
      const updateMarkTextGroup = () => {
        const allDone = (g.quests || []).every(q => storage.get(q.id)) &&
                        (g.chapters || []).every(ch => (ch.quests||[]).every(q => storage.get(q.id)));
        markGroup.textContent = allDone ? 'Mark as incomplete' : 'Mark as completed';
      };
      updateMarkTextGroup();

      markGroup.addEventListener('click', () => {
        const allDone = (g.quests || []).every(q => storage.get(q.id)) &&
                        (g.chapters || []).every(ch => (ch.quests||[]).every(q => storage.get(q.id)));
        (g.quests || []).forEach(q => storage.set(q.id, !allDone));
        (g.chapters || []).forEach(ch => (ch.quests||[]).forEach(q => storage.set(q.id, !allDone)));
        renderRegion(data);
      });
      secTitleEl.appendChild(markGroup);

      // chapters
      if (Array.isArray(g.chapters) && g.chapters.length){
        for (const ch of g.chapters){
          const visibleQuests = (ch.quests||[]).filter(q => matches(q.title, q.id));
          if (!visibleQuests.length) continue;
          const chEl = document.createElement('div');
          chEl.className = 'chapter';
          chEl.innerHTML = `<div class="chapter-group">
            <div class="chapter-title">${escapeHtml(ch.name)}</div>
          </div>`;

          const chTitleEl = chEl.querySelector('.chapter-group');
          const markChapter = document.createElement('span');
          markChapter.className = 'mark-completed';

          // funkcja ustawiająca tekst dla chapter
          const updateMarkTextChapter = () => {
            const allDone = (ch.quests||[]).every(q => storage.get(q.id));
            markChapter.textContent = allDone ? 'Mark as incomplete' : 'Mark as completed';
          };
          updateMarkTextChapter();

          markChapter.addEventListener('click', () => {
            const allDone = (ch.quests||[]).every(q => storage.get(q.id));
            (ch.quests||[]).forEach(q => storage.set(q.id, !allDone));
            renderRegion(data);
          });
          chTitleEl.appendChild(markChapter);

          const list = document.createElement('ul');
          list.className = 'quests';
          for (const q of visibleQuests){
            const questLi = renderQuest(q, updateMarkTextChapter, updateMarkTextGroup);
            list.appendChild(questLi);
          }
          chEl.appendChild(list);
          sec.appendChild(chEl);
        }
      }

      // niezależne questy w grupie
      if (Array.isArray(g.quests) && g.quests.length){
        const list = document.createElement('ul');
        list.className = 'quests';
        let count = 0;
        for (const q of g.quests){
          if (!matches(q.title, q.id)) continue;
          list.appendChild(renderQuest(q, updateMarkTextGroup));
          count++;
        }
        if (count) sec.appendChild(list);
      }

      if (sec.children.length>1) wrap.appendChild(sec);
    }
  }

  // questy niezależne od grup
  if (Array.isArray(data.quests) && data.quests.length){
    const sec = document.createElement('section');
    sec.className = 'section';
    const list = document.createElement('ul');
    list.className = 'quests';
    let count = 0;
    for (const q of data.quests){
      if (!matches(q.title, q.id)) continue;
      list.appendChild(renderQuest(q));
      count++;
    }
    if (count){ sec.appendChild(list); wrap.appendChild(sec); }
  }

  if (!wrap.querySelector('.quest')){
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No quests found that match your criteria. Try changing the search term or unchecking "Hide completed".';
    wrap.appendChild(empty);
  }

  el.main.replaceChildren(wrap);
  refreshRegionProgress();
}

// renderQuest z callbackami do aktualizacji tekstów
function renderQuest(q, ...updateFns){
  const li = document.createElement('li');
  li.className = 'quest';
  const checked = storage.get(q.id);
  if (checked) li.classList.add('completed');

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.checked = checked;
  cb.addEventListener('change', () => {
    storage.set(q.id, cb.checked);
    li.classList.toggle('completed', cb.checked);
    updateFns.forEach(fn => fn());
    renderRegion(state.regionData[state.selectedRegionId]); // odśwież ukrywanie po hideCompleted
  });

  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = q.title || q.id;

  li.appendChild(title);
  li.appendChild(cb);
  return li;
}

function refreshRegionProgress(){
  if (!state.selectedRegionId) return;
  const data = state.regionData[state.selectedRegionId];
  const meta = state.regions.find(r=>r.id===state.selectedRegionId);
  if (!data || !meta) return;
  const prog = computeProgressForRegionData(data);
  meta.progress = prog;

  const idx = state.regions.indexOf(meta);
  const btn = el.sidebar.children[idx];
  if (btn){
    const metaEl = btn.querySelector('.region-progress');
    if (metaEl) metaEl.textContent = prog.pct === 100 ? 'All quests completed!' : `${prog.done}/${prog.total} (${prog.pct}%)`;
  }
}

el.back.addEventListener('click', () => {
  state.selectedRegionId = null;
  // tutaj ewentualnie dodatkowy reset innych stanów
  window.location.href = 'index.html';
});


el.search.addEventListener('input', () => {
  state.search = el.search.value;
  if (state.selectedRegionId){
    renderRegion(state.regionData[state.selectedRegionId]);
  }
});

el.hideCompleted.addEventListener('change', () => {
  state.hideCompleted = el.hideCompleted.checked;
  if (state.selectedRegionId){
    renderRegion(state.regionData[state.selectedRegionId]);
  }
});

function escapeHtml(s=''){
  return s.replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

loadRegions().catch(err=>{
  console.error(err);
  el.sidebar.innerHTML = '<div class="empty">Error.json</div>';
});

