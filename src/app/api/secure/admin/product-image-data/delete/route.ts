import { NextRequest, NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { ERROR_MESSAGES } from '@/config';

export async function DELETE(request: NextRequest): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const searchParams = request.nextUrl.searchParams;
    const productImageId = searchParams.get('product_image_id');

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to delete image data from database. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!productImageId)
      return NextResponse.json({
        success: false,
        message: `Failed to delete image data from database. ${ERROR_MESSAGES.NO_ID_RECEIVED}`,
      });

    const { error } = await supabase.from('productImageData').delete().eq('productImageId', productImageId);

    if (error) {
      return NextResponse.json({
        success: false,
        message: `Failed to delete image data from database. ${error.message}.`,
      });
    }

    return NextResponse.json({ success: true, message: 'Product image data deleted successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to delete image data from database. An unexpect error occured.',
    });
  }
}
