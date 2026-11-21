import { NextResponse } from 'next/server';
import { getModelCategories } from '@/lib/catalogueParser';
import { CATALOGUE_DB } from '@/lib/embeddedCatalogue';

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

  const catCounts = new Map<number, number>();
  const rows = CATALOGUE_DB.r;
  const categories = CATALOGUE_DB.c;

  for (let i = 0; i < rows.length; i++) {
    const cIdx = rows[i][2];
    catCounts.set(cIdx, (catCounts.get(cIdx) || 0) + 1);
  }

  const categoryList: { id: string; name: string; slug: string; count: number }[] = [];
  catCounts.forEach((count, cIdx) => {
    const name = categories[cIdx] || 'General';
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    categoryList.push({ id: slug, name, slug, count });
  });

  categoryList.sort((a, b) => b.count - a.count);

  return NextResponse.json({
    success: true,
    categories: categoryList
  });
}
