/* Rack. Stage 1: schedule, date awareness, exercise browsing.
   The workout runner lands in Stage 2. */

const SPLITS = {
  3: [
    { mark: 'A', title: 'Push', groups: ['chest', 'shoulders', 'triceps'], weekday: 1 },
    { mark: 'B', title: 'Pull', groups: ['back', 'biceps'], weekday: 3 },
    { mark: 'C', title: 'Legs and core', groups: ['legs', 'core'], weekday: 5 }
  ],
  5: [
    { mark: '1', title: 'Chest', groups: ['chest'], weekday: 1 },
    { mark: '2', title: 'Back', groups: ['back'], weekday: 2 },
    { mark: '3', title: 'Shoulders', groups: ['shoulders'], weekday: 3 },
    { mark: '4', title: 'Arms', groups: ['biceps', 'triceps'], weekday: 4 },
    { mark: '5', title: 'Legs and core', groups: ['legs', 'core'], weekday: 5 }
  ]
};

const store = {
  get(k, fallback) {
    try { const v = localStorage.getItem('rack.' + k); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  },
  set(k, v) {
    try { localStorage.setItem('rack.' + k, JSON.stringify(v)); } catch (e) { /* private mode */ }
  }
};

const state = {
  split: store.get('split', 3) === 5 ? 5 : 3,
  selected: null,      // ISO date string being viewed, null means today
  exercise: null       // exercise id when the detail screen is open
};

/* ---------- dates ---------- */

const isoDay = d => ((d.getDay() + 6) % 7) + 1;          // 1 Mon ... 7 Sun
const key = d => d.toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

function today() {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d;
}

function viewedDate() {
  return state.selected ? new Date(state.selected + 'T12:00:00') : today();
}

function weekOf(d) {
  const start = addDays(d, -(isoDay(d) - 1));
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

function sessionFor(date) {
  return SPLITS[state.split].find(s => s.weekday === isoDay(date)) || null;
}

function nextTrainingDay(from) {
  for (let i = 1; i <= 7; i++) {
    const d = addDays(from, i);
    if (sessionFor(d)) return { date: d, session: sessionFor(d) };
  }
  return null;
}

const fmtLong = d => d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
const fmtShort = d => d.toLocaleDateString(undefined, { weekday: 'long' });

/* ---------- derived ---------- */

function sessionExercises(session) {
  return session.groups.map(g => ({ group: g, items: byGroup(g) }));
}

function sessionTotals(session) {
  const items = session.groups.flatMap(byGroup);
  return { exercises: items.length, sets: items.reduce((n, e) => n + e.sets, 0) };
}

/* ---------- render ---------- */

const app = document.getElementById('app');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function render() {
  app.innerHTML = state.exercise ? detailView() : homeView();
  window.scrollTo(0, 0);
  bind();
}

function homeView() {
  const d = viewedDate();
  const session = sessionFor(d);
  const isToday = key(d) === key(today());

  return `
    <header class="masthead">
      <div class="wordmark">Rack</div>
      <div class="datestamp">${esc(fmtLong(d))}${isToday ? '' : ' &middot; not today'}</div>
    </header>
    ${session ? heroTraining(d, session, isToday) : heroRest(d)}
    ${splitSwitch()}
    ${weekStrip(d)}
    ${session ? exerciseList(session) : ''}
  `;
}

function heroTraining(d, session, isToday) {
  const t = sessionTotals(session);
  const groups = session.groups.map(g => GROUPS[g].name).join(', ');
  const showGroups = groups.toLowerCase() !== session.title.toLowerCase();
  return `
    <section class="hero">
      <div class="hero-mark">${esc(session.mark)}</div>
      <h1 class="hero-title">${esc(session.title)}</h1>
      ${showGroups ? `<p class="hero-groups">${esc(groups)}</p>` : ''}
      <p class="hero-count">${t.exercises} exercises &middot; ${t.sets} sets</p>
      <div class="hero-actions">
        <button class="btn" disabled>Start workout</button>
      </div>
    </section>`;
}

function heroRest(d) {
  const next = nextTrainingDay(d);
  return `
    <section class="hero is-rest">
      <div class="hero-mark">Rest</div>
      <h1 class="hero-title">Nothing scheduled</h1>
      <p class="hero-groups">Next up is ${esc(next.session.title)} on ${esc(fmtShort(next.date))}.</p>
      <div class="hero-actions">
        <button class="btn btn-quiet" data-goto="${key(next.date)}">See ${esc(next.session.title)}</button>
      </div>
    </section>`;
}

function splitSwitch() {
  const on = n => state.split === n;
  return `
    <div class="switch" role="group" aria-label="Training days per week">
      <button data-split="3" aria-pressed="${on(3)}">3 days a week</button>
      <button data-split="5" aria-pressed="${on(5)}">5 days a week</button>
    </div>
    <p class="switch-note">${state.split === 3
      ? 'Push Monday, Pull Wednesday, Legs and core Friday.'
      : 'Chest, Back, Shoulders, Arms, then Legs and core, Monday to Friday.'}</p>`;
}

function weekStrip(viewed) {
  const t = today();
  const cells = weekOf(viewed).map(d => {
    const s = sessionFor(d);
    const cls = ['week-day'];
    if (!s) cls.push('is-rest');
    if (key(d) === key(t)) cls.push('is-today');
    return `<button class="${cls.join(' ')}" aria-pressed="${key(d) === key(viewed)}" data-goto="${key(d)}">
      <span class="wd">${esc(d.toLocaleDateString(undefined, { weekday: 'narrow' }))}</span>
      <span class="wm">${s ? esc(s.mark) : '&middot;'}</span>
    </button>`;
  }).join('');
  return `<nav class="week" aria-label="This week">${cells}</nav>`;
}

function exerciseList(session) {
  const blocks = sessionExercises(session).map(({ group, items }) => `
    <p class="group-label">${esc(GROUPS[group].name)}</p>
    ${items.map(e => `
      <button class="card" data-exercise="${e.id}">
        <span class="card-thumb">${drawFigure(e.pose, { label: e.name })}</span>
        <span class="card-body">
          <h3>${esc(e.name)}</h3>
          <p>${e.sets} sets &middot; ${esc(e.reps)} reps &middot; ${GROUPS[e.group].rest}s rest</p>
        </span>
      </button>`).join('')}
  `).join('');

  return `
    <div class="section-head">
      <h2>The session</h2>
      <span>Tap any exercise</span>
    </div>
    ${blocks}`;
}

function detailView() {
  const e = byId(state.exercise);
  return `
    <div class="detail">
      <button class="back" data-back="1">&larr; Back to the session</button>
      <div class="detail-stage">${drawFigure(e.pose, { label: e.name })}</div>
      <h1>${esc(e.name)}</h1>
      <p class="detail-meta">${e.sets} sets &middot; ${esc(e.reps)} reps &middot; ${GROUPS[e.group].rest}s rest between sets</p>
      <ul class="cues">${e.cues.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
      <div class="hero-actions">
        <button class="btn" disabled>Accept and start</button>
      </div>
      <p class="stage-note">Stage 1 shows the still. Stage 2 adds the set counter, rest timer and looping animation.</p>
    </div>`;
}

/* ---------- events ---------- */

function bind() {
  app.querySelectorAll('[data-split]').forEach(b => b.addEventListener('click', () => {
    state.split = Number(b.dataset.split);
    store.set('split', state.split);
    render();
  }));

  app.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => {
    state.selected = b.dataset.goto === key(today()) ? null : b.dataset.goto;
    render();
  }));

  app.querySelectorAll('[data-exercise]').forEach(b => b.addEventListener('click', () => {
    state.exercise = b.dataset.exercise;
    render();
  }));

  const back = app.querySelector('[data-back]');
  if (back) back.addEventListener('click', () => { state.exercise = null; render(); });
}

/* Re-check the date when the app comes back to the foreground. */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && !state.selected && !state.exercise) render();
});

render();
