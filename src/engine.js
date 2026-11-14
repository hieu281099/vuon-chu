/* ===================== ENGINE: assets, recolor, characters, terrain ===================== */
const TS = 32;           // native tile size
const FR = 64;           // LPC character frame
let MANIFEST = null;
const IMGS = {};

function loadImage(src) {
  if (IMGS[src]) return IMGS[src];
  const p = new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error('Không tải được ' + src)); im.src = src; });
  IMGS[src] = p; return p;
}
const SHEET = {};
async function loadWorld(onProgress) { onProgress && onProgress(1); }

/* ---- palette recolor (nearest colour of the base ramp -> same index of the target ramp) ---- */
const hexRgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
function rampMap(mat, variant) {
  const P = MANIFEST.palettes[mat]; if (!P || !variant || variant === P.base || !P.colors[variant]) return null;
  return {src: P.colors[P.base].map(hexRgb), dst: P.colors[variant].map(hexRgb)};
}
function recolorCanvas(cv, map) {
  if (!map) return cv;
  const g = cv.getContext('2d'), d = g.getImageData(0, 0, cv.width, cv.height), a = d.data, cache = new Map();
  for (let i = 0; i < a.length; i += 4) {
    if (!a[i + 3]) continue;
    const key = (a[i] << 16) | (a[i + 1] << 8) | a[i + 2];
    let to = cache.get(key);
    if (to === undefined) {
      let best = -1, bd = 1e9;
      for (let k = 0; k < map.src.length; k++) { const s = map.src[k], dd = (a[i] - s[0]) ** 2 + (a[i + 1] - s[1]) ** 2 + (a[i + 2] - s[2]) ** 2; if (dd < bd) { bd = dd; best = k; } }
      to = bd <= 400 ? map.dst[best] : null; cache.set(key, to);
    }
    if (to) { a[i] = to[0]; a[i + 1] = to[1]; a[i + 2] = to[2]; }
  }
  g.putImageData(d, 0, 0); return cv;
}

/* ---- character helpers (chibi SVG) ---- */
function portraitURL(L) { return portraitSVG(L); }
function pimg(L, size) { return `src="${portraitSVG(L, {full: size >= 3, hand: size >= 3})}"`; }
function hydratePortraits() {}
function whenSheet() { return Promise.resolve(); }
// brighten LPC sheets once so the world reads as a modern, sunny cartoon
function brighten(img) {
  try { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d');
    g.filter = 'saturate(1.35) brightness(1.08) contrast(1.04)'; g.drawImage(img, 0, 0); return c; } catch (e) { return img; }
}

/* ---- LPC terrain autotile (3x6 format, 16 px quadrants) ---- */
// cell coords in 32px cells of the terrain sheet
const HOLE = {tl: [2, 1], tr: [1, 1], bl: [2, 0], br: [1, 0]};
const OUTER = {tl: [0, 2], tr: [2, 2], bl: [0, 4], br: [2, 4]};
const QOFF = {tl: [0, 0], tr: [16, 0], bl: [0, 16], br: [16, 16]};
function drawAutotile(g, sheet, has, x, y, X, Y, variantSeed) {
  // has(dx,dy): neighbour is same terrain
  const N = has(0, -1), S = has(0, 1), W = has(-1, 0), E = has(1, 0);
  if (N && S && W && E && has(-1, -1) && has(1, -1) && has(-1, 1) && has(1, 1)) {
    if (variantSeed >= 0 && variantSeed % 7 === 0) { const v = (variantSeed >> 3) % 3; g.drawImage(sheet, v * TS, 5 * TS, TS, TS, X, Y, TS, TS); }
    else g.drawImage(sheet, TS, 3 * TS, TS, TS, X, Y, TS, TS);
    return;
  }
  for (const q of ['tl', 'tr', 'bl', 'br']) {
    const hx = q[1] === 'l' ? -1 : 1, vy = q[0] === 't' ? -1 : 1;
    const h = has(hx, 0), v = has(0, vy), d = has(hx, vy);
    let cell;
    if (h && v) cell = d ? [1, 3] : HOLE[q];
    else if (!h && !v) cell = OUTER[q];
    else if (h) cell = [1, vy < 0 ? 2 : 4];
    else cell = [hx < 0 ? 0 : 2, 3];
    const [ox, oy] = QOFF[q];
    g.drawImage(sheet, cell[0] * TS + ox, cell[1] * TS + oy, 16, 16, X + ox, Y + oy, 16, 16);
  }
}
const hash2 = (x, y, k = 0) => { let h = (x * 374761393 + y * 668265263 + k * 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0); };

/* ---- 9-slice from a source rect, tiling edges and centre (pixel art safe) ---- */
function nineSlice(g, img, sx, sy, sw, sh, c, X, Y, W, H) {
  const tile = (ix, iy, iw, ih, dx, dy, dw, dh) => {
    for (let yy = 0; yy < dh; yy += ih) for (let xx = 0; xx < dw; xx += iw) {
      const w = Math.min(iw, dw - xx), h = Math.min(ih, dh - yy);
      g.drawImage(img, ix, iy, w, h, dx + xx, dy + yy, w, h);
    }
  };
  const mw = sw - 2 * c, mh = sh - 2 * c, MW = W - 2 * c, MH = H - 2 * c;
  tile(sx, sy, c, c, X, Y, c, c); tile(sx + sw - c, sy, c, c, X + W - c, Y, c, c);
  tile(sx, sy + sh - c, c, c, X, Y + H - c, c, c); tile(sx + sw - c, sy + sh - c, c, c, X + W - c, Y + H - c, c, c);
  tile(sx + c, sy, mw, c, X + c, Y, MW, c); tile(sx + c, sy + sh - c, mw, c, X + c, Y + H - c, MW, c);
  tile(sx, sy + c, c, mh, X, Y + c, c, MH); tile(sx + sw - c, sy + c, c, mh, X + W - c, Y + c, c, MH);
  tile(sx + c, sy + c, mw, mh, X + c, Y + c, MW, MH);
}
