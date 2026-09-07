/* Rack. Schedule, dates, screens. */

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

const PER_GROUP = { 3: 3, 5: 4 };

const GROUP_PRIORITY = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'core'];

const state = {
  split: store.get('split', 3) === 5 ? 5 : 3,
  selected: null,
  exercise: null,
  screen: 'home'
};

/* ---------- dates ---------- */

const isoDay = d => ((d.getDay() + 6) % 7) + 1;
const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

function today() { const d = new Date(); d.setHours(12, 0, 0, 0); return d; }
function viewedDate() { return state.selected ? new Date(state.selected + 'T12:00:00') : today(); }
function weekOf(d) { const s = addDays(d, -(isoDay(d) - 1)); return Array.from({ length: 7 }, (_, i) => addDays(s, i)); }

function planExercises(plan) {
  const n = PER_GROUP[state.split] || 3;
  return plan.groups.flatMap(g => byGroup(g).slice(0, n));
}

function scheduledFor(date) {
  return SPLITS[state.split].find(s => s.weekday === isoDay(date)) || null;
}

function sessionFor(date) {
  const ov = store.get('overrides', {})[key(date)];
  return ov || scheduledFor(date);
}

function nextTrainingDay(from) {
  for (let i = 1; i <= 7; i++) {
    const d = addDays(from, i);
    const s = sessionFor(d);
    if (s) return { date: d, session: s };
  }
  return null;
}

const fmtLong = d => d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
const fmtShort = d => d.toLocaleDateString(undefined, { weekday: 'long' });

/* ---------- activation ---------- */

function trainedThisWeek(date) {
  const log = store.get('log', {});
  const done = new Set();
  weekOf(date).forEach(d => {
    const rec = log[key(d)];
    if (rec) (rec.groups || []).forEach(g => done.add(g));
  });
  return done;
}

function suggestGroups(date) {
  const done = trainedThisWeek(date);
  const open = GROUP_PRIORITY.filter(g => !done.has(g));
  if (open.length >= 2) return open.slice(0, 2);
  if (open.length === 1) return open;
  return ['chest', 'back'];
}

function activateDay(dateKey) {
  const date = new Date(dateKey + 'T12:00:00');
  const groups = suggestGroups(date);
  const overrides = store.get('overrides', {});
  overrides[dateKey] = {
    mark: '+',
    title: groups.map(g => GROUPS[g].name).join(' and '),
    groups,
    activated: true
  };
  store.set('overrides', overrides);
}

function deactivateDay(dateKey) {
  const overrides = store.get('overrides', {});
  delete overrides[dateKey];
  store.set('overrides', overrides);
}

/* ---------- render ---------- */

const app = document.getElementById('app');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function render() {
  if (state.screen === 'run' && session.data) app.innerHTML = runView();
  else if (state.screen === 'detail') app.innerHTML = detailView();
  else app.innerHTML = homeView();
  bind();
  startFigureLoop();
}

function welcomeBar() {
  const live = session.data && session.data.phase !== 'done';
  return `
    <header class="welcome">
      <p class="hello">Welcome, ${esc(ATHLETE)}</p>
      ${live ? `<div class="live">
          <span class="live-clock" id="elapsed">${clock(session.elapsed)}</span>
          <span class="live-msg" id="motivate">${esc(session.motivation())}</span>
        </div>` : `<p class="sync-state" id="syncstate">${esc(sync.label())}</p>`}
    </header>`;
}

/* ---------- home ---------- */

function homeView() {
  const d = viewedDate();
  const plan = sessionFor(d);
  const isToday = key(d) === key(today());
  const logged = store.get('log', {})[key(d)];

  return `
    ${welcomeBar()}
    <div class="masthead">
      <div class="wordmark">Rack</div>
      <div class="datestamp">${esc(fmtLong(d))}${isToday ? '' : ' &middot; not today'}</div>
    </div>
    ${session.data && session.data.phase !== 'done' ? resumeBar() : ''}
    ${logged ? doneCard(logged) : (plan ? heroTraining(d, plan) : heroRest(d))}
    ${splitSwitch()}
    ${weekStrip(d)}
    ${plan && !logged ? exerciseList(plan) : ''}`;
}

function resumeBar() {
  return `<button class="resume" data-resume="1">
    <span>Session in progress &middot; ${esc(session.data.title)}</span>
    <span class="resume-go">Resume</span>
  </button>`;
}

function doneCard(rec) {
  return `<section class="hero is-done">
    <div class="hero-mark">${esc(rec.mark || '+')}</div>
    <h1 class="hero-title">${esc(rec.title)}</h1>
    <p class="hero-count">Done in ${clock(rec.durationSec)} &middot; ${rec.sets} sets</p>
    <p class="hero-groups">${esc((rec.exercises || []).join(', '))}</p>
  </section>`;
}

function heroTraining(d, plan) {
  const items = planExercises(plan);
  const est = estimateSeconds(items);
  const sets = items.reduce((n, e) => n + e.sets, 0);
  const groups = plan.groups.map(g => GROUPS[g].name).join(', ');
  const showGroups = groups.toLowerCase() !== plan.title.toLowerCase();
  return `
    <section class="hero">
      <div class="hero-mark">${esc(plan.mark)}</div>
      <h1 class="hero-title">${esc(plan.title)}</h1>
      ${showGroups ? `<p class="hero-groups">${esc(groups)}</p>` : ''}
      <p class="hero-count">${items.length} exercises &middot; ${sets} sets &middot; about ${humanMinutes(est)}</p>
      <div class="hero-actions">
        <button class="btn" data-start="${key(d)}">Start workout</button>
        ${plan.activated ? `<button class="btn btn-quiet" data-deactivate="${key(d)}">Clear</button>` : ''}
      </div>
    </section>`;
}

function heroRest(d) {
  const next = nextTrainingDay(d);
  const open = suggestGroups(d).map(g => GROUPS[g].name).join(' and ');
  return `
    <section class="hero is-rest">
      <div class="hero-mark">Rest</div>
      <h1 class="hero-title">Nothing scheduled</h1>
      <p class="hero-groups">${next ? `Next up is ${esc(next.session.title)} on ${esc(fmtShort(next.date))}.` : ''}</p>
      <p class="hero-count">Not trained this week yet: ${esc(open)}</p>
      <div class="hero-actions">
        <button class="btn" data-activate="${key(d)}">Activate this day</button>
        ${next ? `<button class="btn btn-quiet" data-goto="${key(next.date)}">See ${esc(next.session.title)}</button>` : ''}
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
  const t = today(), log = store.get('log', {});
  const cells = weekOf(viewed).map(d => {
    const s = sessionFor(d);
    const cls = ['week-day'];
    if (!s) cls.push('is-rest');
    if (log[key(d)]) cls.push('is-logged');
    if (key(d) === key(t)) cls.push('is-today');
    return `<button class="${cls.join(' ')}" aria-pressed="${key(d) === key(viewed)}" data-goto="${key(d)}">
      <span class="wd">${esc(d.toLocaleDateString(undefined, { weekday: 'narrow' }))}</span>
      <span class="wm">${s ? esc(s.mark) : '&middot;'}</span>
    </button>`;
  }).join('');
  return `<nav class="week" aria-label="This week">${cells}</nav>`;
}

function exerciseList(plan) {
  let n = 0;
  const chosen = planExercises(plan);
  const blocks = plan.groups.map(g => `
    <p class="group-label">${esc(GROUPS[g].name)}</p>
    ${chosen.filter(e => e.group === g).map(e => {
      n++;
      return `<button class="card" data-exercise="${e.id}">
        <span class="card-thumb">${figureSVG(e, { phase: n * 0.13 })}</span>
        <span class="card-body">
          <h3>${esc(e.name)}</h3>
          <p>${e.sets} sets &middot; ${esc(e.reps)} reps &middot; ${GROUPS[e.group].rest}s rest</p>
        </span>
      </button>`;
    }).join('')}`).join('');

  return `<div class="section-head"><h2>The session</h2><span>Tap any exercise</span></div>${blocks}`;
}

/* ---------- detail ---------- */

function detailView() {
  const e = byId(state.exercise);
  return `
    ${welcomeBar()}
    <div class="detail">
      <button class="back" data-back="1">&larr; Back</button>
      <div class="detail-stage">${figureSVG(e, {})}</div>
      <h1>${esc(e.name)}</h1>
      <p class="detail-meta">${e.sets} sets &middot; ${esc(e.reps)} reps &middot; ${GROUPS[e.group].rest}s rest between sets</p>
      <p class="desc">${esc(e.desc)}</p>
      ${muscleMap(e.muscles)}
      <ul class="cues">${e.cues.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
    </div>`;
}

/* ---------- runner ---------- */

function runView() {
  const d = session.data;
  if (d.phase === 'done') return doneView();
  const ex = session.exercise;
  const setNo = Math.min(d.setsDone + 1, ex.sets);
  const pct = Math.round((session.doneSets / session.totalSets) * 100);

  return `
    ${welcomeBar()}
    <div class="run">
      <div class="run-top">
        <button class="back" data-exit="1">&larr; Leave</button>
        <span class="run-pos">Exercise ${d.idx + 1} of ${d.order.length}</span>
      </div>

      <div class="bar"><span style="width:${pct}%"></span></div>
      <p class="bar-note">${session.doneSets} of ${session.totalSets} sets done in this session</p>

      <div class="detail-stage">${figureSVG(ex, {})}</div>
      <h1 class="run-name">${esc(ex.name)}</h1>

      ${d.phase === 'proposed' ? proposedBlock(ex) : ''}
      ${d.phase === 'set' ? setBlock(ex, setNo) : ''}
      ${d.phase === 'rest' ? restBlock(ex, setNo) : ''}
    </div>`;
}

function weightPicker(ex) {
  const w = session.weight(ex.id);
  return `<div class="weight">
    <button data-weight="-1" aria-label="Lower the weight">&minus;</button>
    <span><strong>${w}</strong> lb each</span>
    <button data-weight="1" aria-label="Raise the weight">+</button>
  </div>`;
}

function proposedBlock(ex) {
  return `
    <p class="detail-meta">${ex.sets} sets &middot; ${esc(ex.reps)} reps &middot; ${GROUPS[ex.group].rest}s rest</p>
    <p class="desc">${esc(ex.desc)}</p>
    ${muscleMap(ex.muscles)}
    <ul class="cues">${ex.cues.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
    ${weightPicker(ex)}
    <div class="hero-actions">
      <button class="btn" data-accept="1">Accept</button>
      <button class="btn btn-quiet" data-swap="1">New exercise</button>
    </div>
    <button class="linky" data-skipex="1">Skip this exercise</button>`;
}

function setBlock(ex, setNo) {
  const pct = Math.round((session.data.setsDone / ex.sets) * 100);
  return `
    <p class="set-count">Set <strong>${setNo}</strong> of ${ex.sets}</p>
    <div class="bar is-set"><span style="width:${pct}%"></span></div>
    <p class="bar-note">${session.data.setsDone} of ${ex.sets} done &middot; ${esc(ex.reps)} reps</p>
    ${weightPicker(ex)}
    <div class="hero-actions">
      <button class="btn" data-done="1">Set complete</button>
    </div>
    <p class="cue-strip">${esc(ex.cues[0])}</p>`;
}

function restBlock(ex, setNo) {
  return `
    <div class="rest">
      <p class="rest-label">Rest</p>
      <p class="rest-clock" id="restcount">${clock(session.restLeft())}</p>
      <p class="rest-next">Set ${setNo} of ${ex.sets} starts automatically</p>
    </div>
    <div class="hero-actions">
      <button class="btn" data-skiprest="1">Start now</button>
      <button class="btn btn-quiet" data-addrest="30">Add 30s</button>
    </div>`;
}

function doneView() {
  const d = session.data;
  const names = [...new Set(d.logged.map(l => l.exerciseName))];
  return `
    ${welcomeBar()}
    <div class="detail">
      <h1 class="run-name">${esc(d.title)} done</h1>
      <p class="detail-meta">${clock((Date.now() - d.startedAt) / 1000)} &middot; ${d.logged.length} sets &middot; ${names.length} exercises</p>
      <ul class="cues">${names.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
      <p class="stage-note">Saved to your sheet. ${esc(sync.label())}.</p>
      <div class="hero-actions"><button class="btn" data-close="1">Back to the week</button></div>
    </div>`;
}

/* ---------- events ---------- */

function on(sel, fn) {
  app.querySelectorAll(sel).forEach(el => el.addEventListener('click', () => fn(el)));
}

function bind() {
  on('[data-split]', el => { state.split = Number(el.dataset.split); store.set('split', state.split); render(); });
  on('[data-goto]', el => { state.selected = el.dataset.goto === key(today()) ? null : el.dataset.goto; state.screen = 'home'; render(); });
  on('[data-exercise]', el => { state.exercise = el.dataset.exercise; state.screen = 'detail'; render(); });
  on('[data-back]', () => { state.screen = 'home'; state.exercise = null; render(); });
  on('[data-activate]', el => { activateDay(el.dataset.activate); render(); });
  on('[data-deactivate]', el => { deactivateDay(el.dataset.deactivate); render(); });

  on('[data-start]', el => {
    const dk = el.dataset.start;
    const plan = sessionFor(new Date(dk + 'T12:00:00'));
    if (session.data && session.data.phase !== 'done') session.abandon();
    session.start(dk, plan);
    state.screen = 'run';
    render();
  });

  on('[data-resume]', () => { state.screen = 'run'; render(); });
  on('[data-accept]', () => { session.accept(); render(); });
  on('[data-swap]', () => { if (!session.swap()) alert('No other exercise left for this muscle group.'); render(); });
  on('[data-skipex]', () => { session.skipExercise(); render(); });
  on('[data-done]', () => { session.completeSet(); render(); });
  on('[data-skiprest]', () => { session.skipRest(); render(); });
  on('[data-addrest]', el => { session.addRest(Number(el.dataset.addrest)); render(); });
  on('[data-exit]', () => { state.screen = 'home'; render(); });
  on('[data-close]', () => { session.data = null; store.set('active', null); state.screen = 'home'; render(); });

  on('[data-weight]', el => {
    const ex = session.exercise;
    session.setWeight(ex.id, session.weight(ex.id) + Number(el.dataset.weight) * WEIGHT_STEP);
    render();
  });
}

/* ---------- clock ---------- */

function beep() {
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    const ctx = new C();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = 660; o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o.start(); o.stop(ctx.currentTime + 0.36);
  } catch (e) { /* no audio, no problem */ }
}

let lastBeep = null;

setInterval(() => {
  const s = document.getElementById('syncstate');
  if (s) s.textContent = sync.label();
  if (!session.data || session.data.phase === 'done') return;

  const el = document.getElementById('elapsed');
  if (el) el.textContent = clock(session.elapsed);
  const mv = document.getElementById('motivate');
  if (mv) mv.textContent = session.motivation();

  if (session.data.phase === 'rest') {
    const left = session.restLeft();
    const rc = document.getElementById('restcount');
    if (rc) rc.textContent = clock(left);
    const w = Math.ceil(left);
    if (w <= 3 && w >= 1 && lastBeep !== w) { lastBeep = w; beep(); }
    if (left <= 0) { lastBeep = null; session.skipRest(); render(); }
  }
}, 500);

document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });

session.load();
if (session.data && session.data.phase !== 'done') state.screen = 'run';
sync.flush();
render();
