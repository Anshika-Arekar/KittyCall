export const MEOW_VOCABULARY = [
  'meow',
  'meow!',
  'MEOW',
  'meow meow',
  'meow meow meow',
  'mrow',
  'mrrp',
  'mrrrr',
  'mew',
  'mew?',
  'purrrrr',
  'meooooow',
] as const;

export type MeowSound = (typeof MEOW_VOCABULARY)[number];

// Button labels for Meow Soundboard
export const MEOW_BUTTONS: { label: string; sound: MeowSound }[] = [
  { label: 'MEOW', sound: 'meow' },
  { label: 'MEOW!', sound: 'meow!' },
  { label: 'MEOW LOUD', sound: 'MEOW' },
  { label: 'MEOW MEOW', sound: 'meow meow' },
  { label: 'TRIPLE MEOW', sound: 'meow meow meow' },
  { label: 'MROW', sound: 'mrow' },
  { label: 'MRRP', sound: 'mrrp' },
  { label: 'MRRRR', sound: 'mrrrr' },
  { label: 'MEW', sound: 'mew' },
  { label: 'MEW?', sound: 'mew?' },
  { label: 'PURRRRR', sound: 'purrrrr' },
  { label: 'MEOOOOOW', sound: 'meooooow' },
];

export function isValidMeow(sound: string): sound is MeowSound {
  return (MEOW_VOCABULARY as readonly string[]).includes(sound);
}
