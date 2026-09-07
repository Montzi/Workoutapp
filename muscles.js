/* Targeted muscle infographic. Front and back body maps side by side.
   Regions are plain shapes. Primary lights up solid, secondary lights up faint. */

const MUSCLE_NAMES = {
  chest: 'Chest', frontDelt: 'Front shoulder', sideDelt: 'Side shoulder', rearDelt: 'Rear shoulder',
  biceps: 'Biceps', triceps: 'Triceps', forearm: 'Forearms', abs: 'Abs', obliques: 'Obliques',
  lats: 'Lats', traps: 'Traps', lowerBack: 'Lower back', glutes: 'Glutes',
  hamstrings: 'Hamstrings', quads: 'Quads', calves: 'Calves'
};

/* [shape, ...args] where shape is r = rounded rect (x,y,w,h,r) or e = ellipse (cx,cy,rx,ry) */
const MUSCLE_SHAPES = {
  chest:      [['r', 39, 27, 11, 12, 3], ['r', 54, 27, 11, 12, 3]],
  frontDelt:  [['e', 35, 29, 5.5, 6.5], ['e', 69, 29, 5.5, 6.5]],
  sideDelt:   [['e', 31, 27, 4, 5.5], ['e', 73, 27, 4, 5.5]],
  biceps:     [['r', 28, 36, 8, 15, 4], ['r', 68, 36, 8, 15, 4]],
  forearm:    [['r', 27, 52, 7, 15, 3.5], ['r', 70, 52, 7, 15, 3.5]],
  abs:        [['r', 46, 41, 12, 17, 3]],
  obliques:   [['r', 38, 42, 6, 15, 3], ['r', 60, 42, 6, 15, 3]],
  quads:      [['r', 40, 70, 10, 23, 5], ['r', 54, 70, 10, 23, 5]],

  traps:      [['r', 138, 21, 20, 13, 5]],
  rearDelt:   [['e', 131, 29, 5.5, 6.5], ['e', 165, 29, 5.5, 6.5]],
  lats:       [['r', 134, 34, 11, 19, 3], ['r', 151, 34, 11, 19, 3]],
  lowerBack:  [['r', 141, 52, 14, 9, 3]],
  triceps:    [['r', 124, 36, 8, 15, 4], ['r', 164, 36, 8, 15, 4]],
  glutes:     [['r', 135, 61, 11, 12, 5], ['r', 150, 61, 11, 12, 5]],
  hamstrings: [['r', 136, 74, 10, 19, 5], ['r', 150, 74, 10, 19, 5]],
  calves:     [['r', 137, 94, 8, 16, 4], ['r', 151, 94, 8, 16, 4]]
};

const BODY_BASE = [
  /* front */
  ['c', 52, 13, 7.5], ['r', 49, 19, 6, 6, 2], ['r', 34, 24, 36, 36, 6], ['r', 40, 56, 24, 14, 4],
  ['r', 28, 30, 8, 38, 4], ['r', 68, 30, 8, 38, 4],
  ['r', 40, 68, 10, 26, 5], ['r', 54, 68, 10, 26, 5],
  ['r', 41, 92, 8, 20, 4], ['r', 55, 92, 8, 20, 4],
  /* back */
  ['c', 148, 13, 7.5], ['r', 145, 19, 6, 6, 2], ['r', 130, 24, 36, 36, 6], ['r', 136, 56, 24, 14, 4],
  ['r', 124, 30, 8, 38, 4], ['r', 164, 30, 8, 38, 4],
  ['r', 136, 68, 10, 26, 5], ['r', 150, 68, 10, 26, 5],
  ['r', 137, 92, 8, 20, 4], ['r', 151, 92, 8, 20, 4]
];

function shapeSVG(s, cls) {
  if (s[0] === 'c') return `<circle cx="${s[1]}" cy="${s[2]}" r="${s[3]}" class="${cls}"/>`;
  if (s[0] === 'e') return `<ellipse cx="${s[1]}" cy="${s[2]}" rx="${s[3]}" ry="${s[4]}" class="${cls}"/>`;
  return `<rect x="${s[1]}" y="${s[2]}" width="${s[3]}" height="${s[4]}" rx="${s[5]}" class="${cls}"/>`;
}

function muscleMap(muscles) {
  const primary = muscles.primary || [];
  const secondary = muscles.secondary || [];
  const base = BODY_BASE.map(s => shapeSVG(s, 'mm-base')).join('');

  const paint = (list, cls) => list
    .flatMap(m => (MUSCLE_SHAPES[m] || []).map(s => shapeSVG(s, cls)))
    .join('');

  const named = primary.map(m => MUSCLE_NAMES[m] || m).join(', ');
  const alsoNamed = secondary.map(m => MUSCLE_NAMES[m] || m).join(', ');

  return `
    <div class="mmap">
      <svg viewBox="20 2 156 120" class="mmap-svg" role="img"
           aria-label="Muscles worked: ${named}${alsoNamed ? '. Also: ' + alsoNamed : ''}">
        ${base}
        ${paint(secondary, 'mm-second')}
        ${paint(primary, 'mm-first')}
        <text x="52" y="119" class="mm-cap">front</text>
        <text x="148" y="119" class="mm-cap">back</text>
      </svg>
      <div class="mmap-key">
        <p class="mm-line"><span class="mm-dot is-first"></span>${named}</p>
        ${alsoNamed ? `<p class="mm-line"><span class="mm-dot is-second"></span>${alsoNamed}</p>` : ''}
      </div>
    </div>`;
}
