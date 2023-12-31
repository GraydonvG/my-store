import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import { createSupabaseServerClientForAuth } from '@/lib/supabase/supabase-server-auth';

export async function GET(): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClientForAuth();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ success: false, message: 'Sign out failed. No user session exists.' });

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ success: false, message: `Sign out failed. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Sign out successful.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Sign out failed. An unexpected error occurred.' });
  }
}
