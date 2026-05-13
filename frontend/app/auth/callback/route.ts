import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { upsertMe } from '@/lib/api/users';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/save';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      try {
        const user = data.session.user;
        await upsertMe(
          data.session.access_token,
          user.email ?? '',
          user.user_metadata?.full_name ?? user.user_metadata?.name ?? null
        );
      } catch {
        // upsert 실패는 로그인 플로우를 막지 않음
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(
      `${origin}/login?error=auth_error&detail=${encodeURIComponent(error?.message ?? '')}`
    );
  }

  return NextResponse.redirect(`${origin}/login?error=auth_error`);
}
