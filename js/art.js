// Ilustraciones SVG originales del camino. Cada función devuelve una cadena SVG decorativa
// (aria-hidden); la accesibilidad la ponen los botones que las contienen.

const svg = (viewBox, body, cls = '') =>
  `<svg class="${cls}" viewBox="${viewBox}" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

const HEART = 'M0 -6 C-4 -14 -16 -11 -14 -1 C-12 6 0 13 0 13 C0 13 12 6 14 -1 C16 -11 4 -14 0 -6Z';

// state: 'locked' | 'current' | 'unlocked' | 'solved'
export function gift(state = 'locked') {
  const open = state === 'solved';
  const ajar = state === 'unlocked';
  const lidTransform = open ? 'translate(-14 -20) rotate(-24 50 40)' : ajar ? 'translate(-3 -7) rotate(-9 50 40)' : '';
  const heart = open
    ? `<g class="gift-heart" transform="translate(52 30) scale(1.15)"><path d="${HEART}" fill="#B2284E"/><path d="M-8 -6 C-8 -9 -5 -10 -3 -8" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/></g>`
    : '';
  const glow = ajar ? '<ellipse cx="50" cy="45" rx="26" ry="5" fill="#FFE9A8" opacity=".9"/>' : '';
  return svg('0 0 100 100', `
    <ellipse cx="50" cy="93" rx="34" ry="5.5" fill="#2F4A35" opacity=".14"/>
    <g class="gift-box">
      <rect x="18" y="44" width="64" height="47" rx="9" fill="#F2B8C6"/>
      <rect x="18" y="44" width="64" height="11" fill="#E08DA4" opacity=".55"/>
      <rect x="24" y="59" width="6" height="24" rx="3" fill="#fff" opacity=".4"/>
      <rect x="45" y="44" width="10" height="47" fill="#B2284E"/>
      <rect x="47" y="44" width="2.5" height="47" fill="#fff" opacity=".25"/>
    </g>
    ${glow}
    <g class="gift-lid" transform="${lidTransform}">
      <rect x="12" y="31" width="76" height="17" rx="6" fill="#F7C9D4"/>
      <rect x="12" y="43" width="76" height="5" rx="2.5" fill="#E8A3B6" opacity=".7"/>
      <rect x="45" y="31" width="10" height="17" fill="#C2335D"/>
      <path d="M50 32 C40 12 21 17 28 29 C32 35 44 34 50 32Z" fill="#B2284E"/>
      <path d="M50 32 C60 12 79 17 72 29 C68 35 56 34 50 32Z" fill="#B2284E"/>
      <path d="M33 25 C36 21 41 22 44 27" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".35"/>
      <path d="M47 33 L40 44 M53 33 L60 44" stroke="#9A1F43" stroke-width="5" stroke-linecap="round"/>
      <circle cx="50" cy="31" r="5.5" fill="#8E1C3E"/>
    </g>
    ${heart}`, `art gift gift--${state}`);
}

export function house() {
  return svg('0 0 100 100', `
    <ellipse cx="50" cy="92" rx="40" ry="5.5" fill="#2F4A35" opacity=".14"/>
    <rect x="21" y="47" width="58" height="42" rx="3" fill="#FFF7EC" stroke="#E7D7C3" stroke-width="2"/>
    <rect x="21" y="78" width="58" height="11" fill="#F0E2CF"/>
    <path d="M12 52 L50 21 L88 52 Z" fill="#C46A4A"/>
    <path d="M12 52 L50 21 L88 52" fill="none" stroke="#A9533A" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    <rect x="43.5" y="63" width="13" height="26" rx="2" fill="#7A5236"/>
    <circle cx="53.5" cy="77" r="1.2" fill="#E8C547"/>
    <rect x="27" y="59" width="11" height="11" rx="1.5" fill="#BFDCEB" stroke="#7A5236" stroke-width="2.2"/>
    <rect x="62" y="59" width="11" height="11" rx="1.5" fill="#BFDCEB" stroke="#7A5236" stroke-width="2.2"/>
    <g fill="#E58AA6"><circle cx="27" cy="88" r="3"/><circle cx="33" cy="87" r="2.5"/><circle cx="67" cy="88" r="3"/><circle cx="73" cy="87" r="2.5"/></g>
    <g fill="#6E9A62"><circle cx="30" cy="90" r="2.4"/><circle cx="70" cy="90" r="2.4"/></g>`, 'art house');
}

// Parada todavía desconocida: letrero de madera con interrogación.
export function signpost() {
  return svg('0 0 100 100', `
    <ellipse cx="50" cy="92" rx="22" ry="5" fill="#2F4A35" opacity=".14"/>
    <rect x="46" y="40" width="8" height="52" rx="2.5" fill="#9A7A5A"/>
    <rect x="20" y="24" width="60" height="28" rx="8" fill="#D2B48C"/>
    <rect x="20" y="24" width="60" height="28" rx="8" fill="none" stroke="#A88762" stroke-width="2.5"/>
    <text x="50" y="45.5" text-anchor="middle" font-family="Georgia, serif" font-size="21" font-weight="700" fill="#5B4330">?</text>`, 'art signpost');
}

// Meta del camino: un corazón grande. done = aventura terminada.
export function goal(done = false) {
  const fill = done ? '#B2284E' : '#E9DCD3';
  const shine = done ? '#fff' : '#fff';
  return svg('0 0 100 100', `
    <ellipse cx="50" cy="93" rx="26" ry="5" fill="#2F4A35" opacity=".12"/>
    <g transform="translate(50 50) scale(2.6)"><path d="${HEART}" fill="${fill}"/>
    <path d="M-8 -6 C-8 -9 -5 -10 -3 -8" stroke="${shine}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".55"/></g>`, `art goal ${done ? 'goal--done' : ''}`);
}

export function car() {
  return svg('0 0 64 40', `
    <ellipse cx="32" cy="35" rx="25" ry="3" fill="#2F4A35" opacity=".18"/>
    <path d="M5 27 v-7 c0-3.5 2.5-6 6-6 h6 l7-8 h17 l8 8 h3.5 c3.5 0 6 2.5 6 6 v7 z" fill="#F7F4EF" stroke="#8A8F93" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M25.5 8 h7 v6 h-12z M35 8 h5.5 l5.5 6 h-11z" fill="#A9CFE2"/>
    <rect x="5" y="21" width="5" height="3" rx="1.5" fill="#E8C547"/>
    <circle cx="17" cy="28" r="5.5" fill="#3A3A3A"/><circle cx="47" cy="28" r="5.5" fill="#3A3A3A"/>
    <circle cx="17" cy="28" r="2.2" fill="#C9C9C9"/><circle cx="47" cy="28" r="2.2" fill="#C9C9C9"/>`, 'art car');
}

export function frailejon() {
  const leaves = Array.from({ length: 11 }, (_, i) => {
    const a = -100 + i * 20;
    return `<ellipse cx="30" cy="16" rx="2.6" ry="12" transform="rotate(${a} 30 28)"/>`;
  }).join('');
  return svg('0 0 60 80', `
    <rect x="27" y="30" width="6" height="46" rx="3" fill="#8C7B5A"/>
    <path d="M27 40 h6 M27 50 h6 M27 60 h6" stroke="#6F6046" stroke-width="1.4"/>
    <g fill="#A9B98A">${leaves}</g>
    <g fill="#C3CFA6">${leaves.replace(/ry="12"/g, 'ry="8"')}</g>
    <g fill="#E8C547"><circle cx="22" cy="9" r="2.6"/><circle cx="31" cy="5" r="2.8"/><circle cx="39" cy="10" r="2.4"/></g>`, 'art deco frailejon');
}

export function cloud() {
  return svg('0 0 120 50', `
    <g fill="#fff" opacity=".9"><ellipse cx="40" cy="32" rx="30" ry="14"/><ellipse cx="66" cy="24" rx="26" ry="18"/><ellipse cx="90" cy="34" rx="24" ry="12"/></g>`, 'art deco cloud');
}

export function hill(tone = 0) {
  const [a, b] = [['#CFDDBA', '#B7CB9E'], ['#DCE5C8', '#C4D3AB'], ['#C9D8C9', '#AFC4B0']][tone % 3];
  return svg('0 0 200 80', `
    <path d="M0 80 C30 30 70 10 110 30 C140 45 170 25 200 40 L200 80 Z" fill="${a}"/>
    <path d="M0 80 C40 50 90 45 130 58 C160 66 185 55 200 60 L200 80 Z" fill="${b}"/>`, 'art deco hill');
}

export function flowers() {
  return svg('0 0 50 30', `
    <g fill="#6E9A62"><path d="M12 30 C12 22 10 18 8 14" stroke="#6E9A62" stroke-width="1.6" fill="none"/><path d="M30 30 C30 20 33 16 36 12" stroke="#6E9A62" stroke-width="1.6" fill="none"/></g>
    <g fill="#E58AA6"><circle cx="8" cy="12" r="3.4"/><circle cx="36" cy="10" r="3.4"/></g>
    <g fill="#F2C94C"><circle cx="8" cy="12" r="1.3"/><circle cx="36" cy="10" r="1.3"/></g>
    <circle cx="22" cy="20" r="2.6" fill="#fff"/><circle cx="22" cy="20" r="1" fill="#F2C94C"/>`, 'art deco flowers');
}

export function padlock() {
  return svg('0 0 24 24', `
    <path d="M7 11 V8 a5 5 0 0 1 10 0 v3" fill="none" stroke="#6B6B6B" stroke-width="2.4"/>
    <rect x="4.5" y="10.5" width="15" height="11" rx="3" fill="#8A8A8A"/>
    <circle cx="12" cy="16" r="1.8" fill="#EDEDED"/>`, 'art padlock');
}

export function mapIcon() {
  return svg('0 0 24 24', `
    <path d="M3 6 l6-2 6 2 6-2 v14 l-6 2 -6-2 -6 2z" fill="#F7EBDD" stroke="#2F4A35" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M9 4 v14 M15 6 v14" stroke="#2F4A35" stroke-width="1.4"/>
    <path d="M5.5 13 c2-3 4 1 6.5-2 s4 1 6-2" stroke="#B2284E" stroke-width="1.5" fill="none" stroke-dasharray="1.6 1.8" stroke-linecap="round"/>`, 'art icon');
}

export const heartPath = HEART;

// ---------- Mapa de niveles: islas del páramo sobre la laguna ----------

const ISLANDS = [
  'M18 52 C12 34 46 20 98 22 C150 20 190 32 184 52 C180 70 142 78 100 78 C56 78 22 70 18 52Z',
  'M14 50 C16 30 60 18 104 24 C146 18 192 36 184 56 C176 74 130 76 96 76 C52 80 12 68 14 50Z',
  'M22 54 C10 36 52 16 96 24 C138 14 186 30 182 50 C186 70 140 80 104 76 C64 82 30 72 22 54Z',
];

// variant 0..2 ; dim = isla todavía no alcanzada (colores apagados)
export function island(variant = 0, dim = false) {
  const d = ISLANDS[variant % 3];
  const c = dim
    ? { ring: '#CFE9EC', earth: '#B9A58F', earthDark: '#9E8B76', lip: '#93A889', top: '#ADC1A2', hi: '#C2D3B8', stone: '#E7E1D6' }
    : { ring: '#D9F2F2', earth: '#C48A5A', earthDark: '#A26C42', lip: '#6E9B45', top: '#93C35F', hi: '#B4D97D', stone: '#F4EBD9' };
  const deco = variant % 3 === 0
    ? `<ellipse cx="46" cy="58" rx="7" ry="3.2" fill="${c.stone}"/><ellipse cx="58" cy="63" rx="4.5" ry="2.2" fill="${c.stone}"/><ellipse cx="150" cy="60" rx="6" ry="2.8" fill="${c.stone}"/>
       <g fill="${dim ? '#D7C3C9' : '#F2A3BC'}"><circle cx="160" cy="44" r="2.6"/><circle cx="166" cy="48" r="2.2"/><circle cx="36" cy="44" r="2.2"/></g>`
    : variant % 3 === 1
    ? `<ellipse cx="40" cy="60" rx="6" ry="2.8" fill="${c.stone}"/><ellipse cx="156" cy="56" rx="8" ry="3.4" fill="${c.stone}"/><ellipse cx="146" cy="62" rx="4" ry="2" fill="${c.stone}"/>
       <path d="M30 46 q4-9 8 0 q4-9 8 0" fill="none" stroke="${dim ? '#8FA287' : '#5E8C3A'}" stroke-width="2.2" stroke-linecap="round"/>
       <g fill="${dim ? '#E5E0C8' : '#FFF3B0'}"><circle cx="170" cy="42" r="2.4"/><circle cx="164" cy="38" r="2"/></g>`
    : `<ellipse cx="52" cy="62" rx="7.5" ry="3" fill="${c.stone}"/><ellipse cx="140" cy="62" rx="5" ry="2.4" fill="${c.stone}"/>
       <path d="M160 46 q3-8 6 0 q3-8 6 0" fill="none" stroke="${dim ? '#8FA287' : '#5E8C3A'}" stroke-width="2.2" stroke-linecap="round"/>
       <g fill="${dim ? '#D7C3C9' : '#F2A3BC'}"><circle cx="34" cy="48" r="2.4"/><circle cx="40" cy="44" r="2"/></g>`;
  return svg('0 0 200 110', `
    <path d="${d}" transform="translate(0 20) scale(1 1.04)" fill="${c.ring}" opacity=".8"/>
    <path d="${d}" transform="translate(0 16)" fill="${c.earthDark}"/>
    <path d="${d}" transform="translate(0 11)" fill="${c.earth}"/>
    <path d="M40 84 q4 6 8 0 M120 86 q4 7 8 0 M86 88 q3 5 6 0" fill="none" stroke="${c.earthDark}" stroke-width="2" stroke-linecap="round" opacity=".7"/>
    <path d="${d}" transform="translate(0 4)" fill="${c.lip}"/>
    <path d="${d}" fill="${c.top}"/>
    <path d="${d}" transform="translate(30 10) scale(.62 .5)" fill="${c.hi}" opacity=".7"/>
    ${deco}`, `art island ${dim ? 'island--dim' : ''}`);
}

// Piedra para el camino entre islas
export function stone(dim = false) {
  const [a, b, c] = dim ? ['#C9B8A6', '#E0D3C4', '#A99886'] : ['#C98F5E', '#E3B385', '#9E6A3F'];
  return svg('0 0 40 24', `
    <ellipse cx="20" cy="16" rx="17" ry="7" fill="#fff" opacity=".35"/>
    <ellipse cx="20" cy="13" rx="16" ry="8" fill="${c}"/>
    <ellipse cx="20" cy="10" rx="15" ry="7" fill="${a}"/>
    <ellipse cx="17" cy="8" rx="8" ry="3" fill="${b}" opacity=".9"/>`, 'art stone');
}

// Insignia redonda. kind: 'number' | 'lock' | 'house' | 'heart'
export function badge({ kind = 'number', n = 1, active = true } = {}) {
  const [g1, g2, ring] = active ? ['#F0618A', '#B2284E', '#FFE3EA'] : ['#B9BEC4', '#868C93', '#F1F2F3'];
  const id = `bg${Math.random().toString(36).slice(2, 8)}`;
  const inner = kind === 'lock'
    ? '<g transform="translate(20 19)"><path d="M-5 0 V-4 a5 5 0 0 1 10 0 V0" fill="none" stroke="#fff" stroke-width="2.6"/><rect x="-7.5" y="-1" width="15" height="11" rx="3" fill="#fff"/></g>'
    : kind === 'house'
    ? '<path d="M11 21 L20 13 L29 21 V29 H11Z" fill="#fff"/><rect x="18" y="23" width="4" height="6" fill="#B2284E"/>'
    : kind === 'heart'
    ? `<g transform="translate(20 21) scale(.62)"><path d="${HEART}" fill="#fff"/></g>`
    : `<text x="20" y="27" text-anchor="middle" font-family="ui-rounded, 'SF Pro Rounded', system-ui, sans-serif" font-size="19" font-weight="800" fill="#fff">${n}</text>`;
  return svg('0 0 40 40', `
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${g1}"/><stop offset="1" stop-color="${g2}"/></linearGradient></defs>
    <circle cx="20" cy="22" r="17" fill="#000" opacity=".15"/>
    <circle cx="20" cy="20" r="18" fill="${ring}"/>
    <circle cx="20" cy="20" r="14.5" fill="url(#${id})"/>
    <path d="M9 16 a12 10 0 0 1 22 0" fill="none" stroke="#fff" stroke-width="2" opacity=".35" stroke-linecap="round"/>
    ${inner}`, `art badge ${active ? '' : 'badge--off'}`);
}

// Tres corazoncitos en arco, como las estrellas de un nivel superado
export function heartsArc(filled = 3) {
  const pos = [[10, 14, -14], [26, 8, 0], [42, 14, 14]];
  return svg('0 0 52 24', pos.map(([x, y, r], i) =>
    `<g transform="translate(${x} ${y}) rotate(${r}) scale(.48)"><path d="${HEART}" fill="${i < filled ? '#E23D6B' : '#E9DCD3'}" stroke="#fff" stroke-width="3"/></g>`).join(''), 'art hearts-arc');
}

export function ripple() {
  return svg('0 0 80 20', '<path d="M4 12 q10-8 20 0 t20 0 t20 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".45"/>', 'art deco ripple');
}

export function giftIcon() {
  return svg('0 0 24 24', '<rect x="4" y="10" width="16" height="11" rx="2" fill="#fff"/><rect x="3" y="7" width="18" height="4.5" rx="1.5" fill="#fff"/><rect x="11" y="7" width="2.2" height="14" fill="#B2284E"/><path d="M12 7 C9 2 5 4 7 6.6 C8.4 8 11 7.4 12 7Z M12 7 C15 2 19 4 17 6.6 C15.6 8 13 7.4 12 7Z" fill="#fff"/>', 'art icon');
}
