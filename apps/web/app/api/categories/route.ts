import { NextResponse } from 'next/server';
import { getAllCatalogueParts, getModelCategories } from '@/lib/catalogueParser';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const model = searchParams.get('model') || searchParams.get('modelId');

  if (model) {
    const categories = getModelCategories(model);
    return NextResponse.json({
      success: true,
      categories: categories.map(c => ({ id: c.slug, name: c.name, slug: c.slug, count: c.count }))
    });
  }

  const parts = getAllCatalogueParts();
  const categoryMap = new Map<string, any>();

  parts.forEach(p => {
    if (!categoryMap.has(p.category.slug)) {
      categoryMap.set(p.category.slug, {
        id: p.category.slug,
        name: p.category.name,
        slug: p.category.slug,
        count: 1
      });
    } else {
      categoryMap.get(p.category.slug).count += 1;
    }
  });

  const categories = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);

  return NextResponse.json({
    success: true,
    categories
  });
}
