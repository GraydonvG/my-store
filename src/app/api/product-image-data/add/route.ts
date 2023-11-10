import { NextResponse } from 'next/server';

import { serverClientForRoute } from '@/lib/supabase-route';
import { ProductImageDataDbType, CustomResponseType } from '@/types';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await serverClientForRoute();
  const imageData: ProductImageDataDbType[] = await request.json();

  try {
    const { error } = await supabase.from('product_image_data').insert(imageData);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add image data to database. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product image data added successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
}
