/* ===================== ITEM ANIMATION (merged into chibi.js) ===================== */
// The character is drawn in 4-phase loops (idle0..3, walk0..3). chibiInner sets ANIM_PH = 0..3 before drawing parts,
// so any item can move a little from one phase to the next.
let ANIM_PH = 0;
const APH = arr => arr[ANIM_PH % arr.length];
// glowing tips of magic sticks (in the held item's own coordinates)
const ITEM_TIP = {hand_wand: [22, -26], hand_starstaff: [19, -50], hand_moonstaff: [28, -54], hand_scepter: [19, -48], hand_magicbook: [7, -6], hand_lantern: [10, -20], hand_saber: [5.5, -62], hand_trident: [20, -64], hand_sunflower: [15, -30]};
function animItem(id, svg) {
  if (!svg || !id) return svg;
  const p = ANIM_PH;
  switch (id) {
    // breath puffs out and pulls back
    case 'mouth_fire': case 'mouth_frost': { const k = APH([0.45, 0.75, 1, 0.8]); return `<g transform="translate(78 95) scale(${k} ${0.8 + k * 0.2}) translate(-78 -95)" opacity="${0.55 + k * 0.45}">${svg}</g>`; }
    // bubble gum inflates and deflates
    case 'mouth_gum': case 'mouth_rainbowgum': { const k = APH([0.7, 0.88, 1.06, 0.9]); return `<g transform="translate(72.5 100) scale(${k}) translate(-72.5 -100)">${svg}</g>`; }
    case 'mouth_lollipop': case 'mouth_starpop': case 'mouth_pocky': case 'mouth_rose': return `<g transform="rotate(${APH([0, 3, 0, -3])} 76 94)">${svg}</g>`;
    // earrings swing
    case 'ear_hoop': case 'ear_pearl': case 'ear_cherry': case 'ear_star': case 'ear_feather': case 'ear_crystal': case 'ear_moon': case 'ear_dragon': case 'ear_butterfly': case 'ear_galaxy':
      return `<g transform="translate(0 102) skewX(${APH([0, 7, 0, -7])}) translate(0 -102)">${svg}</g>`;
    // floating things bob
    case 'hand_balloon': return `<g transform="translate(${APH([0, 1, 0, -1])} ${APH([0, -3, -5, -2])})">${svg}</g>`;
    case 'hat_halo': return `<g transform="translate(0 ${APH([0, -2, -4, -2])})">${svg}</g>`;
    case 'shoes_cloud': return `<g transform="translate(0 ${APH([0, -1, -2, -1])})">${svg}</g>`;
    case 'pet_phoenix': return svg;
    // capes and tails sway
    case 'back_cape': return `<g transform="translate(72.5 112) skewX(${APH([0, 4, 7, 4])}) translate(-72.5 -112)">${svg}</g>`;
    case 'back_ninetails': return `<g transform="rotate(${APH([-5, 0, 5, 0])} 72.5 140)">${svg}</g>`;
    case 'back_jetpack': return svg + `<path d="M45 150Q49 ${160 + APH([0, 6, 10, 4])} 53 150Z M92 150Q96 ${160 + APH([0, 6, 10, 4])} 100 150Z" fill="#FFE48A" opacity=".85"/>`;
    // glowing face marks pulse
    case 'deco_galaxy': case 'deco_rune': case 'deco_phoenix': case 'deco_heartglitter': return `<g opacity="${APH([0.7, 0.9, 1, 0.9])}">${svg}</g>`;
  }
  const tip = ITEM_TIP[id];
  if (tip) { const r = APH([1.5, 3.5, 5.5, 3]); return svg + sparkle(tip[0] + 6, tip[1] - 4, r, '#FFFFFF') + sparkle(tip[0] - 5, tip[1] + 5, r * 0.6, '#FFE48A'); }
  return svg;
}

/* ---------- specially upgradable Common / Rare items: each tier changes the item itself ---------- */
const SPECIAL_UP = ['hat_cap', 'hat_cat', 'hat_bunny', 'hand_balloon', 'back_cape', 'mouth_gum', 'bag_heart', 'pet_chick'];
function specialTier(id, lv) {
  if (!lv) return '';
  const T = tierSolid(lv);
  switch (id) {
    case 'hand_balloon': {   // more balloons, then a rainbow heart balloon
      let s = '';
      if (lv >= 2) s += `<path d="M6 26Q4 -20 4 -66" stroke="#8E8AA8" stroke-width="1.2" fill="none"/><ellipse cx="4" cy="-84" rx="14" ry="17" fill="#4D8BFF"/><ellipse cx="0" cy="-90" rx="3.5" ry="6" fill="#FFFFFF" opacity=".5"/>`;
      if (lv >= 4) s += `<path d="M6 26Q24 -10 44 -60" stroke="#8E8AA8" stroke-width="1.2" fill="none"/><ellipse cx="46" cy="-76" rx="13" ry="16" fill="#FFC83D"/><ellipse cx="42" cy="-82" rx="3" ry="5" fill="#FFFFFF" opacity=".5"/>`;
      if (lv >= 6) s += `<path d="M6 26Q22 -60 26 -112" stroke="#8E8AA8" stroke-width="1.2" fill="none"/><path transform="translate(10 -140)" d="M16 28C5 20 0 13 0 7C0 1 7 -2 16 6C25 -2 32 1 32 7C32 13 27 20 16 28Z" fill="url(#rb)"/>`;
      return s;
    }
    case 'hat_cap': {        // star badge, gold brim, then a gem crest
      let s = lv >= 2 ? starDots([[72.5, 38, 7]], T) : '';
      if (lv >= 4) s += `<path d="M72 52 Q104 44 134 54 Q104 62 72 58Z" fill="url(#hg_gold)"/>`;
      if (lv >= 6) s += `<path d="M72.5 2L80 14L72.5 26L65 14Z" fill="url(#rb)" stroke="#FFFFFF" stroke-width="1.5"/>`;
      return s;
    }
    case 'hat_cat': case 'hat_bunny': {  // glowing tips, then tiny bells / ribbons
      const tips = id === 'hat_cat' ? [[34, 8], [111, 8]] : [[47, -28], [98, -28]];
      let s = tips.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${3 + lv}" fill="${T}" opacity=".55"/>`).join('');
      if (lv >= 3) s += `<circle cx="50" cy="42" r="5" fill="#FFC83D" stroke="#C98A1A" stroke-width="1.2"/><circle cx="95" cy="42" r="5" fill="#FFC83D" stroke="#C98A1A" stroke-width="1.2"/>`;
      if (lv >= 6) s += `<path d="M62 40L72.5 34L83 40L72.5 46Z" fill="url(#rb)"/>`;
      return s;
    }
    case 'back_cape': {      // stars, gold hem, then a galaxy cape
      let s = '';
      if (lv >= 6) s += `<path d="M50 112L95 112L116 160Q72.5 168 29 160Z" fill="url(#hg_galaxy)" opacity=".85"/>`;
      if (lv >= 2) s += starDots([[36, 150, 3], [108, 150, 3], [40, 134, 2.4], [105, 134, 2.4], [32, 158, 2]], lv >= 6 ? '#FFFFFF' : T);
      if (lv >= 4) s += `<path d="M29 160Q72.5 168 116 160" stroke="#FFC83D" stroke-width="4" fill="none"/>`;
      return s;
    }
    case 'mouth_gum': return lv >= 6 ? `<circle cx="72.5" cy="104" r="14" fill="url(#rb)" opacity=".6"/>` : '';
    case 'bag_heart': return lv >= 5 ? `<path d="M80 128Q70 118 68 126Q72 128 70 134Z M100 128Q110 118 112 126Q108 128 110 134Z" fill="#FFFFFF" stroke="${T}" stroke-width="1.2"/>` : '';
  }
  return '';
}
// one call for any equipped item: its special tier art + its animation
function itemFx(id, lv, svg) {
  if (!svg) return svg;
  let s = svg + specialTier(id, lv || 0);
  if (id === 'mouth_gum' && lv) s = `<g transform="translate(72.5 104) scale(${1 + lv * 0.06}) translate(-72.5 -104)">${s}</g>`;
  return animItem(id, s);
}
