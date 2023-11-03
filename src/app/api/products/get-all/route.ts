import { serverClientForRoute } from '@/lib/supabase-route';
import { CustomResponseType } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<CustomResponseType>> {
  const supabase = await serverClientForRoute();

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, product_image_data(file_name, image_url)');

    if (error) {
      return NextResponse.json({ success: false, message: error.message });
    }

    return NextResponse.json({ success: true, message: '', data: products });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'An unexpect error occured' });
  }
}
