/* Draws an exercise pose as inline SVG.
   Stage 3 swaps this for a two-pose tween. The data shape does not change. */

function line(a, b, cls, w) {
  return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="${cls}" stroke-width="${w}"/>`;
}

function dumbbell(x, y, angle) {
  return `<g transform="translate(${x} ${y}) rotate(${angle})" class="fig-bell">
    <rect x="-7" y="-1.4" width="14" height="2.8" rx="1.2"/>
    <rect x="-11.5" y="-5" width="5" height="10" rx="1.6"/>
    <rect x="6.5" y="-5" width="5" height="10" rx="1.6"/>
  </g>`;
}

function limbSet(side, cls, w) {
  let s = '';
  if (side.shoulder && side.elbow) s += line(side.shoulder, side.elbow, cls, w);
  if (side.elbow && side.hand) s += line(side.elbow, side.hand, cls, w);
  if (side.knee) s += line(side.hipAnchor, side.knee, cls, w);
  if (side.knee && side.foot) s += line(side.knee, side.foot, cls, w);
  return s;
}

function drawFigure(pose, opts) {
  const o = opts || {};
  const near = Object.assign({ hipAnchor: pose.hip }, pose.near);
  const far = Object.assign({ hipAnchor: pose.hip }, pose.far);

  const props = (pose.props || [])
    .map(p => line(p.p1, p.p2, 'fig-prop', 7))
    .join('');

  const bells = (pose.db || [])
    .map(d => dumbbell(d[0], d[1], d[2] || 0))
    .join('');

  return `<svg viewBox="0 0 140 124" class="figure ${o.class || ''}" role="img" aria-label="${o.label || ''}" xmlns="http://www.w3.org/2000/svg">
    ${props}
    ${limbSet(far, 'fig-far', 5)}
    ${line(pose.neck, pose.hip, 'fig-far', 5)}
    ${line(pose.neck, pose.hip, 'fig-torso', 8)}
    <circle cx="${pose.head[0]}" cy="${pose.head[1]}" r="8" class="fig-head"/>
    ${limbSet(near, 'fig-near', 5.5)}
    ${bells}
  </svg>`;
}
