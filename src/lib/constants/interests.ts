export const PREDEFINED_INTERESTS = [
  'Fish',
  'Cardboard Boxes',
  'Sleeping',
  'Bird Watching',
  'Plants',
  'Sunbathing',
  'Zoomies',
  'Treats',
  'Laser Pointers',
  'Window Watching',
  'Cuddles',
  'Exploring',
  'Napping',
  'Catnip',
  'Being Dramatic',
  'Knocking Things Over',
] as const;

export type PredefinedInterest = (typeof PREDEFINED_INTERESTS)[number];
