/* Exercise library.
   `pose` is one end of the rep, `end` is the other. The renderer tweens between them.
   `end` only lists the joints that move, everything else is inherited from `pose`. */

const ATHLETE = 'Andrismar Tejada';
const MAX_DUMBBELL = 55;   // lb, per hand
const WEIGHT_STEP = 5;

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
const BENCH_FLAT = [FLOOR, { p1: [30, 78], p2: [112, 78] }, { p1: [46, 78], p2: [46, 100] }, { p1: [100, 78], p2: [100, 100] }];
const BENCH_TOP = y0 => [{ p1: [y0[0], 48], p2: [y0[1], 48] }, { p1: [y0[0], 76], p2: [y0[1], 76] }];

const EXERCISES = [
  /* ---------- CHEST ---------- */
  {
    id: 'chest_flat_press',
    name: 'Flat bench press',
    group: 'chest',
    sets: 3, reps: '8-12', tempo: 2.8,
    desc: 'The main chest builder. Lying flat, you press both bells from chest height to straight overhead.',
    muscles: { primary: ['chest'], secondary: ['frontDelt', 'triceps'] },
    cues: ['Feet flat, ribs down', 'Elbows about 45 degrees from the torso', 'Lower slowly, press without slamming the bells together'],
    pose: {
      props: BENCH_FLAT,
      head: [40, 64], neck: [52, 68], hip: [86, 70],
      near: { shoulder: [52, 68], elbow: [52, 52], hand: [54, 38], knee: [96, 92], foot: [102, 116] },
      far:  { shoulder: [50, 66], elbow: [49, 50], hand: [51, 36], knee: [92, 94], foot: [98, 116] },
      db: [[54, 38, 0], [51, 36, 0]]
    },
    end: {
      near: { elbow: [45, 61], hand: [57, 55] },
      far:  { elbow: [42, 59], hand: [54, 53] },
      db: [[57, 55, 0], [54, 53, 0]]
    }
  },
  {
    id: 'chest_incline_press',
    name: 'Incline press',
    group: 'chest',
    sets: 3, reps: '8-12', tempo: 2.8,
    desc: 'Bench set to about 30 degrees. Shifts the work onto the upper chest and front shoulder.',
    muscles: { primary: ['chest', 'frontDelt'], secondary: ['triceps'] },
    cues: ['Set the bench near 30 degrees', 'Drive up and slightly back', 'Keep the shoulder blades pinned'],
    pose: {
      props: [FLOOR, { p1: [46, 50], p2: [80, 82] }, { p1: [80, 82], p2: [108, 84] }, { p1: [86, 84], p2: [86, 104] }],
      head: [44, 44], neck: [54, 54], hip: [80, 80],
      near: { shoulder: [54, 54], elbow: [52, 40], hand: [56, 24], knee: [98, 96], foot: [104, 116] },
      far:  { shoulder: [52, 52], elbow: [49, 38], hand: [53, 22], knee: [94, 98], foot: [100, 116] },
      db: [[56, 24, 0], [53, 22, 0]]
    },
    end: {
      near: { elbow: [45, 50], hand: [60, 44] },
      far:  { elbow: [42, 48], hand: [57, 42] },
      db: [[60, 44, 0], [57, 42, 0]]
    }
  },
  {
    id: 'chest_flye',
    name: 'Dumbbell flye',
    group: 'chest',
    sets: 3, reps: '10-15', tempo: 3.2,
    desc: 'Arms open wide in an arc with the elbows locked soft. Stretches the chest rather than loading it heavy.',
    muscles: { primary: ['chest'], secondary: ['frontDelt'] },
    cues: ['Soft bend in the elbows, hold it', 'Open until you feel a stretch, no further', 'Squeeze the chest to bring them back'],
    pose: {
      props: BENCH_TOP([22, 98]),
      head: [30, 62], neck: [44, 62], hip: [86, 62],
      near: { shoulder: [50, 54], elbow: [50, 38], hand: [48, 22], knee: [104, 54], foot: [124, 50] },
      far:  { shoulder: [50, 70], elbow: [50, 86], hand: [48, 102], knee: [104, 70], foot: [124, 74] },
      db: [[46, 20, 0], [46, 104, 0]]
    },
    end: {
      near: { elbow: [52, 46], hand: [58, 56] },
      far:  { elbow: [52, 78], hand: [58, 68] },
      db: [[58, 55, 0], [58, 69, 0]]
    }
  },

  /* ---------- BACK ---------- */
  {
    id: 'back_single_row',
    name: 'Single arm row',
    group: 'back',
    sets: 3, reps: '8-12', tempo: 2.8,
    desc: 'One hand and one knee on the bench, the other arm rows a bell from a full hang up to the ribs.',
    muscles: { primary: ['lats'], secondary: ['biceps', 'rearDelt', 'traps'] },
    cues: ['Brace the free hand on the bench', 'Pull the elbow past the ribs', 'Do not rotate the shoulders open'],
    pose: {
      props: [FLOOR, { p1: [34, 70], p2: [96, 70] }, { p1: [44, 70], p2: [44, 96] }],
      head: [30, 50], neck: [42, 56], hip: [76, 62],
      near: { shoulder: [44, 58], elbow: [60, 44], hand: [51, 62], knee: [56, 70], foot: [36, 74] },
      far:  { shoulder: [42, 55], elbow: [40, 62], hand: [40, 69], knee: [86, 88], foot: [88, 116] },
      db: [[51, 62, 0]]
    },
    end: {
      near: { elbow: [47, 74], hand: [49, 92] },
      db: [[49, 94, 0]]
    }
  },
  {
    id: 'back_bent_row',
    name: 'Bent over row',
    group: 'back',
    sets: 3, reps: '8-12', tempo: 2.8,
    desc: 'Hinged at the hips with a flat back, both bells row to the lower ribs at once.',
    muscles: { primary: ['lats', 'traps'], secondary: ['biceps', 'rearDelt', 'lowerBack'] },
    cues: ['Hinge to about 45 degrees, flat back', 'Row to the lower ribs', 'Control the way down'],
    pose: {
      props: [FLOOR],
      head: [36, 52], neck: [48, 58], hip: [82, 64],
      near: { shoulder: [48, 58], elbow: [63, 47], hand: [53, 67], knee: [88, 88], foot: [90, 116] },
      far:  { shoulder: [46, 56], elbow: [60, 45], hand: [50, 65], knee: [84, 90], foot: [86, 116] },
      db: [[53, 67, 0], [50, 65, 0]]
    },
    end: {
      near: { elbow: [51, 76], hand: [54, 94] },
      far:  { elbow: [48, 74], hand: [51, 92] },
      db: [[54, 96, 0], [51, 94, 0]]
    }
  },
  {
    id: 'back_pullover',
    name: 'Dumbbell pullover',
    group: 'back',
    sets: 3, reps: '10-12', tempo: 3.2,
    desc: 'Two hands on one bell, arms sweep in a long arc from behind the head back over the chest.',
    muscles: { primary: ['lats'], secondary: ['chest', 'triceps'] },
    cues: ['Two hands on one bell', 'Reach back only as far as the ribs allow', 'Keep the lower back on the bench'],
    pose: {
      props: BENCH_TOP([32, 108]),
      head: [48, 62], neck: [60, 62], hip: [96, 62],
      near: { shoulder: [62, 54], elbow: [46, 48], hand: [30, 52], knee: [112, 54], foot: [130, 50] },
      far:  { shoulder: [62, 70], elbow: [46, 76], hand: [30, 72], knee: [112, 70], foot: [130, 74] },
      db: [[24, 62, 90]]
    },
    end: {
      near: { elbow: [56, 48], hand: [64, 56] },
      far:  { elbow: [56, 76], hand: [64, 68] },
      db: [[68, 62, 90]]
    }
  },

  /* ---------- SHOULDERS ---------- */
  {
    id: 'shoulders_ohp',
    name: 'Overhead press',
    group: 'shoulders',
    sets: 3, reps: '8-12', tempo: 2.8,
    desc: 'Standing, both bells go from shoulder height to locked overhead. The main shoulder strength lift.',
    muscles: { primary: ['frontDelt', 'sideDelt'], secondary: ['triceps', 'traps', 'abs'] },
    cues: ['Squeeze the glutes, ribs down', 'Press up, not forward', 'Stop just short of locking out'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [48, 34], hand: [50, 16], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [83, 41], elbow: [92, 34], hand: [90, 16], knee: [79, 92], foot: [81, 116] },
      db: [[50, 16, 0], [90, 16, 0]]
    },
    end: {
      near: { elbow: [44, 52], hand: [50, 36] },
      far:  { elbow: [96, 52], hand: [90, 36] },
      db: [[50, 36, 0], [90, 36, 0]]
    }
  },
  {
    id: 'shoulders_lateral',
    name: 'Lateral raise',
    group: 'shoulders',
    sets: 3, reps: '12-15', tempo: 3.0,
    desc: 'Arms lift straight out to the sides up to shoulder height. Builds the width of the shoulder.',
    muscles: { primary: ['sideDelt'], secondary: ['traps'] },
    cues: ['Light weight, this one is not a strength lift', 'Lead with the elbows', 'Stop at shoulder height'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [41, 44], hand: [25, 46], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [83, 41], elbow: [99, 44], hand: [115, 46], knee: [79, 92], foot: [81, 116] },
      db: [[25, 46, 0], [115, 46, 0]]
    },
    end: {
      near: { elbow: [56, 60], hand: [57, 80] },
      far:  { elbow: [84, 60], hand: [83, 80] },
      db: [[57, 82, 0], [83, 82, 0]]
    }
  },
  {
    id: 'shoulders_rear_flye',
    name: 'Rear delt flye',
    group: 'shoulders',
    sets: 3, reps: '12-15', tempo: 3.0,
    desc: 'Hinged forward with the chest down, arms sweep wide and back. Hits the part of the shoulder pressing misses.',
    muscles: { primary: ['rearDelt'], secondary: ['traps', 'lats'] },
    cues: ['Hinge forward, chest toward the floor', 'Sweep the arms wide and slightly back', 'No swinging'],
    pose: {
      props: [FLOOR],
      head: [56, 40], neck: [64, 50], hip: [76, 74],
      near: { shoulder: [54, 54], elbow: [39, 50], hand: [23, 44], knee: [64, 92], foot: [62, 116] },
      far:  { shoulder: [74, 54], elbow: [90, 50], hand: [106, 44], knee: [86, 92], foot: [88, 116] },
      db: [[23, 44, 0], [106, 44, 0]]
    },
    end: {
      near: { elbow: [54, 68], hand: [57, 86] },
      far:  { elbow: [74, 68], hand: [71, 86] },
      db: [[57, 88, 0], [71, 88, 0]]
    }
  },

  /* ---------- BICEPS ---------- */
  {
    id: 'biceps_curl',
    name: 'Standing curl',
    group: 'biceps',
    sets: 3, reps: '10-12', tempo: 2.6,
    desc: 'Palms up, elbows pinned to the ribs, the bells curl from a full hang to the shoulder.',
    muscles: { primary: ['biceps'], secondary: ['forearm'] },
    cues: ['Elbows stay pinned to the ribs', 'Palms turn up as you lift', 'Lower over three seconds'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [55, 63], hand: [57, 44], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [83, 41], elbow: [85, 63], hand: [83, 44], knee: [79, 92], foot: [81, 116] },
      db: [[54, 44, 0], [86, 44, 0]]
    },
    end: {
      near: { hand: [55, 84] },
      far:  { hand: [85, 84] },
      db: [[54, 86, 0], [86, 86, 0]]
    }
  },
  {
    id: 'biceps_hammer',
    name: 'Hammer curl',
    group: 'biceps',
    sets: 3, reps: '10-12', tempo: 2.6,
    desc: 'Same curl with the palms facing each other the whole way. Loads the forearm and the outer arm harder.',
    muscles: { primary: ['biceps', 'forearm'], secondary: [] },
    cues: ['Palms face each other the whole way', 'Elbows do not drift forward', 'Same tempo down as up'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [55, 63], hand: [57, 44], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [83, 41], elbow: [85, 63], hand: [83, 44], knee: [79, 92], foot: [81, 116] },
      db: [[54, 44, 90], [86, 44, 90]]
    },
    end: {
      near: { hand: [55, 84] },
      far:  { hand: [85, 84] },
      db: [[54, 86, 90], [86, 86, 90]]
    }
  },
  {
    id: 'biceps_incline_curl',
    name: 'Incline curl',
    group: 'biceps',
    sets: 3, reps: '10-12', tempo: 3.0,
    desc: 'Seated leaning back on the incline bench so the arms hang behind you. The hardest stretch a curl can get.',
    muscles: { primary: ['biceps'], secondary: ['frontDelt'] },
    cues: ['Let the arms hang fully behind you', 'This stretch is the whole point, do not cut it', 'Light weight only'],
    pose: {
      props: [FLOOR, { p1: [48, 38], p2: [78, 80] }, { p1: [78, 80], p2: [106, 82] }, { p1: [86, 82], p2: [86, 104] }],
      head: [46, 32], neck: [56, 44], hip: [78, 78],
      near: { shoulder: [56, 44], elbow: [57, 64], hand: [60, 85], knee: [104, 92], foot: [110, 116] },
      far:  { shoulder: [54, 42], elbow: [54, 62], hand: [57, 83], knee: [100, 94], foot: [106, 116] },
      db: [[60, 87, 0], [57, 85, 0]]
    },
    end: {
      near: { elbow: [57, 64], hand: [45, 52] },
      far:  { elbow: [54, 62], hand: [42, 50] },
      db: [[43, 51, 0], [40, 49, 0]]
    }
  },

  /* ---------- TRICEPS ---------- */
  {
    id: 'triceps_overhead_ext',
    name: 'Overhead extension',
    group: 'triceps',
    sets: 3, reps: '10-12', tempo: 2.8,
    desc: 'One bell held in both hands behind the head, then pressed straight up. Stretches the long head of the triceps.',
    muscles: { primary: ['triceps'], secondary: ['abs'] },
    cues: ['Two hands under one bell', 'Elbows point forward, not out', 'Ribs stay down, no arching'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [57, 24], hand: [66, 44], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [83, 41], elbow: [83, 24], hand: [74, 44], knee: [79, 92], foot: [81, 116] },
      db: [[70, 46, 90]]
    },
    end: {
      near: { elbow: [59, 26], hand: [65, 11] },
      far:  { elbow: [81, 26], hand: [75, 11] },
      db: [[70, 9, 90]]
    }
  },
  {
    id: 'triceps_lying_ext',
    name: 'Lying extension',
    group: 'triceps',
    sets: 3, reps: '10-12', tempo: 2.8,
    desc: 'Flat on the bench with the upper arms held vertical, only the forearms move. Elbow work, nothing else.',
    muscles: { primary: ['triceps'], secondary: [] },
    cues: ['Upper arms stay vertical', 'Lower toward the forehead, not the chest', 'Stop before the elbows flare'],
    pose: {
      props: BENCH_FLAT,
      head: [40, 64], neck: [52, 68], hip: [86, 70],
      near: { shoulder: [52, 68], elbow: [55, 44], hand: [43, 53], knee: [96, 92], foot: [102, 116] },
      far:  { shoulder: [50, 66], elbow: [52, 42], hand: [40, 51], knee: [92, 94], foot: [98, 116] },
      db: [[43, 53, 60], [40, 51, 60]]
    },
    end: {
      near: { hand: [57, 28] },
      far:  { hand: [54, 26] },
      db: [[57, 28, 0], [54, 26, 0]]
    }
  },
  {
    id: 'triceps_kickback',
    name: 'Kickback',
    group: 'triceps',
    sets: 3, reps: '12-15', tempo: 2.6,
    desc: 'Hinged forward with the upper arm locked parallel to the floor, the forearm extends straight back.',
    muscles: { primary: ['triceps'], secondary: ['rearDelt'] },
    cues: ['Upper arm parallel to the floor and still', 'Only the forearm moves', 'Hold the lockout for a beat'],
    pose: {
      props: [FLOOR],
      head: [36, 52], neck: [48, 58], hip: [82, 64],
      near: { shoulder: [48, 58], elbow: [67, 59], hand: [88, 51], knee: [88, 88], foot: [90, 116] },
      far:  { shoulder: [46, 56], elbow: [64, 57], hand: [85, 49], knee: [84, 90], foot: [86, 116] },
      db: [[88, 51, 60], [85, 49, 60]]
    },
    end: {
      near: { hand: [71, 78] },
      far:  { hand: [68, 76] },
      db: [[71, 80, 0], [68, 78, 0]]
    }
  },

  /* ---------- LEGS ---------- */
  {
    id: 'legs_goblet_squat',
    name: 'Goblet squat',
    group: 'legs',
    sets: 3, reps: '10-12', tempo: 3.2,
    desc: 'One bell held upright against the chest while you squat down between the hips and stand back up.',
    muscles: { primary: ['quads', 'glutes'], secondary: ['abs', 'hamstrings', 'traps'] },
    cues: ['Bell held vertical against the chest', 'Sit down between the hips', 'Knees track over the toes'],
    pose: {
      props: [FLOOR],
      head: [70, 38], neck: [70, 52], hip: [70, 86],
      near: { shoulder: [58, 57], elbow: [56, 68], hand: [66, 64], knee: [50, 96], foot: [54, 116] },
      far:  { shoulder: [82, 57], elbow: [84, 68], hand: [74, 64], knee: [90, 96], foot: [86, 116] },
      db: [[70, 64, 90]]
    },
    end: {
      head: [70, 16], neck: [70, 30], hip: [70, 64],
      near: { shoulder: [58, 35], elbow: [56, 46], hand: [66, 42], knee: [61, 90], foot: [59, 116] },
      far:  { shoulder: [82, 35], elbow: [84, 46], hand: [74, 42], knee: [79, 90], foot: [81, 116] },
      db: [[70, 42, 90]]
    }
  },
  {
    id: 'legs_rdl',
    name: 'Romanian deadlift',
    group: 'legs',
    sets: 3, reps: '8-12', tempo: 3.2,
    desc: 'Hips push back with almost straight legs until the hamstrings stretch, then drive back to standing.',
    muscles: { primary: ['hamstrings', 'glutes'], secondary: ['lowerBack', 'traps', 'forearm'] },
    cues: ['Push the hips back, do not bend the knees more', 'Bells stay close to the legs', 'Stop when the hamstrings say stop'],
    pose: {
      props: [FLOOR],
      head: [38, 48], neck: [50, 54], hip: [84, 62],
      near: { shoulder: [50, 54], elbow: [53, 74], hand: [56, 92], knee: [90, 88], foot: [92, 116] },
      far:  { shoulder: [48, 52], elbow: [50, 72], hand: [53, 90], knee: [86, 90], foot: [88, 116] },
      db: [[56, 94, 0], [53, 92, 0]]
    },
    end: {
      head: [70, 20], neck: [70, 34], hip: [70, 68],
      near: { shoulder: [58, 39], elbow: [56, 58], hand: [55, 78], knee: [62, 92], foot: [60, 116] },
      far:  { shoulder: [82, 39], elbow: [84, 58], hand: [85, 78], knee: [80, 92], foot: [82, 116] },
      db: [[55, 80, 0], [85, 80, 0]]
    }
  },
  {
    id: 'legs_reverse_lunge',
    name: 'Reverse lunge',
    group: 'legs',
    sets: 3, reps: '10 each side', tempo: 3.4,
    desc: 'Step one leg back and drop the knee toward the floor, then drive off the front leg to stand.',
    muscles: { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'abs'] },
    cues: ['Step back, not forward', 'Front shin close to vertical', 'Back knee kisses the floor'],
    pose: {
      props: [FLOOR],
      head: [64, 24], neck: [64, 38], hip: [66, 72],
      near: { shoulder: [56, 43], elbow: [56, 62], hand: [57, 82], knee: [88, 88], foot: [88, 116] },
      far:  { shoulder: [72, 43], elbow: [73, 62], hand: [74, 82], knee: [46, 94], foot: [34, 116] },
      db: [[57, 84, 0], [74, 84, 0]]
    },
    end: {
      head: [70, 20], neck: [70, 34], hip: [70, 66],
      near: { shoulder: [60, 39], elbow: [59, 58], hand: [58, 78], knee: [63, 90], foot: [61, 116] },
      far:  { shoulder: [80, 39], elbow: [81, 58], hand: [82, 78], knee: [78, 90], foot: [80, 116] },
      db: [[58, 80, 0], [82, 80, 0]]
    }
  },

  /* ---------- CORE ---------- */
  {
    id: 'core_russian_twist',
    name: 'Russian twist',
    group: 'core',
    sets: 3, reps: '20 total', tempo: 2.4,
    desc: 'Seated and leaning back, one bell travels side to side across the body. Rotation under load.',
    muscles: { primary: ['obliques', 'abs'], secondary: ['frontDelt'] },
    cues: ['Lean back until the abs switch on', 'Rotate from the ribs, not the arms', 'Heels can stay down if the back rounds'],
    pose: {
      props: [FLOOR],
      head: [46, 60], neck: [58, 72], hip: [94, 110],
      near: { shoulder: [58, 72], elbow: [58, 90], hand: [42, 94], knee: [70, 88], foot: [52, 112] },
      far:  { shoulder: [55, 75], elbow: [55, 93], hand: [39, 97], knee: [75, 92], foot: [57, 115] },
      db: [[40, 98, 90]]
    },
    end: {
      near: { elbow: [66, 86], hand: [80, 92] },
      far:  { elbow: [63, 89], hand: [77, 95] },
      db: [[82, 94, 90]]
    }
  },
  {
    id: 'core_side_bend',
    name: 'Side bend',
    group: 'core',
    sets: 3, reps: '12 each side', tempo: 2.6,
    desc: 'One bell hanging at your side while you bend straight sideways and come back up. Loads the obliques.',
    muscles: { primary: ['obliques'], secondary: ['lowerBack', 'forearm'] },
    cues: ['One bell only, the other hand behind the head', 'Bend straight sideways, no twisting', 'Slow at the bottom'],
    pose: {
      props: [FLOOR],
      head: [58, 24], neck: [62, 38], hip: [70, 72],
      near: { shoulder: [51, 43], elbow: [48, 60], hand: [45, 82], knee: [62, 92], foot: [60, 116] },
      far:  { shoulder: [73, 43], elbow: [83, 50], hand: [70, 34], knee: [80, 92], foot: [82, 116] },
      db: [[45, 86, 0]]
    },
    end: {
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [58, 41], elbow: [56, 60], hand: [55, 80], knee: [62, 92], foot: [60, 116] },
      far:  { shoulder: [82, 41], elbow: [90, 48], hand: [78, 32], knee: [80, 92], foot: [82, 116] },
      db: [[55, 84, 0]]
    }
  },
  {
    id: 'core_weighted_crunch',
    name: 'Weighted crunch',
    group: 'core',
    sets: 3, reps: '12-15', tempo: 2.4,
    desc: 'On the floor with the knees bent and a bell on the chest, curl the ribs toward the hips.',
    muscles: { primary: ['abs'], secondary: ['obliques'] },
    cues: ['Bell held on the chest, not behind the neck', 'Curl the ribs toward the hips', 'Lower back stays down'],
    pose: {
      props: [FLOOR],
      head: [40, 72], neck: [52, 82], hip: [82, 108],
      near: { shoulder: [52, 82], elbow: [57, 95], hand: [46, 89], knee: [100, 90], foot: [116, 114] },
      far:  { shoulder: [55, 85], elbow: [60, 98], hand: [49, 92], knee: [104, 93], foot: [120, 116] },
      db: [[42, 87, 90]]
    },
    end: {
      head: [28, 96], neck: [42, 100], hip: [82, 108],
      near: { shoulder: [42, 100], elbow: [50, 108], hand: [38, 104] },
      far:  { shoulder: [45, 103], elbow: [53, 111], hand: [41, 107] },
      db: [[34, 102, 90]]
    }
  },

  /* ---------- ALTERNATES ---------- */
  {
    id: 'chest_floor_press',
    name: 'Floor press',
    group: 'chest',
    sets: 3, reps: '8-12', tempo: 2.8,
    desc: 'A press done lying on the floor. The elbows stop at ground level, which keeps the shoulder out of trouble.',
    muscles: { primary: ['chest', 'triceps'], secondary: ['frontDelt'] },
    cues: ['Elbows touch the floor, then pause', 'No bouncing off the ground', 'Heels driving into the floor'],
    pose: {
      props: [FLOOR],
      head: [36, 96], neck: [50, 98], hip: [88, 100],
      near: { shoulder: [50, 98], elbow: [50, 80], hand: [52, 64], knee: [104, 84], foot: [118, 112] },
      far:  { shoulder: [48, 96], elbow: [47, 78], hand: [49, 62], knee: [108, 87], foot: [122, 114] },
      db: [[52, 64, 0], [49, 62, 0]]
    },
    end: {
      near: { elbow: [44, 92], hand: [56, 86] },
      far:  { elbow: [41, 90], hand: [53, 84] },
      db: [[56, 86, 0], [53, 84, 0]]
    }
  },
  {
    id: 'chest_squeeze_press',
    name: 'Squeeze press',
    group: 'chest',
    sets: 3, reps: '10-15', tempo: 3.0,
    desc: 'Both bells pressed while jammed together the whole set. The squeeze keeps the chest under tension end to end.',
    muscles: { primary: ['chest'], secondary: ['triceps', 'frontDelt'] },
    cues: ['Push the bells hard into each other', 'Never let them separate', 'Light weight, long sets'],
    pose: {
      props: BENCH_FLAT,
      head: [40, 64], neck: [52, 68], hip: [86, 70],
      near: { shoulder: [52, 68], elbow: [50, 52], hand: [53, 38], knee: [96, 92], foot: [102, 116] },
      far:  { shoulder: [50, 66], elbow: [48, 50], hand: [52, 37], knee: [92, 94], foot: [98, 116] },
      db: [[53, 38, 0], [52, 36, 0]]
    },
    end: {
      near: { elbow: [46, 60], hand: [55, 53] },
      far:  { elbow: [44, 58], hand: [54, 52] },
      db: [[55, 53, 0], [54, 51, 0]]
    }
  },
  {
    id: 'back_chest_supported_row',
    name: 'Chest supported row',
    group: 'back',
    sets: 3, reps: '10-12', tempo: 2.8,
    desc: 'Face down on the incline bench so the lower back does nothing. Pure back work with no cheating.',
    muscles: { primary: ['lats', 'traps'], secondary: ['rearDelt', 'biceps'] },
    cues: ['Chest stays glued to the pad', 'Pull the elbows back and down', 'Pause at the top'],
    pose: {
      props: [FLOOR, { p1: [46, 50], p2: [80, 82] }, { p1: [80, 82], p2: [108, 84] }, { p1: [86, 84], p2: [86, 104] }],
      head: [40, 40], neck: [52, 52], hip: [78, 80],
      near: { shoulder: [52, 52], elbow: [56, 70], hand: [46, 58], knee: [96, 96], foot: [102, 116] },
      far:  { shoulder: [50, 50], elbow: [54, 68], hand: [44, 56], knee: [92, 98], foot: [98, 116] },
      db: [[46, 58, 0], [44, 56, 0]]
    },
    end: {
      near: { elbow: [50, 72], hand: [52, 92] },
      far:  { elbow: [48, 70], hand: [50, 90] },
      db: [[52, 94, 0], [50, 92, 0]]
    }
  },
  {
    id: 'back_shrug',
    name: 'Dumbbell shrug',
    group: 'back',
    sets: 3, reps: '12-15', tempo: 2.4,
    desc: 'Heavy bells hanging at your sides while the shoulders lift straight up. All traps, no arms.',
    muscles: { primary: ['traps'], secondary: ['forearm'] },
    cues: ['Straight up, never rolling', 'Hold the top for a full second', 'Arms stay long and relaxed'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 34], hip: [70, 70],
      near: { shoulder: [56, 38], elbow: [54, 58], hand: [53, 78], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [84, 38], elbow: [86, 58], hand: [87, 78], knee: [79, 92], foot: [81, 116] },
      db: [[53, 80, 0], [87, 80, 0]]
    },
    end: {
      neck: [70, 44],
      near: { shoulder: [56, 52], elbow: [54, 72], hand: [53, 92] },
      far:  { shoulder: [84, 52], elbow: [86, 72], hand: [87, 92] },
      db: [[53, 94, 0], [87, 94, 0]]
    }
  },
  {
    id: 'shoulders_arnold',
    name: 'Arnold press',
    group: 'shoulders',
    sets: 3, reps: '10-12', tempo: 3.0,
    desc: 'Starts with the palms facing you at chest height and rotates open as you press. Hits front and side together.',
    muscles: { primary: ['frontDelt', 'sideDelt'], secondary: ['triceps', 'traps'] },
    cues: ['Rotate as you press, not before', 'Elbows finish under the wrists', 'Reverse the turn on the way down'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [48, 34], hand: [50, 16], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [83, 41], elbow: [92, 34], hand: [90, 16], knee: [79, 92], foot: [81, 116] },
      db: [[50, 16, 0], [90, 16, 0]]
    },
    end: {
      near: { elbow: [58, 52], hand: [64, 38] },
      far:  { elbow: [82, 52], hand: [76, 38] },
      db: [[62, 38, 90], [78, 38, 90]]
    }
  },
  {
    id: 'shoulders_front_raise',
    name: 'Front raise',
    group: 'shoulders',
    sets: 3, reps: '12-15', tempo: 3.0,
    desc: 'Straight arms lift the bells forward to eye level. Isolates the front of the shoulder.',
    muscles: { primary: ['frontDelt'], secondary: ['abs'] },
    cues: ['No leaning back', 'Stop at eye level', 'Light weight, this one exposes swinging'],
    pose: {
      props: [FLOOR],
      head: [64, 22], neck: [64, 36], hip: [66, 70],
      near: { shoulder: [62, 41], elbow: [78, 44], hand: [94, 44], knee: [62, 92], foot: [60, 116] },
      far:  { shoulder: [60, 39], elbow: [76, 42], hand: [92, 42], knee: [72, 92], foot: [74, 116] },
      db: [[96, 44, 0], [94, 42, 0]]
    },
    end: {
      near: { elbow: [64, 58], hand: [65, 78] },
      far:  { elbow: [62, 56], hand: [63, 76] },
      db: [[65, 80, 0], [63, 78, 0]]
    }
  },
  {
    id: 'biceps_concentration_curl',
    name: 'Concentration curl',
    group: 'biceps',
    sets: 3, reps: '10-12', tempo: 3.0,
    desc: 'Seated with the working elbow braced against the inner thigh. Nothing can help the arm cheat.',
    muscles: { primary: ['biceps'], secondary: ['forearm'] },
    cues: ['Elbow stays wedged on the thigh', 'Curl to the shoulder, not the chin', 'One arm at a time'],
    pose: {
      props: [FLOOR, { p1: [50, 84], p2: [100, 84] }, { p1: [58, 84], p2: [58, 106] }, { p1: [92, 84], p2: [92, 106] }],
      head: [54, 40], neck: [62, 52], hip: [84, 82],
      near: { shoulder: [62, 52], elbow: [64, 72], hand: [55, 58], knee: [62, 86], foot: [56, 116] },
      far:  { shoulder: [60, 50], elbow: [76, 68], hand: [86, 76], knee: [88, 88], foot: [92, 116] },
      db: [[53, 57, 0]]
    },
    end: {
      near: { elbow: [64, 72], hand: [66, 92] },
      db: [[66, 94, 0]]
    }
  },
  {
    id: 'biceps_cross_body_curl',
    name: 'Cross body curl',
    group: 'biceps',
    sets: 3, reps: '10-12', tempo: 2.8,
    desc: 'One bell curls diagonally toward the opposite shoulder. Loads the outer head of the biceps harder.',
    muscles: { primary: ['biceps', 'forearm'], secondary: [] },
    cues: ['Travel across the body, not straight up', 'Palm stays neutral', 'Alternate arms every rep'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [55, 63], hand: [72, 46], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [83, 41], elbow: [85, 63], hand: [85, 84], knee: [79, 92], foot: [81, 116] },
      db: [[74, 46, 90]]
    },
    end: {
      near: { hand: [55, 84] },
      db: [[54, 86, 90]]
    }
  },
  {
    id: 'triceps_close_grip_press',
    name: 'Close grip press',
    group: 'triceps',
    sets: 3, reps: '10-12', tempo: 2.8,
    desc: 'A bench press with the elbows tucked hard to the ribs, so the triceps do most of the work.',
    muscles: { primary: ['triceps'], secondary: ['chest', 'frontDelt'] },
    cues: ['Elbows brush the ribs the whole way', 'Bells stay close together', 'Lock out without slamming'],
    pose: {
      props: BENCH_FLAT,
      head: [40, 64], neck: [52, 68], hip: [86, 70],
      near: { shoulder: [52, 68], elbow: [54, 52], hand: [54, 38], knee: [96, 92], foot: [102, 116] },
      far:  { shoulder: [50, 66], elbow: [52, 50], hand: [52, 36], knee: [92, 94], foot: [98, 116] },
      db: [[54, 38, 0], [52, 36, 0]]
    },
    end: {
      near: { elbow: [57, 64], hand: [56, 55] },
      far:  { elbow: [55, 62], hand: [54, 53] },
      db: [[56, 55, 0], [54, 53, 0]]
    }
  },
  {
    id: 'triceps_single_overhead',
    name: 'Single arm overhead extension',
    group: 'triceps',
    sets: 3, reps: '10-12', tempo: 2.8,
    desc: 'One bell behind the head, pressed straight up with one arm. Easier on the elbows than the two hand version.',
    muscles: { primary: ['triceps'], secondary: ['abs'] },
    cues: ['Free hand can steady the working elbow', 'Elbow points at the ceiling, not out', 'Full stretch at the bottom'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [59, 23], hand: [69, 38], knee: [61, 92], foot: [59, 116] },
      far:  { shoulder: [83, 41], elbow: [85, 60], hand: [86, 80], knee: [79, 92], foot: [81, 116] },
      db: [[71, 40, 90]]
    },
    end: {
      near: { elbow: [59, 23], hand: [57, 12] },
      db: [[56, 10, 90]]
    }
  },
  {
    id: 'legs_bulgarian_split_squat',
    name: 'Bulgarian split squat',
    group: 'legs',
    sets: 3, reps: '8 each side', tempo: 3.4,
    desc: 'Back foot up on the bench, all the load on the front leg. The hardest thing you can do with two dumbbells.',
    muscles: { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'abs'] },
    cues: ['Front foot far enough forward that the knee stays over the ankle', 'Drop straight down', 'Do the weak leg first'],
    pose: {
      props: [FLOOR, { p1: [86, 80], p2: [128, 80] }, { p1: [96, 80], p2: [96, 104] }],
      head: [56, 34], neck: [58, 48], hip: [62, 82],
      near: { shoulder: [50, 53], elbow: [48, 70], hand: [47, 90], knee: [50, 96], foot: [48, 116] },
      far:  { shoulder: [66, 53], elbow: [68, 70], hand: [69, 90], knee: [84, 92], foot: [98, 78] },
      db: [[47, 92, 0], [69, 92, 0]]
    },
    end: {
      head: [56, 12], neck: [58, 26], hip: [62, 60],
      near: { shoulder: [50, 31], elbow: [48, 48], hand: [47, 68], knee: [54, 88], foot: [50, 116] },
      far:  { shoulder: [66, 31], elbow: [68, 48], hand: [69, 68], knee: [84, 76], foot: [98, 78] },
      db: [[47, 70, 0], [69, 70, 0]]
    }
  },
  {
    id: 'legs_step_up',
    name: 'Dumbbell step up',
    group: 'legs',
    sets: 3, reps: '10 each side', tempo: 3.4,
    desc: 'Step up onto the bench driving through the top foot. The trailing leg does nothing but come along.',
    muscles: { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'calves'] },
    cues: ['Whole foot on the bench', 'Push through the heel, do not hop off the back foot', 'Lower under control'],
    pose: {
      props: [FLOOR, { p1: [80, 84], p2: [128, 84] }, { p1: [90, 84], p2: [90, 110] }],
      head: [58, 24], neck: [60, 38], hip: [64, 72],
      near: { shoulder: [52, 43], elbow: [50, 60], hand: [49, 80], knee: [82, 66], foot: [92, 84] },
      far:  { shoulder: [68, 43], elbow: [70, 60], hand: [71, 80], knee: [58, 92], foot: [54, 116] },
      db: [[49, 82, 0], [71, 82, 0]]
    },
    end: {
      head: [66, 14], neck: [68, 28], hip: [74, 62],
      near: { shoulder: [62, 33], elbow: [60, 50], hand: [59, 70], knee: [86, 72], foot: [92, 84] },
      far:  { shoulder: [78, 33], elbow: [80, 50], hand: [81, 70], knee: [66, 84], foot: [60, 108] },
      db: [[59, 72, 0], [81, 72, 0]]
    }
  },
  {
    id: 'core_leg_raise',
    name: 'Weighted leg raise',
    group: 'core',
    sets: 3, reps: '10-12', tempo: 3.0,
    desc: 'Flat on the floor with a bell pinched between the feet, the legs lift and lower without touching down.',
    muscles: { primary: ['abs'], secondary: ['quads', 'obliques'] },
    cues: ['Hands under the hips if the back arches', 'Lower until it is hard, then stop', 'Feet never rest on the floor'],
    pose: {
      props: [FLOOR],
      head: [26, 98], neck: [40, 100], hip: [80, 104],
      near: { shoulder: [40, 100], elbow: [32, 108], hand: [26, 112], knee: [98, 88], foot: [114, 78] },
      far:  { shoulder: [43, 103], elbow: [35, 111], hand: [29, 115], knee: [101, 91], foot: [117, 81] },
      db: [[118, 76, 90]]
    },
    end: {
      near: { knee: [104, 100], foot: [122, 104] },
      far:  { knee: [107, 103], foot: [125, 107] },
      db: [[126, 104, 90]]
    }
  },
  {
    id: 'core_overhead_march',
    name: 'Overhead march',
    group: 'core',
    sets: 3, reps: '20 steps', tempo: 2.2,
    desc: 'One bell locked out overhead while you march the knees up. Everything in the trunk fires to stop you tipping.',
    muscles: { primary: ['abs', 'obliques'], secondary: ['frontDelt', 'lowerBack'] },
    cues: ['Elbow locked, bicep by the ear', 'Knee up to hip height', 'Ribs down, do not lean away from the bell'],
    pose: {
      props: [FLOOR],
      head: [70, 22], neck: [70, 36], hip: [70, 70],
      near: { shoulder: [57, 41], elbow: [55, 26], hand: [56, 12], knee: [52, 74], foot: [44, 92] },
      far:  { shoulder: [83, 41], elbow: [85, 60], hand: [86, 80], knee: [80, 92], foot: [82, 116] },
      db: [[55, 10, 90], [86, 82, 0]]
    },
    end: {
      near: { knee: [61, 92], foot: [59, 116] },
      far:  { knee: [80, 74], foot: [88, 92] }
    }
  }
];

const byId = id => EXERCISES.find(e => e.id === id);
const byGroup = g => EXERCISES.filter(e => e.group === g);
