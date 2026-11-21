import { NextResponse } from 'next/server';
import { getPartBySlugFromCatalogue, getAllCatalogueParts } from '@/lib/catalogueParser';

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

    // Find related parts from the same category or model
    const all = getAllCatalogueParts();
    const relatedParts = all
      .filter(p => p.id !== part.id && (p.category.slug === part.category.slug || p.model.slug === part.model.slug))
      .slice(0, 4);

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
