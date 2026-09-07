/* Exercise library.
   Each exercise carries a `pose`: joint coordinates in a 140x124 space.
   Stage 3 will tween between two poses to animate. For now we render one. */

const GROUPS = {
  chest:     { name: 'Chest',     rest: 75 },
  back:      { name: 'Back',      rest: 75 },
  shoulders: { name: 'Shoulders', rest: 75 },
  biceps:    { name: 'Biceps',    rest: 60 },
  triceps:   { name: 'Triceps',   rest: 60 },
  legs:      { name: 'Legs',      rest: 90 },
  core:      { name: 'Core',      rest: 45 }
};

const FLOOR = { p1: [10, 116], p2: [130, 116] };

const EXERCISES = [
  /* ---------- CHEST ---------- */
  {
    id: 'chest_flat_press',
    name: 'Flat bench press',
    group: 'chest',
    sets: 3, reps: '8-12',
    cues: ['Feet flat, ribs down', 'Elbows about 45 degrees from the torso', 'Lower slowly, press without slamming the bells together'],
    pose: {
      props: [FLOOR, { p1: [30, 78], p2: [112, 78] }, { p1: [46, 78], p2: [46, 100] }, { p1: [100, 78], p2: [100, 100] }],
      head: [40, 64], neck: [52, 68], hip: [86, 70],
      near: { shoulder: [52, 68], elbow: [52, 52], hand: [54, 38], knee: [96, 92], foot: [102, 116] },
      far:  { shoulder: [50, 66], elbow: [49, 50], hand: [51, 36], knee: [92, 94], foot: [98, 116] },
      db: [[54, 38, 0], [51, 36, 0]]
    }
  },
  {
    id: 'chest_incline_press',
    name: 'Incline press',
    group: 'chest',
    sets: 3, reps: '8-12',
    cues: ['Set the bench near 30 degrees', 'Drive up and slightly back', 'Keep the shoulder blades pinned'],
    pose: {
      props: [FLOOR, { p1: [46, 50], p2: [80, 82] }, { p1: [80, 82], p2: [108, 84] }, { p1: [86, 84], p2: [86, 104] }],
      head: [44, 44], neck: [54, 54], hip: [80, 80],
      near: { shoulder: [54, 54], elbow: [52, 40], hand: [56, 24], knee: [98, 96], foot: [104, 116] },
      far:  { shoulder: [52, 52], elbow: [49, 38], hand: [53, 22], knee: [94, 98], foot: [100, 116] },
      db: [[56, 24, 0], [53, 22, 0]]
    }
  },
  {
    id: 'chest_flye',
    name: 'Dumbbell flye',
    group: 'chest',
    sets: 3, reps: '10-15',
    cues: ['Soft bend in the elbows, hold it', 'Open until you feel a stretch, no further', 'Squeeze the chest to bring them back'],
    pose: {
      props: [{ p1: [22, 48], p2: [98, 48] }, { p1: [22, 76], p2: [98, 76] }],
      head: [30, 62], neck: [44, 62], hip: [86, 62],
      near: { shoulder: [50, 54], elbow: [50, 38], hand: [48, 22], knee: [104, 54], foot: [124, 50] },
      far:  { shoulder: [50, 70], elbow: [50, 86], hand: [48, 102], knee: [104, 70], foot: [124, 74] },
      db: [[46, 20, 0], [46, 104, 0]]
    }
  },

  /* ---------- BACK ---------- */
  {
    id: 'back_single_row',
    name: 'Single arm row',
    group: 'back',
    sets: 3, reps: '8-12',
    cues: ['Brace the free hand on the bench', 'Pull the elbow past the ribs', 'Do not rotate the shoulders open'],
    pose: {
      props: [FLOOR, { p1: [34, 70], p2: [96, 70] }, { p1: [44, 70], p2: [44, 96] }],
      head: [30, 50], neck: [42, 56], hip: [76, 62],
      near: { shoulder: [44, 58], elbow: [60, 44], hand: [51, 62], knee: [56, 70], foot: [36, 74] },
      far:  { shoulder: [42, 55], elbow: [40, 62], hand: [40, 69], knee: [86, 88], foot: [88, 116] },
      db: [[51, 62, 0]]
    }
  },
  {
    id: 'back_bent_row',
    name: 'Bent over row',
    group: 'back',
    sets: 3, reps: '8-12',
    cues: ['Hinge to about 45 degrees, flat back', 'Row to the lower ribs', 'Control the way down'],
    pose: {
      props: [FLOOR],
      head: [36, 52], neck: [48, 58], hip: [82, 64],
      near: { shoulder: [48, 58], elbow: [63, 47], hand: [53, 67], knee: [88, 88], foot: [90, 116] },
      far:  { shoulder: [46, 56], elbow: [60, 45], hand: [50, 65], knee: [84, 90], foot: [86, 116] },
      db: [[53, 67, 0], [50, 65, 0]]
    }
  },
  {
    id: 'back_pullover',
    name: 'Dumbbell pullover',
    group: 'back',
    sets: 3, reps: '10-12',
    cues: ['Two hands on one bell', 'Reach back only as far as the ribs allow', 'Keep the lower back on the bench'],
    pose: {
      props: [{ p1: [32, 48], p2: [108, 48] }, { p1: [32, 76], p2: [108, 76] }],
      head: [48, 62], neck: [60, 62], hip: [96, 62],
      near: { shoulder: [62, 54], elbow: [46, 48], hand: [30, 52], knee: [112, 54], foot: [130, 50] },
      far:  { shoulder: [62, 70], elbow: [46, 76], hand: [30, 72], knee: [112, 70], foot: [130, 74] },
      db: [[24, 62, 90]]
    }
  },

  /* ---------- SHOULDERS ---------- */
  {
    id: 'shoulders_ohp',
    name: 'Overhead press',
    group: 'shoulders',
    sets: 3, reps: '8-12',
    cues: ['Squeeze the glutes, ribs down', 'Press up, not forward', 'Stop just short of locking out'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [48, 34], hand: [50, 16], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [83, 41], elbow: [92, 34], hand: [90, 16], knee: [79, 92], foot: [81, 116] },
      db: [[50, 16, 0], [90, 16, 0]]
    }
  },
  {
    id: 'shoulders_lateral',
    name: 'Lateral raise',
    group: 'shoulders',
    sets: 3, reps: '12-15',
    cues: ['Light weight, this one is not a strength lift', 'Lead with the elbows', 'Stop at shoulder height'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [41, 44], hand: [25, 46], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [83, 41], elbow: [99, 44], hand: [115, 46], knee: [79, 92], foot: [81, 116] },
      db: [[25, 46, 0], [115, 46, 0]]
    }
  },
  {
    id: 'shoulders_rear_flye',
    name: 'Rear delt flye',
    group: 'shoulders',
    sets: 3, reps: '12-15',
    cues: ['Hinge forward, chest toward the floor', 'Sweep the arms wide and slightly back', 'No swinging'],
    pose: {
      props: [FLOOR],
      head: [56, 40], neck: [64, 50], hip: [76, 74],
      near: { shoulder: [54, 54], elbow: [39, 50], hand: [23, 44], knee: [64, 92], foot: [62, 116] },
      far:  { shoulder: [74, 54], elbow: [90, 50], hand: [106, 44], knee: [86, 92], foot: [88, 116] },
      db: [[26, 40, 0], [114, 40, 0]]
    }
  },

  /* ---------- BICEPS ---------- */
  {
    id: 'biceps_curl',
    name: 'Standing curl',
    group: 'biceps',
    sets: 3, reps: '10-12',
    cues: ['Elbows stay pinned to the ribs', 'Palms turn up as you lift', 'Lower over three seconds'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [55, 63], hand: [57, 44], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [83, 41], elbow: [85, 63], hand: [83, 44], knee: [79, 92], foot: [81, 116] },
      db: [[54, 44, 0], [86, 44, 0]]
    }
  },
  {
    id: 'biceps_hammer',
    name: 'Hammer curl',
    group: 'biceps',
    sets: 3, reps: '10-12',
    cues: ['Palms face each other the whole way', 'Elbows do not drift forward', 'Same tempo down as up'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [55, 63], hand: [57, 44], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [83, 41], elbow: [85, 63], hand: [83, 44], knee: [79, 92], foot: [81, 116] },
      db: [[54, 44, 90], [86, 44, 90]]
    }
  },
  {
    id: 'biceps_incline_curl',
    name: 'Incline curl',
    group: 'biceps',
    sets: 3, reps: '10-12',
    cues: ['Let the arms hang fully behind you', 'This stretch is the whole point, do not cut it', 'Light weight only'],
    pose: {
      props: [FLOOR, { p1: [48, 38], p2: [78, 80] }, { p1: [78, 80], p2: [106, 82] }, { p1: [86, 82], p2: [86, 104] }],
      head: [46, 32], neck: [56, 44], hip: [78, 78],
      near: { shoulder: [56, 44], elbow: [57, 64], hand: [60, 85], knee: [104, 92], foot: [110, 116] },
      far:  { shoulder: [54, 42], elbow: [54, 62], hand: [57, 83], knee: [100, 94], foot: [106, 116] },
      db: [[60, 87, 0], [57, 85, 0]]
    }
  },

  /* ---------- TRICEPS ---------- */
  {
    id: 'triceps_overhead_ext',
    name: 'Overhead extension',
    group: 'triceps',
    sets: 3, reps: '10-12',
    cues: ['Two hands under one bell', 'Elbows point forward, not out', 'Ribs stay down, no arching'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [57, 24], hand: [66, 44], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [83, 41], elbow: [83, 24], hand: [74, 44], knee: [79, 92], foot: [81, 116] },
      db: [[70, 46, 90]]
    }
  },
  {
    id: 'triceps_lying_ext',
    name: 'Lying extension',
    group: 'triceps',
    sets: 3, reps: '10-12',
    cues: ['Upper arms stay vertical', 'Lower toward the forehead, not the chest', 'Stop before the elbows flare'],
    pose: {
      props: [FLOOR, { p1: [30, 78], p2: [112, 78] }, { p1: [46, 78], p2: [46, 100] }, { p1: [100, 78], p2: [100, 100] }],
      head: [40, 64], neck: [52, 68], hip: [86, 70],
      near: { shoulder: [52, 68], elbow: [55, 44], hand: [43, 53], knee: [96, 92], foot: [102, 116] },
      far:  { shoulder: [50, 66], elbow: [52, 42], hand: [40, 51], knee: [92, 94], foot: [98, 116] },
      db: [[43, 53, 60], [40, 51, 60]]
    }
  },
  {
    id: 'triceps_kickback',
    name: 'Kickback',
    group: 'triceps',
    sets: 3, reps: '12-15',
    cues: ['Upper arm parallel to the floor and still', 'Only the forearm moves', 'Hold the lockout for a beat'],
    pose: {
      props: [FLOOR],
      head: [36, 52], neck: [48, 58], hip: [82, 64],
      near: { shoulder: [48, 58], elbow: [67, 59], hand: [88, 51], knee: [88, 88], foot: [90, 116] },
      far:  { shoulder: [46, 56], elbow: [64, 57], hand: [85, 49], knee: [84, 90], foot: [86, 116] },
      db: [[88, 51, 60], [85, 49, 60]]
    }
  },

  /* ---------- LEGS ---------- */
  {
    id: 'legs_goblet_squat',
    name: 'Goblet squat',
    group: 'legs',
    sets: 3, reps: '10-12',
    cues: ['Bell held vertical against the chest', 'Sit down between the hips', 'Knees track over the toes'],
    pose: {
      props: [FLOOR],
      head: [70, 26], neck: [70, 40], hip: [70, 74],
      near: { shoulder: [58, 45], elbow: [56, 56], hand: [66, 52], knee: [52, 90], foot: [54, 116] },
      far:  { shoulder: [82, 45], elbow: [84, 56], hand: [74, 52], knee: [88, 90], foot: [86, 116] },
      db: [[70, 52, 90]]
    }
  },
  {
    id: 'legs_rdl',
    name: 'Romanian deadlift',
    group: 'legs',
    sets: 3, reps: '8-12',
    cues: ['Push the hips back, do not bend the knees more', 'Bells stay close to the legs', 'Stop when the hamstrings say stop'],
    pose: {
      props: [FLOOR],
      head: [38, 48], neck: [50, 54], hip: [84, 62],
      near: { shoulder: [50, 54], elbow: [53, 74], hand: [56, 92], knee: [90, 88], foot: [92, 116] },
      far:  { shoulder: [48, 52], elbow: [50, 72], hand: [53, 90], knee: [86, 90], foot: [88, 116] },
      db: [[56, 94, 0], [53, 92, 0]]
    }
  },
  {
    id: 'legs_reverse_lunge',
    name: 'Reverse lunge',
    group: 'legs',
    sets: 3, reps: '10 each side',
    cues: ['Step back, not forward', 'Front shin close to vertical', 'Back knee kisses the floor'],
    pose: {
      props: [FLOOR],
      head: [64, 24], neck: [64, 38], hip: [66, 72],
      near: { shoulder: [56, 43], elbow: [56, 62], hand: [57, 82], knee: [88, 88], foot: [88, 116] },
      far:  { shoulder: [72, 43], elbow: [73, 62], hand: [74, 82], knee: [46, 94], foot: [34, 116] },
      db: [[57, 84, 0], [74, 84, 0]]
    }
  },

  /* ---------- CORE ---------- */
  {
    id: 'core_russian_twist',
    name: 'Russian twist',
    group: 'core',
    sets: 3, reps: '20 total',
    cues: ['Lean back until the abs switch on', 'Rotate from the ribs, not the arms', 'Heels can stay down if the back rounds'],
    pose: {
      props: [FLOOR],
      head: [46, 60], neck: [58, 72], hip: [94, 110],
      near: { shoulder: [58, 72], elbow: [58, 90], hand: [42, 94], knee: [70, 88], foot: [52, 112] },
      far:  { shoulder: [55, 75], elbow: [55, 93], hand: [39, 97], knee: [75, 92], foot: [57, 115] },
      db: [[40, 98, 90]]
    }
  },
  {
    id: 'core_side_bend',
    name: 'Side bend',
    group: 'core',
    sets: 3, reps: '12 each side',
    cues: ['One bell only, the other hand behind the head', 'Bend straight sideways, no twisting', 'Slow at the bottom'],
    pose: {
      props: [FLOOR],
      head: [58, 24], neck: [62, 38], hip: [70, 72],
      near: { shoulder: [51, 43], elbow: [48, 60], hand: [45, 82], knee: [62, 92], foot: [60, 116] },
      far:  { shoulder: [73, 43], elbow: [83, 50], hand: [70, 34], knee: [80, 92], foot: [82, 116] },
      db: [[45, 86, 0]]
    }
  },
  {
    id: 'core_weighted_crunch',
    name: 'Weighted crunch',
    group: 'core',
    sets: 3, reps: '12-15',
    cues: ['Bell held on the chest, not behind the neck', 'Curl the ribs toward the hips', 'Lower back stays down'],
    pose: {
      props: [FLOOR],
      head: [40, 72], neck: [52, 82], hip: [82, 108],
      near: { shoulder: [52, 82], elbow: [57, 95], hand: [46, 89], knee: [100, 90], foot: [116, 114] },
      far:  { shoulder: [55, 85], elbow: [60, 98], hand: [49, 92], knee: [104, 93], foot: [120, 116] },
      db: [[42, 87, 90]]
    }
  }
];

const byId = id => EXERCISES.find(e => e.id === id);
const byGroup = g => EXERCISES.filter(e => e.group === g);
