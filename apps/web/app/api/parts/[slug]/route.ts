import { NextResponse } from 'next/server';
import { getPartBySlugFromCatalogue, getRelatedPartsFromCatalogue } from '@/lib/catalogueParser';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug || '';
    const part = getPartBySlugFromCatalogue(slug);

    if (!part) {
      return NextResponse.json({
        success: false,
        error: 'Part not found in catalogue'
      }, { status: 404 });
    }

    const relatedParts = getRelatedPartsFromCatalogue(slug, 4);

    return NextResponse.json({
      success: true,
      part,
      relatedParts
    });
  } catch (err: any) {
    console.error('Part detail API error:', err);
    return NextResponse.json({
      success: false,
      error: err?.message || 'Failed to fetch part detail'
    }, { status: 500 });
  }
}
