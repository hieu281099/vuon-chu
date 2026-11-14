/* ===================== SPA LOOKS: face shapes, eyes, facial features, special skins (merged into chibi.js) ===================== */
// Head space: head x 25..120, y 34..117. Eyes centred at (58,82) and (87,82). Mouth around (72.5,93).
const FACE_SHAPES = {
  vline: f => `<path d="M25 64C25 46 40 34 58 34H87C105 34 120 46 120 64V82C120 96 100 112 72.5 125C45 112 25 96 25 82Z" fill="${f}"/>`,
  oval: f => `<ellipse cx="72.5" cy="78" rx="47" ry="46" fill="${f}"/>`,
  heart: f => `<path d="M25 62C25 44 40 34 58 34H87C105 34 120 44 120 62C124 74 122 92 110 104C100 113 86 119 72.5 123C59 119 45 113 35 104C23 92 21 74 25 62Z" fill="${f}"/>`,
  mochi: f => `<rect x="18" y="36" width="109" height="83" rx="41" fill="${f}"/>`,
  square: f => `<path d="M24 64C24 46 40 34 58 34H87C105 34 121 46 121 64V107C121 113 116 118 110 118H35C29 118 24 113 24 107Z" fill="${f}"/>`,
  slim: f => `<rect x="30" y="30" width="85" height="93" rx="30" fill="${f}"/>`,
  idol: f => `<path d="M28 62C28 45 41 34 58 34H87C104 34 117 45 117 62V80C117 95 97 113 72.5 127C48 113 28 95 28 80Z" fill="${f}"/>`
};
// a shaped face gets separate ears so the jawline stays visible
const SHAPE_EARS = (s) => `<ellipse cx="22" cy="88" rx="10" ry="12" fill="${s.b}"/><ellipse cx="123" cy="88" rx="10" ry="12" fill="${s.b}"/><ellipse cx="23" cy="89" rx="5" ry="7" fill="${s.d}"/><ellipse cx="122" cy="89" rx="5" ry="7" fill="${s.d}"/>`;
// custom eyes (the expression still chooses the mouth)
const EYE_PAIR = f => f(58) + f(87);
const SPA_EYES = {
  sparkle: () => EYE_PAIR(x => `<ellipse cx="${x}" cy="82" rx="6.5" ry="8.5" fill="#1F1B24"/><ellipse cx="${x}" cy="85" rx="4.5" ry="4.5" fill="#6D3FD8"/><circle cx="${x - 2}" cy="78.5" r="2.8" fill="#FFFFFF"/><path d="M${x + 2.5} 85l.9 1.8 1.8.9-1.8.9-.9 1.8-.9-1.8-1.8-.9 1.8-.9z" fill="#FFFFFF"/>`),
  cat: () => EYE_PAIR(x => `<path d="M${x - 7} 83Q${x} 74 ${x + 7} 81Q${x} 90 ${x - 7} 83Z" fill="#FFC83D" stroke="#1F1B24" stroke-width="2"/><ellipse cx="${x}" cy="82.5" rx="1.6" ry="4.5" fill="#1F1B24"/>`),
  doe: () => EYE_PAIR(x => `<ellipse cx="${x}" cy="82" rx="6.5" ry="8" fill="#3B2418"/><circle cx="${x - 2}" cy="79" r="2.6" fill="#FFFFFF"/><circle cx="${x + 2.4}" cy="85" r="1.3" fill="#FFFFFF"/><path d="M${x + (x < 72 ? -6 : 6)} 77l${x < 72 ? -4 : 4} -3M${x + (x < 72 ? -6.5 : 6.5)} 80l${x < 72 ? -4.5 : 4.5} -1" stroke="#1F1B24" stroke-width="1.6" stroke-linecap="round"/>`),
  odd: () => `<circle cx="58" cy="82" r="6.5" fill="#4D8BFF"/><circle cx="87" cy="82" r="6.5" fill="#FFB020"/>` + EYE_PAIR(x => `<circle cx="${x}" cy="82.5" r="3" fill="#1F1B24"/><circle cx="${x - 2}" cy="79.5" r="1.8" fill="#FFFFFF"/>`),
  galaxy: () => EYE_PAIR(x => `<ellipse cx="${x}" cy="82" rx="6.5" ry="8.5" fill="url(#hg_galaxy)"/><circle cx="${x - 2}" cy="79" r="2.2" fill="#FFFFFF"/><circle cx="${x + 2}" cy="86" r="1" fill="#FFFFFF"/><circle cx="${x + 3}" cy="80" r=".8" fill="#FFE48A"/>`)
};
const FACE_MOUTH = {smile: 'smile', cute: 'smile', love: 'smile', gloating: 'smile', sleepy: 'smile', laughs: 'teeth_smile', willing: 'open_mouth', melancholic: 'sad'};
function eyesSVG(L, face) {
  const e = L.eyes; if (!e) return null;
  const eyes = SPA_EYES[e] ? SPA_EYES[e]() : NEMO.eyes[e]; if (!eyes) return null;
  return eyes + (NEMO.mouths[FACE_MOUTH[face] || 'smile'] || '');
}
// facial features that can be combined (L.feats)
function featsSVG(L, skin, stage) {
  const fs = L.feats || []; let s = '';
  if (stage === 'face') {
    if (fs.includes('glow')) s += `<ellipse cx="44" cy="92" rx="5" ry="2.6" fill="#FFFFFF" opacity=".55"/><ellipse cx="101" cy="92" rx="5" ry="2.6" fill="#FFFFFF" opacity=".55"/><ellipse cx="60" cy="62" rx="9" ry="3" fill="#FFFFFF" opacity=".35"/>`;
    if (fs.includes('nose')) s += `<path d="M72.5 82V90Q72.5 92.5 75.5 92" stroke="${skin.d}" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="70.5" cy="86" rx="1.2" ry="3" fill="#FFFFFF" opacity=".5"/>`;
    if (fs.includes('dimples')) s += `<path d="M62 97q-2 2 0 4M83 97q2 2 0 4" stroke="${skin.d}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    if (fs.includes('mole')) s += `<circle cx="84" cy="99" r="1.4" fill="#3B2418"/>`;
    if (fs.includes('lashes')) s += `<path d="M51 79l-4 -2M51 82l-4.5 0M94 79l4 -2M94 82l4.5 0" stroke="#1F1B24" stroke-width="1.8" stroke-linecap="round"/>`;
  }
  if (stage === 'hair' && fs.includes('brows')) s += `<path d="M51 71Q58 67 64 70M81 70Q87 67 94 71" stroke="#3B2418" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return s;
}
// special skins added after the six base tones (index 6+)
const SPA_SKINS = {
  porcelain: {id: 'porcelain', b: '#FFE6D8', d: '#F6CBB6', c: '#FFB6A6'},
  bronze: {id: 'bronze', b: '#C98A5E', d: '#B07148', c: '#D9785F'},
  peach: {id: 'peach', b: '#FFD0B8', d: '#F5AE90', c: '#FF9F8E'},
  elf: {id: 'elf', b: '#C4F0DE', d: '#A2DDC8', c: '#FFB3D1'},
  lilac: {id: 'lilac', b: '#E3D4FF', d: '#C9B4F5', c: '#FF9FD0'},
  starlight: {id: 'starlight', b: '#E9EDFF', d: '#CBD3FA', c: '#B9A8FF'}
};
const BASE_SKINS = SKIN_TONES.length;
for (const k of Object.keys(SPA_SKINS)) SKIN_TONES.push(SPA_SKINS[k]);
const skinIndex = id => SKIN_TONES.findIndex(t => t.id === id);
