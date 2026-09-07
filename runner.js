/* The workout runner. One exercise at a time, three sets, rest between them.
   The session clock starts on the first Start and never pauses, rests included. */

const WORK_SEC_PER_SET = 40;      // used only for the time estimate
const TRANSITION_SEC = 75;        // walking over, changing the bench, picking bells
const GRACE_SEC = 300;            // bathroom, water, someone using your rack

const MOTIVATION = [
  'You got this', 'One set at a time', 'Own the last two reps', 'Slow on the way down',
  'Breathe, then go', 'Nobody is coming to lift it for you', 'This is the easy part',
  'Full range, every rep', 'Stay tight', 'Finish what you started', 'Better than yesterday',
  'The bells do not care how you feel'
];

function estimateSeconds(items) {
  let sec = 0;
  items.forEach(e => {
    sec += e.sets * WORK_SEC_PER_SET;
    sec += (e.sets - 1) * GROUPS[e.group].rest;
    sec += TRANSITION_SEC;
  });
  return sec + GRACE_SEC;
}

function humanMinutes(sec) {
  const m = Math.round(sec / 60 / 5) * 5;
  if (m < 60) return m + ' min';
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h}h ${r}m` : `${h}h`;
}

function clock(sec) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60;
  const pad = n => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/* ---------- session ---------- */

const session = {
  data: null,

  load() { this.data = store.get('active', null); return this.data; },
  save() { store.set('active', this.data); },

  start(dateKey, plan) {
    this.data = {
      dateKey,
      mark: plan.mark,
      title: plan.title,
      groups: plan.groups,
      order: planExercises(plan).map(e => e.id),
      idx: 0,
      phase: 'proposed',        // proposed | set | rest | done
      setsDone: 0,
      restEndsAt: null,
      startedAt: Date.now(),
      logged: []
    };
    this.save();
  },

  get exercise() { return byId(this.data.order[this.data.idx]); },
  get elapsed() { return (Date.now() - this.data.startedAt) / 1000; },
  get totalSets() { return this.data.order.reduce((n, id) => n + byId(id).sets, 0); },
  get doneSets() { return this.data.logged.length; },

  weight(id) {
    const w = store.get('weights', {});
    return w[id] || 20;
  },
  setWeight(id, lb) {
    const w = store.get('weights', {});
    w[id] = Math.min(MAX_DUMBBELL, Math.max(WEIGHT_STEP, lb));
    store.set('weights', w);
  },

  motivation() {
    return MOTIVATION[Math.floor(this.elapsed / 25) % MOTIVATION.length];
  },

  accept() { this.data.phase = 'set'; this.save(); },

  swap() {
    const ex = this.exercise;
    const used = new Set(this.data.order);
    const alt = byGroup(ex.group).find(e => !used.has(e.id));
    if (!alt) return false;
    this.data.order[this.data.idx] = alt.id;
    this.data.setsDone = 0;
    this.save();
    return true;
  },

  completeSet() {
    const ex = this.exercise;
    this.data.setsDone++;
    const entry = {
      exerciseId: ex.id, exerciseName: ex.name, group: ex.group,
      set: this.data.setsDone, reps: ex.reps, weight: this.weight(ex.id),
      elapsedSec: Math.round(this.elapsed)
    };
    this.data.logged.push(entry);
    sync.push(Object.assign({ type: 'set', dateKey: this.data.dateKey, sessionTitle: this.data.title }, entry));

    if (this.data.setsDone >= ex.sets) {
      this.nextExercise();
    } else {
      this.data.phase = 'rest';
      this.data.restEndsAt = Date.now() + GROUPS[ex.group].rest * 1000;
    }
    this.save();
  },

  nextExercise() {
    this.data.idx++;
    this.data.setsDone = 0;
    this.data.restEndsAt = null;
    this.data.phase = this.data.idx >= this.data.order.length ? 'done' : 'proposed';
    if (this.data.phase === 'done') this.finish();
    this.save();
  },

  skipExercise() { this.nextExercise(); },

  addRest(sec) {
    if (this.data.restEndsAt) { this.data.restEndsAt += sec * 1000; this.save(); }
  },

  skipRest() {
    this.data.phase = 'set';
    this.data.restEndsAt = null;
    this.save();
  },

  restLeft() {
    return this.data.restEndsAt ? (this.data.restEndsAt - Date.now()) / 1000 : 0;
  },

  finish() {
    const d = this.data;
    const durationSec = Math.round((Date.now() - d.startedAt) / 1000);
    const log = store.get('log', {});
    log[d.dateKey] = {
      title: d.title, mark: d.mark, groups: d.groups,
      durationSec, sets: d.logged.length,
      exercises: [...new Set(d.logged.map(l => l.exerciseName))],
      finishedAt: new Date().toISOString()
    };
    store.set('log', log);
    sync.push({
      type: 'session', dateKey: d.dateKey, title: d.title, groups: d.groups.join('|'),
      durationSec, sets: d.logged.length,
      exercises: [...new Set(d.logged.map(l => l.exerciseName))].join('|')
    });
  },

  abandon() {
    if (this.data && this.data.logged.length) this.finish();
    this.data = null;
    store.set('active', null);
  }
};
