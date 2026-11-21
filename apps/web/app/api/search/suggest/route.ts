import { NextResponse } from 'next/server';
import { searchCatalogueParts } from '@/lib/catalogueParser';
import { CATALOGUE_DB } from '@/lib/embeddedCatalogue';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();

    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        suggestions: { parts: [], models: [], categories: [] }
      });
    }

    const { items: matchingParts } = searchCatalogueParts(q, { limit: 8 });

    // Models suggestion (strictly customer catalogue models)
    const qLower = q.toLowerCase();
    const modelsList = [
      // Suzuki
      { id: 'access-125', name: 'Suzuki Access 125', slug: 'access-125', brand: 'Suzuki', brandSlug: 'suzuki', type: 'Scooter', count: '620+ OEM Parts' },
      { id: 'avenis-125', name: 'Suzuki Avenis 125', slug: 'avenis-125', brand: 'Suzuki', brandSlug: 'suzuki', type: 'Scooter', count: '410+ OEM Parts' },
      { id: 'burgman-street-125', name: 'Suzuki Burgman Street', slug: 'burgman-street-125', brand: 'Suzuki', brandSlug: 'suzuki', type: 'Scooter', count: '450+ OEM Parts' },
      { id: 'gixxer-150-sf', name: 'Suzuki Gixxer 150 SF', slug: 'gixxer-150-sf', brand: 'Suzuki', brandSlug: 'suzuki', type: 'Motorcycle', count: '510+ OEM Parts' },
      { id: 'gixxer-250-sf', name: 'Suzuki Gixxer 250 SF', slug: 'gixxer-250-sf', brand: 'Suzuki', brandSlug: 'suzuki', type: 'Motorcycle', count: '390+ OEM Parts' },
      { id: 'gixxer-150', name: 'Suzuki Gixxer (150)', slug: 'gixxer-150', brand: 'Suzuki', brandSlug: 'suzuki', type: 'Motorcycle', count: '480+ OEM Parts' },
      { id: 'v-strom-sx-250', name: 'Suzuki V-Strom', slug: 'v-strom-sx-250', brand: 'Suzuki', brandSlug: 'suzuki', type: 'Motorcycle', count: '420+ OEM Parts' },
      
      // Bajaj
      { id: 'boxer-150', name: 'Bajaj Boxer 150 (BM150)', slug: 'boxer-150', brand: 'Bajaj', brandSlug: 'bajaj', type: 'Motorcycle', count: '400+ Parts' },
      { id: 're-4-stroke', name: 'Bajaj RE 4-Stroke (Auto-Rickshaw)', slug: 're-4-stroke', brand: 'Bajaj', brandSlug: 'bajaj', type: 'Three-Wheeler', count: '550+ Parts' },
      
      // Honda
      { id: 'gl-150', name: 'Honda GL150 (GLAL9 / GLBL8)', slug: 'gl-150', brand: 'Honda', brandSlug: 'honda', type: 'Motorcycle', count: '430+ Parts' },
      
      // Aprilia
      { id: 'sr-125', name: 'Aprilia SR 125', slug: 'sr-125', brand: 'Aprilia', brandSlug: 'aprilia', type: 'Scooter', count: '350+ Parts' },
      { id: 'sr-150', name: 'Aprilia SR 150', slug: 'sr-150', brand: 'Aprilia', brandSlug: 'aprilia', type: 'Scooter', count: '360+ Parts' },
      { id: 'sr-160', name: 'Aprilia SR 160', slug: 'sr-160', brand: 'Aprilia', brandSlug: 'aprilia', type: 'Scooter', count: '370+ Parts' },
      { id: 'storm-125', name: 'Aprilia Storm 125', slug: 'storm-125', brand: 'Aprilia', brandSlug: 'aprilia', type: 'Scooter', count: '320+ Parts' },
      
      // Vespa
      { id: 'vxl-150', name: 'Vespa VXL 150 cc', slug: 'vxl-150', brand: 'Vespa', brandSlug: 'vespa', type: 'Scooter', count: '360+ Parts' },
      { id: 'vxl-125', name: 'Vespa VXL 125', slug: 'vxl-125', brand: 'Vespa', brandSlug: 'vespa', type: 'Scooter', count: '350+ Parts' },
      
      // Yamaha
      { id: 'ray', name: 'Yamaha Ray / Ray ZR', slug: 'ray', brand: 'Yamaha', brandSlug: 'yamaha', type: 'Scooter', count: '380+ Parts' }
    ];
    const suggestedModels = modelsList.filter(m => 
      m.name.toLowerCase().includes(qLower) || 
      m.brand.toLowerCase().includes(qLower) ||
      m.slug.toLowerCase().includes(qLower)
    );

    // Categories suggestion from CATALOGUE_DB.c directly
    const suggestedCategories = CATALOGUE_DB.c
      .filter((c) => c.toLowerCase().includes(qLower))
      .slice(0, 5)
      .map((c) => ({
        id: c.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: c,
        slug: c.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }));

    return NextResponse.json({
      success: true,
      suggestions: {
        parts: matchingParts,
        models: suggestedModels,
        categories: suggestedCategories
      }
    });
  } catch (err: any) {
    console.error('Suggest API error:', err);
    return NextResponse.json({
      success: false,
      error: err?.message || 'Failed to fetch suggestions',
      suggestions: { parts: [], models: [], categories: [] }
    }, { status: 500 });
  }
}
