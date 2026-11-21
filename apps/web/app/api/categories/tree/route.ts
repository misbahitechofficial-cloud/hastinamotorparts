import { NextResponse } from 'next/server';
import { getAllCatalogueParts } from '@/lib/catalogueParser';

export async function GET() {
  const parts = getAllCatalogueParts();
  const categoryMap = new Map<string, any>();

  parts.forEach(p => {
    if (!categoryMap.has(p.category.slug)) {
      categoryMap.set(p.category.slug, {
        id: p.category.slug,
        name: p.category.name,
        slug: p.category.slug,
        children: []
      });
    }
  });

  const tree = Array.from(categoryMap.values()).slice(0, 12);

  return NextResponse.json({
    success: true,
    tree
  });
}
