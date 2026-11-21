import { NextResponse } from 'next/server';
import { searchCatalogueParts, getAllCatalogueParts } from '@/lib/catalogueParser';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const brand = searchParams.get('brand') || '';
    const model = searchParams.get('model') || searchParams.get('modelId') || '';
    const category = searchParams.get('category') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '12', 10));
    const offset = (page - 1) * limit;

    const { items, total } = searchCatalogueParts(q, {
      brand: brand || undefined,
      model: model || undefined,
      category: category || undefined,
      offset,
      limit
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      success: true,
      items,
      total,
      page,
      limit,
      totalPages
    });
  } catch (err: any) {
    console.error('Parts API error:', err);
    return NextResponse.json({
      success: false,
      error: err?.message || 'Failed to fetch parts',
      items: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 1
    }, { status: 500 });
  }
}
