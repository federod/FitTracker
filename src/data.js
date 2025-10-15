export const PLAN = {
  cardio: {
    Mon: { label: 'Run 2 miles (unweighted)', recommended: ['run'] },
    Tue: { label: 'Bike 30–40 min (moderate)', recommended: ['bike'] },
    Wed: { label: 'Run 2 miles (unweighted) or Soccer', recommended: ['run', 'soccer'] },
    Thu: { label: 'Bike 30–45 min (moderate)', recommended: ['bike'] },
    Fri: { label: 'Run 2 miles (unweighted)', recommended: ['run'] },
    Sat: { label: 'Run 2 miles (optional faster pace)', recommended: ['run_fast', 'run'] },
    Sun: { label: 'Rest day — walk & stretch', recommended: ['recovery_walk'] },
  },
  kp: {
    Mon: {
      label: 'KOT: Tibialis raises 3x15–20, ATG split squats 3x8, Patrick step 3x8/leg',
      recommended: ['kot_primary'],
    },
    Tue: {
      label: 'Plyos: Squat jumps, Broad jumps, Lateral bounds (3x6–8 each)',
      recommended: ['plyos_power'],
    },
    Wed: null,
    Thu: {
      label: 'Plyos: Box jumps, Skater hops, Tuck jumps (3x6–8 each)',
      recommended: ['plyos_vertical'],
    },
    Fri: {
      label: 'KOT: Tibialis raises 3x15–20, ATG split squats 3x8, Patrick step 3x8/leg',
      recommended: ['kot_primary'],
    },
    Sat: {
      label: 'KOT: Tibialis raises 3x15–20, ATG split squats 3x8, Patrick step 3x8/leg',
      recommended: ['kot_primary'],
    },
    Sun: null,
  },
  weights: {
    Mon: {
      label: 'Chest & Triceps: Bench, Incline DB, Flys, Triceps Ext, Dips',
      recommended: ['chest_tris'],
    },
    Tue: {
      label: 'Back & Biceps: Pull-ups, DB Row, Face Pull, Barbell Curl, Hammer Curl',
      recommended: ['back_bis'],
    },
    Wed: null,
    Thu: {
      label: 'Legs & Knees: Leg Ext, Ham Curl, Step-ups, Lunges, Sled push/pull',
      recommended: ['legs_knees'],
    },
    Fri: {
      label: 'Shoulders & Core: OHP, Lateral Raises, Rear Delt, Plank, Leg Raise',
      recommended: ['shoulders_core'],
    },
    Sat: {
      label: 'Arms & Abs: Curls, Dips, Planks, Cable Crunch',
      recommended: ['arms_abs'],
    },
    Sun: null,
  },
};

export const WORKOUT_OPTIONS = {
  cardio: [
    { id: 'run', label: 'Run 2 miles (unweighted)' },
    { id: 'run_fast', label: 'Run 2 miles (tempo / faster pace)' },
    { id: 'bike', label: 'Bike 30–45 min (moderate)' },
    { id: 'soccer', label: 'Soccer / Small-sided match' },
    { id: 'intervals', label: 'Ski erg or row intervals (6x2 min)' },
    { id: 'recovery_walk', label: 'Active recovery walk + stretch' },
  ],
  kp: [
    { id: 'kot_primary', label: 'KOT: Tibialis raises, ATG split squats, Patrick step' },
    { id: 'plyos_power', label: 'Plyos: Squat jumps, Broad jumps, Lateral bounds' },
    { id: 'plyos_vertical', label: 'Plyos: Box jumps, Skater hops, Tuck jumps' },
    { id: 'ankle_mobility', label: 'Mobility: Ankles, knees, hips circuit' },
  ],
  weights: [
    { id: 'chest_tris', label: 'Chest & Triceps strength block' },
    { id: 'back_bis', label: 'Back & Biceps pull focus' },
    { id: 'legs_knees', label: 'Legs & Knees resiliency day' },
    { id: 'shoulders_core', label: 'Shoulders & Core builder' },
    { id: 'arms_abs', label: 'Arms & Abs finisher' },
    { id: 'full_body', label: 'Full-body maintenance circuit' },
  ],
};

export const TASK_LABEL_COPY = {
  cardio: 'Cardio session complete',
  kp: 'KOT / Plyos session complete',
  weights: 'Weights session complete',
};

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const DAY_NAMES = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

export const CHECKBOX_IDS = [
  'cardio_cb',
  'kp_cb',
  'weights_cb',
  'abs_cb',
  'stretch_cb',
  'compress_cb',
  'roll_cb',
  'biofreeze_cb',
  'sleep_cb',
  'coffee_cb',
  'water_cb',
  'lmnt_cb',
  'shake_cb',
  'meal1_cb',
  'meal2_cb',
  'snack_cb',
];

export const SECTION_GROUPS = [
  {
    id: 'movement',
    label: 'Movement',
    ids: ['cardio_cb', 'kp_cb', 'weights_cb', 'abs_cb'],
  },
  {
    id: 'recovery',
    label: 'Recovery',
    ids: ['stretch_cb', 'compress_cb', 'roll_cb', 'biofreeze_cb', 'sleep_cb'],
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    ids: ['coffee_cb', 'water_cb', 'lmnt_cb', 'shake_cb', 'meal1_cb', 'meal2_cb', 'snack_cb'],
  },
];
