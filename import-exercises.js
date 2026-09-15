/* Turns the public domain free-exercise-db into a compact library we can embed.
   Widen INCLUDE or raise CAP to bring more in later. */
const fs = require('fs');
const src = JSON.parse(fs.readFileSync('/home/claude/fx.json', 'utf8'));

const INCLUDE = ['dumbbell', 'bodyweight', 'kettlebell', 'bands'];
const CAP = 999;                       // per muscle group per equipment

const EQUIP = {
  'dumbbell': 'dumbbell', 'body only': 'bodyweight', 'kettlebells': 'kettlebell',
  'bands': 'bands', 'barbell': 'barbell', 'e-z curl bar': 'barbell',
  'cable': 'cable', 'machine': 'machine',
  'medicine ball': 'other', 'exercise ball': 'other'
};

const GROUP = {
  chest: 'chest', biceps: 'biceps', forearms: 'biceps', triceps: 'triceps',
  shoulders: 'shoulders', lats: 'back', 'middle back': 'back', traps: 'back',
  'lower back': 'back', quadriceps: 'legs', hamstrings: 'legs', glutes: 'legs',
  calves: 'legs', adductors: 'legs', abductors: 'legs', abdominals: 'core'
};

const MUSCLE = {
  chest: 'chest', biceps: 'biceps', forearms: 'forearm', triceps: 'triceps',
  shoulders: 'frontDelt', lats: 'lats', 'middle back': 'lats', traps: 'traps',
  'lower back': 'lowerBack', quadriceps: 'quads', hamstrings: 'hamstrings',
  glutes: 'glutes', calves: 'calves', abdominals: 'abs', adductors: 'quads',
  abductors: 'glutes', neck: 'traps'
};

const REPS = { chest: '8-12', back: '8-12', shoulders: '10-12', biceps: '10-12',
               triceps: '10-12', legs: '10-12', core: '12-15' };

const trim = (s, n) => {
  s = String(s || '').replace(/\s+/g, ' ').trim();
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const at = cut.lastIndexOf(' ');
  return (at > 40 ? cut.slice(0, at) : cut).replace(/[,;:]$/, '') + '.';
};

const seen = new Set();
const counts = {};
const out = [];

src.forEach(e => {
  const eq = EQUIP[e.equipment];
  if (!eq || INCLUDE.indexOf(eq) < 0) return;
  if (!e.images || e.images.length < 2) return;
  const g = GROUP[(e.primaryMuscles || [])[0]];
  if (!g) return;

  const key = g + '|' + eq;
  counts[key] = (counts[key] || 0) + 1;
  if (counts[key] > CAP) return;

  const slug = e.images[0].split('/')[0];
  if (seen.has(slug)) return;
  seen.add(slug);

  const primary = [...new Set((e.primaryMuscles || []).map(m => MUSCLE[m]).filter(Boolean))];
  const secondary = [...new Set((e.secondaryMuscles || []).map(m => MUSCLE[m]).filter(Boolean))]
    .filter(m => primary.indexOf(m) < 0);
  if (!primary.length) return;

  const steps = (e.instructions || []).map(x => trim(x, 120)).filter(x => x.length > 12);
  if (!steps.length) return;        // no instructions is no use to anyone

  out.push({
    id: 'fx_' + slug.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
    name: e.name.replace(/\s+/g, ' ').trim(),
    group: g,
    equipment: eq,
    sets: 3,
    reps: REPS[g] || '10-12',
    level: e.level || '',
    photo: slug,
    desc: trim(steps[0] || e.name, 150),
    muscles: { primary: primary.slice(0, 3), secondary: secondary.slice(0, 3) },
    cues: steps.slice(1, 4).length ? steps.slice(1, 4) : steps.slice(0, 3)
  });
});

const byGroupEquip = {};
out.forEach(x => { const k = x.group + ' ' + x.equipment; byGroupEquip[k] = (byGroupEquip[k] || 0) + 1; });

const js = 'const FX_RAW = ' + JSON.stringify(out) + ';\n';
fs.writeFileSync('src/fxdata.js', js);
console.log('imported', out.length, 'exercises,', (js.length / 1024).toFixed(0) + ' KB');
console.log(byGroupEquip);
