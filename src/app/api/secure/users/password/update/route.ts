import { NextResponse } from 'next/server';

import { CustomResponseType, userPasswordType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noDataReceivedError, notAuthenticatedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const passwordData: userPasswordType = await request.json();

    if (!session)
      return NextResponse.json({ success: false, message: `Failed to update password. ${notAuthenticatedError}` });

    if (!passwordData)
      return NextResponse.json({ success: false, message: `Failed to update password. ${noDataReceivedError}` });

    const { data: success } = await supabase.rpc('verifyUserPassword', {
      password: passwordData.currentPassword,
    });

    if (success === true && passwordData.newPassword === passwordData.confirmPassword) {
      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });

      if (error) {
        return NextResponse.json({ success: false, message: `Failed to update password. ${error.message}.` });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: `Failed to update password. The password you have entered is incorrect.`,
      });
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update password. An unexpect error occured.' });
  }
}