import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { Database } from '@/lib/database.types';
import { CustomResponseType } from '@/types';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const formData: { email: string; password: string } = await request.json();
  const { email, password } = formData;

  if (session) return NextResponse.json({ statusCode: 400, message: 'Please sign out before creating a new account' });

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ statusCode: error.status, message: error.message });
    }

    return NextResponse.json({ statusCode: 200, message: 'Sign up successful' });
  } catch (error) {
    return NextResponse.json({ statusCode: 500, message: 'An unexpected error occurred' });
  }
}
