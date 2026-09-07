/* Draws an exercise as an SVG figure and animates it between its two poses.
   One requestAnimationFrame loop drives every figure on the page. */

const JOINT_LINES = [
  ['far', 'shoulder', 'elbow'], ['far', 'elbow', 'hand'],
  ['far', 'hip', 'knee'], ['far', 'knee', 'foot'],
  ['near', 'shoulder', 'elbow'], ['near', 'elbow', 'hand'],
  ['near', 'hip', 'knee'], ['near', 'knee', 'foot']
];

function mergePose(base, over) {
  if (!over) return base;
  const out = {
    props: base.props,
    head: over.head || base.head,
    neck: over.neck || base.neck,
    hip: over.hip || base.hip,
    near: Object.assign({}, base.near, over.near || {}),
    far: Object.assign({}, base.far, over.far || {}),
    db: over.db || base.db
  };
  return out;
}

const lerp = (a, b, t) => a + (b - a) * t;
const lerpPt = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

function poseAt(ex, t) {
  const a = ex.pose;
  const b = mergePose(ex.pose, ex.end);
  const side = s => {
    const o = {};
    ['shoulder', 'elbow', 'hand', 'knee', 'foot'].forEach(j => {
      if (a[s][j]) o[j] = lerpPt(a[s][j], b[s][j] || a[s][j], t);
    });
    return o;
  };
  return {
    props: a.props,
    head: lerpPt(a.head, b.head, t),
    neck: lerpPt(a.neck, b.neck, t),
    hip: lerpPt(a.hip, b.hip, t),
    near: side('near'),
    far: side('far'),
    db: a.db.map((d, i) => {
      const e = (b.db && b.db[i]) || d;
      return [lerp(d[0], e[0], t), lerp(d[1], e[1], t), lerp(d[2] || 0, e[2] || 0, t)];
    })
  };
}

function figureSVG(ex, opts) {
  const o = opts || {};
  const p = ex.pose;
  const props = (p.props || [])
    .map(q => `<line x1="${q.p1[0]}" y1="${q.p1[1]}" x2="${q.p2[0]}" y2="${q.p2[1]}" class="fig-prop" stroke-width="7"/>`)
    .join('');

  const limbs = JOINT_LINES.map(([side, from, to]) => {
    if (!p[side][to]) return '';
    const cls = side === 'near' ? 'fig-near' : 'fig-far';
    const w = side === 'near' ? 5.5 : 5;
    return `<line data-j="${side}.${from}.${to}" class="${cls}" stroke-width="${w}" x1="0" y1="0" x2="0" y2="0"/>`;
  }).join('');

  const bells = p.db
    .map((d, i) => `<g data-db="${i}" class="fig-bell">
      <rect x="-7" y="-1.4" width="14" height="2.8" rx="1.2"/>
      <rect x="-11.5" y="-5" width="5" height="10" rx="1.6"/>
      <rect x="6.5" y="-5" width="5" height="10" rx="1.6"/>
    </g>`).join('');

  return `<svg viewBox="0 0 140 124" class="figure" data-ex="${ex.id}" data-phase="${o.phase || 0}"
    role="img" aria-label="${ex.name} technique" xmlns="http://www.w3.org/2000/svg">
    ${props}
    ${limbs.replace(/data-j="far/g, 'data-j="far')}
    <line data-j="torso.far" class="fig-far" stroke-width="5" x1="0" y1="0" x2="0" y2="0"/>
    <line data-j="torso.near" class="fig-torso" stroke-width="8" x1="0" y1="0" x2="0" y2="0"/>
    <circle data-j="head" class="fig-head" r="8" cx="0" cy="0"/>
    ${bells}
  </svg>`;
}

/* ---------- animation loop ---------- */

function paintFigure(svg, ex, t) {
  const p = poseAt(ex, t);
  svg.querySelectorAll('[data-j]').forEach(el => {
    const j = el.dataset.j;
    if (j === 'head') { el.setAttribute('cx', p.head[0]); el.setAttribute('cy', p.head[1]); return; }
    if (j === 'torso.near' || j === 'torso.far') {
      el.setAttribute('x1', p.neck[0]); el.setAttribute('y1', p.neck[1]);
      el.setAttribute('x2', p.hip[0]); el.setAttribute('y2', p.hip[1]);
      return;
    }
    const [side, from, to] = j.split('.');
    const a = from === 'hip' ? p.hip : p[side][from];
    const b = p[side][to];
    if (!a || !b) return;
    el.setAttribute('x1', a[0]); el.setAttribute('y1', a[1]);
    el.setAttribute('x2', b[0]); el.setAttribute('y2', b[1]);
  });
  svg.querySelectorAll('[data-db]').forEach(g => {
    const d = p.db[Number(g.dataset.db)];
    if (d) g.setAttribute('transform', `translate(${d[0].toFixed(2)} ${d[1].toFixed(2)}) rotate(${d[2].toFixed(2)})`);
  });
}

let animating = false;

function tickFigures(now) {
  const svgs = document.querySelectorAll('svg.figure');
  svgs.forEach(svg => {
    const ex = byId(svg.dataset.ex);
    if (!ex) return;
    const period = (ex.tempo || 2.8) * 1000;
    const phase = Number(svg.dataset.phase) || 0;
    const u = (((now / period) + phase) % 1 + 1) % 1;
    paintFigure(svg, ex, (1 - Math.cos(2 * Math.PI * u)) / 2);
  });
  requestAnimationFrame(tickFigures);
}

function startFigureLoop() {
  if (animating || typeof requestAnimationFrame !== 'function') return;
  animating = true;
  requestAnimationFrame(tickFigures);
}
