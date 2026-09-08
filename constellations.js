const palettes = {
  Aether: { topBar: '#292022', regionsBar: '#2e2426', mainBcg: '#332829', buttons: '#3d3132', text: '#dcb37b', lighterText: '#f1e1ba', opacityAddon1: 'rgba(0, 0, 0, 0.1)', opacityAddon2: 'rgba(0, 0, 0, 0.2)', opacityAddon3: 'rgba(0, 0, 0, 0.3)' },
  Lumine: { topBar: '#f4f4f4ff', regionsBar: '#ebebebff', mainBcg: '#e3e3e3ff', buttons: '#ffffffff', text: '#3d5870', lighterText: '#79adc9ff', opacityAddon1: 'rgba(255, 255, 255, 0.7)', opacityAddon2: 'rgba(255, 255, 255, 0.6)', opacityAddon3: 'rgba(255, 255, 255, 1)' },
  Anemo: { topBar: '#003233', regionsBar: '#003637', mainBcg: '#003a3a', buttons: '#004343', text: '#90c58c', lighterText: '#a5f3cb', opacityAddon1: 'rgba(0, 0, 0, 0.1)', opacityAddon2: 'rgba(0, 0, 0, 0.2)', opacityAddon3: 'rgba(0, 0, 0, 0.3)' },
  Geo: { topBar: '#2d1500', regionsBar: '#321900', mainBcg: '#371d00', buttons: '#412600', text: '#e0a824', lighterText: '#f5d663', opacityAddon1: 'rgba(0, 0, 0, 0.1)', opacityAddon2: 'rgba(0, 0, 0, 0.2)', opacityAddon3: 'rgba(0, 0, 0, 0.3)' },
  Electro: { topBar: '#150067', regionsBar: '#1a006b', mainBcg: '#1f026e', buttons: '#290b77', text: '#c88dc0', lighterText: '#ddbbff', opacityAddon1: 'rgba(0, 0, 0, 0.1)', opacityAddon2: 'rgba(0, 0, 0, 0.2)', opacityAddon3: 'rgba(0, 0, 0, 0.3)' },
  Dendro: { topBar: '#002e00', regionsBar: '#003200', mainBcg: '#003600', buttons: '#033f00', text: '#a2c100', lighterText: '#b7ef2c', opacityAddon1: 'rgba(0, 0, 0, 0.1)', opacityAddon2: 'rgba(0, 0, 0, 0.2)', opacityAddon3: 'rgba(0, 0, 0, 0.3)' },
  Hydro: { topBar: '#002466', regionsBar: '#00286a', mainBcg: '#002c6d', buttons: '#003576', text: '#00b7bf', lighterText: '#06e5fe', opacityAddon1: 'rgba(0, 0, 0, 0.1)', opacityAddon2: 'rgba(0, 0, 0, 0.2)', opacityAddon3: 'rgba(0, 0, 0, 0.3)' },
  Pyro: { topBar: '#370000', regionsBar: '#3c0000', mainBcg: '#410000', buttons: '#4b0000', text: '#ea7b2e', lighterText: '#ffa96d', opacityAddon1: 'rgba(0, 0, 0, 0.1)', opacityAddon2: 'rgba(0, 0, 0, 0.2)', opacityAddon3: 'rgba(0, 0, 0, 0.3)' },
  Cryo: { topBar: '#063c63', regionsBar: '#0b4067', mainBcg: '#10446a', buttons: '#1a4d73', text: '#b9cfbc', lighterText: '#cefdfb', opacityAddon1: 'rgba(0, 0, 0, 0.1)', opacityAddon2: 'rgba(0, 0, 0, 0.2)', opacityAddon3: 'rgba(0, 0, 0, 0.3)' }
};

const STORAGE_PREFIX = 'Tracker:v1:constellation:';

const storage = {
  get(id, field, fallback = '') {
    const value = localStorage.getItem(`${STORAGE_PREFIX}${id}:${field}`);
    return value === null ? fallback : value;
  },
  set(id, field, value) {
    if (value === null || value === '' || value === undefined) {
      localStorage.removeItem(`${STORAGE_PREFIX}${id}:${field}`);
      return;
    }
    localStorage.setItem(`${STORAGE_PREFIX}${id}:${field}`, String(value));
  }
};

const state = {
  characters: [],
  search: '',
  sortBy: 'az',
  selectedElement: null,
  starFilter: null,
  ownedFilter: null,
  showStats: false
};

const elements = [
  { key: 'Anemo', icon: './images/colors/Anemo.webp' },
  { key: 'Geo', icon: './images/colors/Geo.webp' },
  { key: 'Electro', icon: './images/colors/Electro.webp' },
  { key: 'Dendro', icon: './images/colors/Dendro.webp' },
  { key: 'Hydro', icon: './images/colors/Hydro.webp' },
  { key: 'Pyro', icon: './images/colors/Pyro.webp' },
  { key: 'Cryo', icon: './images/colors/Cryo.webp' }
];

const qs = (selector) => document.querySelector(selector);

function applyPalette(palette, name = null) {
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

  if (name) localStorage.setItem('selectedPalette', name);
}

function loadPalette() {
  const saved = localStorage.getItem('selectedPalette');
  if (saved && palettes[saved]) applyPalette(palettes[saved]);
  else applyPalette(palettes.Aether);
}

loadPalette();

const paletteMenu = document.getElementById('paletteMenu');
let selectedBtn = null;

for (const name in palettes) {
  const btn = document.createElement('button');
  const img = document.createElement('img');
  img.src = `./images/colors/${name}.webp`;
  img.alt = name;
  img.className = 'palette-icon';
  btn.appendChild(img);
  btn.className = 'palette-option';

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

document.getElementById('paletteBtn').addEventListener('click', () => {
  paletteMenu.style.display = paletteMenu.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', e => {
  const paletteBtn = document.getElementById('paletteBtn');
  if (!paletteBtn.contains(e.target) && !paletteMenu.contains(e.target)) {
    paletteMenu.style.display = 'none';
  }
});

function createElementFilter() {
  const filterBar = document.getElementById('elementFilter');

  for (const element of elements) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'element-button';
    button.title = element.key;
    button.dataset.element = element.key;
    button.innerHTML = `<img src="${element.icon}" alt="${element.key}" />`;

    button.addEventListener('click', () => {
      state.selectedElement = state.selectedElement === element.key ? null : element.key;
      render();
    });

    filterBar.appendChild(button);
  }
}

function createAdditionalFilters() {
  const container = document.getElementById('extraFilters');
  const starGroup = document.createElement('div');
  starGroup.className = 'filter-group';

  const starOptions = [
    { label: 'Only 4 Stars', value: '4' },
    { label: 'Only 5 Stars', value: '5' }
  ];

  for (const option of starOptions) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-button';
    button.textContent = option.label;
    button.dataset.group = 'stars';
    button.dataset.value = option.value;

    button.addEventListener('click', () => {
      state.starFilter = state.starFilter === option.value ? null : option.value;
      render();
    });

    starGroup.appendChild(button);
  }

  const ownedGroup = document.createElement('div');
  ownedGroup.className = 'filter-group';

  const ownedOptions = [
    { label: 'Only Owned', value: 'owned' },
    { label: 'Only Unowned', value: 'unowned' }
  ];

  for (const option of ownedOptions) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-button';
    button.textContent = option.label;
    button.dataset.group = 'owned';
    button.dataset.value = option.value;

    button.addEventListener('click', () => {
      state.ownedFilter = state.ownedFilter === option.value ? null : option.value;
      render();
    });

    ownedGroup.appendChild(button);
  }

  container.appendChild(starGroup);
  container.appendChild(ownedGroup);
}

function getBaseConstellationValue(character) {
  const raw = character?.constellation;
  if (raw === null || raw === undefined || raw === '') return -1;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return -1;

  return Math.min(6, Math.max(0, parsed));
}

function isCharacterOwned(character) {
  const baseValue = getBaseConstellationValue(character);
  const savedValue = getSavedConstellationValue(character.id, baseValue);
  return savedValue !== -1;
}

function getCharacterIcon(character) {
  if (character.icon && character.icon.trim()) return character.icon;

  const initials = character.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90">
      <rect width="90" height="90" rx="18" fill="${character.rarity >= 5 ? '#f4cf66' : '#b388ff'}"/>
      <circle cx="45" cy="32" r="18" fill="rgba(255,255,255,0.22)"/>
      <text x="45" y="58" font-size="30" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-weight="700">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getSortConstellationValue(character) {
  const baseValue = getBaseConstellationValue(character);
  return getSavedConstellationValue(character.id, baseValue);
}

function getRegionSortRank(region) {
  const order = [
    'Mondstadt',
    'Liyue',
    'Inazuma',
    'Sumeru',
    'Fontaine',
    'Natlan',
    'Nod-Krai',
    'Snezhnaya',
    'None'
  ];

  const normalized = region || 'None';
  const index = order.indexOf(normalized);
  return index === -1 ? order.length : index;
}

function getSortedCharacters(list) {
  const sorted = [...list];
  switch (state.sortBy) {
    case 'region':
      sorted.sort((a, b) => getRegionSortRank(a.region) - getRegionSortRank(b.region));
      break;
    case 'acquisitionDate':
      sorted.sort((a, b) => new Date(a.acquisitionDate || 0) - new Date(b.acquisitionDate || 0));
      break;
    case 'releaseDate':
      sorted.sort((a, b) => new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0));
      break;
    case 'constellationAsc':
      sorted.sort((a, b) => getSortConstellationValue(a) - getSortConstellationValue(b));
      break;
    case 'constellationDesc':
      sorted.sort((a, b) => getSortConstellationValue(b) - getSortConstellationValue(a));
      break;
    default:
      sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted;
}

function getSavedConstellationValue(characterId, fallback = -1) {
  const raw = storage.get(characterId, 'constellation', String(fallback));

  if (raw === null || raw === undefined || raw === '') return fallback;

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return fallback;

  if (parsed === -1) return -1;

  return Math.min(6, Math.max(0, parsed));
}

function getSavedAcquisitionDate(characterId, fallback = '') {
  return storage.get(characterId, 'acquisitionDate', fallback);
}

function formatConstellationValue(value) {
  return value === -1 ? 'None' : String(value);
}

function formatDateValue(value) {
  return value ? value : 'None';
}

function formatPercent(owned, total) {
  return `${total ? Math.round((owned / total) * 100) : 0}%`;
}

function createStatItem(label, owned, total) {
  const item = document.createElement('div');
  item.className = `stat-item${total > 0 && owned === total ? ' completed' : ''}`;
  item.innerHTML = `
    <span class="stat-label">${label}</span>
    <strong class="stat-value">${owned}/${total}</strong>
    <span class="stat-percent">${formatPercent(owned, total)}</span>
  `;
  return item;
}

function createElementStatItem(element, characters) {
  const item = document.createElement('div');
  item.className = 'stat-item element-stat-item';

  const label = document.createElement('span');
  label.className = 'element-stat-label';
  label.textContent = element;
  item.appendChild(label);

  const metrics = document.createElement('div');
  metrics.className = 'element-stat-metrics';
  for (const [metricLabel, rarity] of [['All', null], ['5-star', 5], ['4-star', 4]]) {
    const matchingCharacters = rarity === null
      ? characters
      : characters.filter(character => character.rarity === rarity);
    metrics.appendChild(createStatItem(
      `${metricLabel} ${element}`,
      matchingCharacters.filter(isCharacterOwned).length,
      matchingCharacters.length
    ));
  }
  item.appendChild(metrics);

  return item;
}

function createStatsPanel() {
  const panel = document.createElement('section');
  panel.className = 'stats-panel';
  panel.setAttribute('aria-label', 'Character statistics');

  const title = document.createElement('h2');
  title.className = 'stats-title';
  title.textContent = 'Character Stats';
  panel.appendChild(title);

  const total = state.characters.length;
  const owned = state.characters.filter(isCharacterOwned).length;
  const fiveStars = state.characters.filter(character => character.rarity === 5);
  const fourStars = state.characters.filter(character => character.rarity === 4);
  const summary = document.createElement('div');
  summary.className = 'stats-grid';
  summary.appendChild(createStatItem('All characters', owned, total));
  summary.appendChild(createStatItem('5-star characters', fiveStars.filter(isCharacterOwned).length, fiveStars.length));
  summary.appendChild(createStatItem('4-star characters', fourStars.filter(isCharacterOwned).length, fourStars.length));
  panel.appendChild(summary);

  const elementsTitle = document.createElement('h3');
  elementsTitle.className = 'stats-section-title';
  elementsTitle.textContent = 'By element';
  panel.appendChild(elementsTitle);

  const elementsGrid = document.createElement('div');
  elementsGrid.className = 'elements-grid';
  for (const element of elements) {
    const elementCharacters = state.characters.filter(character => character.element === element.key);
    elementsGrid.appendChild(createElementStatItem(element.key, elementCharacters));
  }
  panel.appendChild(elementsGrid);

  return panel;
}

function render() {
  const mainPanel = document.getElementById('mainPanel');
  const search = state.search.trim().toLowerCase();

  document.querySelectorAll('.element-button').forEach(button => {
    const isActive = button.dataset.element === state.selectedElement;
    button.classList.toggle('active', isActive);
  });

  document.querySelectorAll('.filter-button').forEach(button => {
    const group = button.dataset.group;
    const value = button.dataset.value;
    const isActive = group === 'stars' ? state.starFilter === value : state.ownedFilter === value;
    button.classList.toggle('active', isActive);
  });

  let filtered = state.characters.filter(character => {
    const textMatch = !search ||
      character.name.toLowerCase().includes(search) ||
      (character.region || '').toLowerCase().includes(search) ||
      String(getSortConstellationValue(character)).toLowerCase().includes(search);

    const elementMatch = !state.selectedElement || character.element === state.selectedElement;
    const starMatch = !state.starFilter || (state.starFilter === '4' ? character.rarity === 4 : character.rarity === 5);
    const ownedMatch = !state.ownedFilter || (state.ownedFilter === 'owned' ? isCharacterOwned(character) : !isCharacterOwned(character));

    return textMatch && elementMatch && starMatch && ownedMatch;
  });

  filtered = getSortedCharacters(filtered);

  const content = document.createDocumentFragment();
  if (state.showStats) content.appendChild(createStatsPanel());

  const list = document.createElement('div');
  list.className = 'character-list';

  if (!filtered.length) {
    list.innerHTML = '<div class="empty">No characters found.</div>';
    content.appendChild(list);
    mainPanel.replaceChildren(content);
    return;
  }

  for (const character of filtered) {
    const baseConstellationValue = getBaseConstellationValue(character);
    const constellationValue = getSavedConstellationValue(character.id, baseConstellationValue);
    const acquisitionDateValue = getSavedAcquisitionDate(character.id, character.acquisitionDate || '');
    const constellationDataValue = constellationValue === -1 ? '-1' : String(constellationValue);
    const isEmptyState = constellationValue === -1 && !acquisitionDateValue;
    const card = document.createElement('article');
    card.className = `character-card${isEmptyState ? ' is-empty-state' : ''}`;
    card.innerHTML = `
      <div class="character-main">
        <div class="character-icon-wrap rarity-${character.rarity}">
          <img src="${getCharacterIcon(character)}" alt="${character.name}" />
        </div>
        <div class="character-name">${character.name}</div>
      </div>
      <div class="character-meta">
        <div class="meta-item"><span>Element</span><strong>${character.element}</strong></div>
        <div class="meta-item">
          <span>Constellation</span>
          <div
            class="editable-preview"
            tabindex="0"
            data-character-id="${character.id}"
            data-field="constellation"
            data-value="${constellationDataValue}"
          >${formatConstellationValue(constellationValue)}</div>
        </div>
        <div class="meta-item"><span>Region</span><strong>${character.region || '—'}</strong></div>
        <div class="meta-item"><span>Release Date</span><strong>${character.releaseDate || '—'}</strong></div>
        <div class="meta-item">
          <span>Acquisition Date</span>
          <div
            class="editable-preview"
            tabindex="0"
            data-character-id="${character.id}"
            data-field="acquisitionDate"
            data-value="${acquisitionDateValue || ''}"
          >${formatDateValue(acquisitionDateValue)}</div>
        </div>
      </div>
    `;
    list.appendChild(card);
  }

  content.appendChild(list);
  mainPanel.replaceChildren(content);
  bindEditableFields();
}

function openEditor(previewElement) {
  const field = previewElement.dataset.field;
  const id = previewElement.dataset.characterId;
  const currentValue = previewElement.dataset.value || '';
  const input = document.createElement('input');

  if (field === 'constellation') {
    input.type = 'number';
    input.min = '0';
    input.max = '6';
    input.className = 'constellation-input';
    const normalizedCurrentValue = Number(currentValue);
    input.value = currentValue === '' || currentValue === 'None' || Number.isNaN(normalizedCurrentValue) || normalizedCurrentValue === -1 ? '' : String(currentValue);
    input.placeholder = 'None';
  } else {
    input.type = 'date';
    input.className = 'date-input';
    input.value = currentValue === 'None' ? '' : currentValue;
  }

  input.dataset.characterId = id;
  input.dataset.field = field;

  input.addEventListener('blur', () => {
    const value = input.value;

    if (field === 'constellation') {
      if (value === '') {
        storage.set(id, 'constellation', -1);
      } else {
        const parsed = Math.min(6, Math.max(0, Number.parseInt(value, 10) || 0));
        storage.set(id, 'constellation', parsed);
      }
    } else {
      storage.set(id, 'acquisitionDate', value || '');
      if (value) {
        storage.set(id, 'constellation', 0);
      } else {
        const currentConstellation = getSavedConstellationValue(id, getBaseConstellationValue(state.characters.find(character => character.id === id) || {}));
        if (currentConstellation === 0) {
          storage.set(id, 'constellation', -1);
        }
      }
    }

    render();
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      input.blur();
    }
  });

  previewElement.replaceWith(input);
  input.focus();
  if (field === 'constellation') {
    input.select();
  }
}

function bindEditableFields() {
  document.querySelectorAll('.editable-preview').forEach(preview => {
    preview.addEventListener('click', () => openEditor(preview));
    preview.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openEditor(preview);
      }
    });
  });
}

async function loadCharacters() {
  try {
    const response = await fetch('./data/constellations.json');
    if (!response.ok) throw new Error('Failed to load data');
    state.characters = await response.json();
    render();
  } catch (error) {
    console.error(error);
    document.getElementById('mainPanel').innerHTML = '<div class="empty">Failed to load characters.</div>';
  }
}

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (event) => {
  state.search = event.target.value;
  render();
});

document.getElementById('sortSelect').addEventListener('change', (event) => {
  state.sortBy = event.target.value;
  render();
});

document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

document.getElementById('statsBtn').addEventListener('click', () => {
  state.showStats = !state.showStats;
  const statsButton = document.getElementById('statsBtn');
  statsButton.textContent = state.showStats ? 'Hide Stats' : 'Show Stats';
  statsButton.setAttribute('aria-expanded', String(state.showStats));
  render();
});

createElementFilter();
createAdditionalFilters();
loadCharacters();
