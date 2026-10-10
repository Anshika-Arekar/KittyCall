import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/discover';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if user already has a cat profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: cat } = await supabase
          .from('cats')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (!cat) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page or sign in page if exchange failed
  return NextResponse.redirect(`${origin}/auth/sign-in?error=auth-callback-failed`);
}
