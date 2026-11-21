import { NextResponse } from 'next/server';
import { ALL_BRANDS_WITH_MODELS } from '@/lib/brandModelsData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleType = (searchParams.get('vehicleType') || '').toUpperCase().trim();

    let result = ALL_BRANDS_WITH_MODELS;

    if (vehicleType && vehicleType !== 'ALL') {
      result = ALL_BRANDS_WITH_MODELS
        .map((brand) => {
          const matchingModels = brand.models.filter((m) => m.type === vehicleType);
          return {
            ...brand,
            models: matchingModels,
            modelsCount: matchingModels.length
          };
        })
        .filter((brand) => brand.models.length > 0);
    }

    return NextResponse.json({
      success: true,
      brands: result
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Failed to fetch brands',
      brands: []
    }, { status: 500 });
  }
}
