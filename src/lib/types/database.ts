export type SwipeType = 'PASS' | 'HYPE' | 'KATNIP';

export type NotificationType = 'HYPE' | 'KATNIP' | 'MATCH' | 'NEW_MEOW';

export const VALID_MEOWS = [
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

export type ValidMeow = (typeof VALID_MEOWS)[number];

export interface ProfileUser {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface CatPhoto {
  id: string;
  cat_id: string;
  url: string;
  position: number;
  is_primary: boolean;
  created_at: string;
}

export interface Interest {
  id: string;
  name: string;
}

export interface Cat {
  id: string;
  owner_id: string;
  name: string;
  age: number;
  breed?: string | null;
  gender?: string | null;
  bio: string;
  location?: string | null;
  personality?: string | null;
  favorite_food?: string | null;
  favorite_toy?: string | null;
  favorite_activity?: string | null;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  photos?: CatPhoto[];
  interests?: Interest[];
}

export interface Swipe {
  id: string;
  from_cat_id: string;
  to_cat_id: string;
  type: SwipeType;
  created_at: string;
}

export interface Match {
  id: string;
  cat_a_id: string;
  cat_b_id: string;
  created_at: string;
  cat_a?: Cat;
  cat_b?: Cat;
  latest_message?: Message | null;
  unread_count?: number;
  has_katnip?: boolean;
}

export interface Message {
  id: string;
  match_id: string;
  sender_cat_id: string;
  message: ValidMeow;
  read_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  reference_id: string;
  read: boolean;
  created_at: string;
}
