import { NextResponse } from 'next/server';

import { CustomResponseType, UpdateCartItemSizeType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noDataReceivedError, notAuthenticatedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const cartItemData: UpdateCartItemSizeType = await request.json();

    if (!session)
      return NextResponse.json({ success: false, message: `Failed to update size. ${notAuthenticatedError}` });

    if (!cartItemData)
      return NextResponse.json({ success: false, message: `Failed to update size. ${noDataReceivedError}` });

    const { error } = await supabase
      .from('cart')
      .update({ size: cartItemData.size })
      .eq('cartItemId', cartItemData.cartItemId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update size. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Updated size successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update size. An unexpect error occured.' });
  }
}
