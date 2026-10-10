# KittyCall 🐾 dial-up cat matching network

KittyCall is a Y2K-inspired social matching application for cats, made as a fun side project to share with friends. It is for novelty and humor only — no real-world meetups.

Humans manage the profiles, but the application presents the experience as though cats themselves are discovering, hyping, matching, and communicating with each other using only cat vocalizations.

---

## 🌟 Core Product Loop

```text
Create Cat Profile
   -> Discover Cats
   -> Swipe Left (Pass) / Swipe Right (Hype)
   -> Give Katnip to favorites
   -> Mutual interaction creates a Match
   -> Enter a Meow Room
   -> Communicate using Meow-only messages
```

---

## 🎨 Tech Stack & Design System

- **Frontend & Server Logic:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Storage, Realtime)
- **Animation & Gestures:** Motion (`framer-motion`)
- **Hosting:** Vercel (frontend) & Supabase Free Tier (backend)
- **Pixel Art:** Inline custom SVGs on a crisp pixel grid (zero third-party icon libraries)
- **Palette:**
  - Background: `#F6EEDC`
  - Cream: `#FFF8E8`
  - Pink: `#F3A6B8`
  - Coral: `#F08080`
  - Purple: `#9B8ACB`
  - Blue: `#8DB7D6`
  - Green: `#A7C98B`
  - Dark: `#292631`

---

## ⚠️ Important Supabase Free Plan Notices

1. **1 GB Storage Limit:**
   - KittyCall automatically compresses and resizes photos on the client side using an HTML Canvas utility before upload (downscaling to 1024px and JPEG quality 0.82), reducing 5–10MB photos to ~150–250KB.
2. **Email Rate Limits:**
   - In your Supabase Dashboard under **Authentication -> Providers -> Email**, ensure **"Confirm email" is turned OFF**. This enables instant signup without waiting for rate-limited emails.
3. **Inactivity Pauses:**
   - Free-tier Supabase projects automatically pause after **1 week of inactivity**. To keep the project awake, open the Supabase dashboard or visit KittyCall weekly.
4. **Data Backups & Export:**
   - Free projects do not include automated daily backups. You can easily export all data anytime by running `supabase/export_data.sql` in your Supabase SQL Editor.

---

## 🛠️ Setup Instructions

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Anshika-Arekar/KittyCall.git
cd KittyCall
npm install
```

### 2. Configure Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the migration scripts in order:
   - `supabase/migrations/20261010000000_init_schema.sql` (Creates tables, RLS policies, atomic swipe RPC, and realtime publications)
   - `supabase/migrations/20261010000001_seed_interests_and_demo.sql` (Seeds predefined interests and starter demo cats with photos)
3. Go to **Storage**:
   - Ensure the bucket `cat-photos` exists and is marked as **Public** (the migration creates this automatically).
4. Go to **Authentication -> Providers**:
   - **Email:** Disable "Confirm email".
   - **Google (Optional):** Enter your Google OAuth Client ID and Secret if you wish to enable Google sign-in. Set Authorized Redirect URI in Google Cloud Console to `https://<your-project-id>.supabase.co/auth/v1/callback`.

### 3. Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment on Vercel

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import your `KittyCall` repository.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://your-domain.vercel.app`)
4. Click **Deploy**.

---

## 💾 Exporting Your Data

Run the contents of `supabase/export_data.sql` in your Supabase SQL Editor to retrieve a complete JSON dump of all users, cats, photos, swipes, matches, messages, and notifications.
