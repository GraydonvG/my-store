import { NextResponse } from 'next/server';

import { CustomResponseType, InsertProductImageDataTypeStore } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const imageData: InsertProductImageDataTypeStore[] = await request.json();

  try {
    const updatePromises = imageData.map((data) =>
      supabase.from('productImageData').update(data).eq('productImageId', data.productImageId!)
    );

    const [{ error }] = await Promise.all(updatePromises);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update image data. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product image data updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update image data. An unexpect error occured.' });
  }
}
