import { NextResponse } from 'next/server';

const BRAND_DATA: Record<string, { brand: any; models: any[] }> = {
  suzuki: {
    brand: {
      id: 'suzuki',
      name: 'Suzuki',
      slug: 'suzuki',
      logoColor: '#002E6D',
      origin: 'Japan / India (SMIPL)',
      vehicleType: 'Two-Wheeler'
    },
    models: [
      {
        id: 'access-125',
        name: 'Suzuki Access 125',
        slug: 'access-125',
        type: 'SCOOTER',
        vehicleType: 'SCOOTER',
        yearFrom: 2016,
        yearTo: 2026,
        displacement: '124 CC SEP',
        totalParts: 620,
        catalogueFile: '2025 new access.pdf / Suzuki Access 125 – Parts Finder.html',
        description: 'India\'s leading 125cc executive scooter. SEP engine with combined braking and LED illumination.'
      },
      {
        id: 'avenis-125',
        name: 'Suzuki Avenis 125',
        slug: 'avenis-125',
        type: 'SCOOTER',
        vehicleType: 'SCOOTER',
        yearFrom: 2021,
        yearTo: 2026,
        displacement: '124 CC SEP',
        totalParts: 410,
        catalogueFile: 'avenis 2026.pdf',
        description: 'Sporty youth scooter with sharp split headlamp and lightweight alloy wheels.'
      },
      {
        id: 'burgman-street-125',
        name: 'Suzuki Burgman Street',
        slug: 'burgman-street-125',
        type: 'SCOOTER',
        vehicleType: 'SCOOTER',
        yearFrom: 2018,
        yearTo: 2026,
        displacement: '124 CC SEP',
        totalParts: 450,
        catalogueFile: 'Burgman aug 2026.pdf',
        description: 'Maxi-scooter styling with premium step-through ergonomics and USB charging.'
      },
      {
        id: 'gixxer-150-sf',
        name: 'Suzuki Gixxer 150 SF',
        slug: 'gixxer-150-sf',
        type: 'MOTORCYCLE',
        vehicleType: 'MOTORCYCLE',
        yearFrom: 2019,
        yearTo: 2026,
        displacement: '155 CC SEP FI',
        totalParts: 510,
        catalogueFile: 'GIXXER 150 SF.pdf / suzuki_gixxer_sf_parts_finder.html / Suzuki_Gixxer_SF_GSX150FRLM4_Parts_List.xlsx',
        description: 'Aerodynamic full-faired 155cc street motorcycle. Fuel-injected with dual disc ABS.'
      },
      {
        id: 'gixxer-250-sf',
        name: 'Suzuki Gixxer 250 SF',
        slug: 'gixxer-250-sf',
        type: 'MOTORCYCLE',
        vehicleType: 'MOTORCYCLE',
        yearFrom: 2019,
        yearTo: 2026,
        displacement: '249 CC SOCS',
        totalParts: 390,
        catalogueFile: 'GIXXER 250 SF.pdf',
        description: 'Quarter-liter sportbike with Suzuki Oil Cooling System (SOCS) and clip-on handlebars.'
      },
      {
        id: 'gixxer-150',
        name: 'Suzuki Gixxer (150)',
        slug: 'gixxer-150',
        type: 'MOTORCYCLE',
        vehicleType: 'MOTORCYCLE',
        yearFrom: 2015,
        yearTo: 2026,
        displacement: '155 CC SEP',
        totalParts: 480,
        catalogueFile: 'gixxer 2023.pdf',
        description: 'Naked streetfighter styling with high-tensile diamond chassis and monoshock suspension.'
      },
      {
        id: 'v-strom-sx-250',
        name: 'Suzuki V-Strom (SX 250)',
        slug: 'v-strom-sx-250',
        type: 'MOTORCYCLE',
        vehicleType: 'MOTORCYCLE',
        yearFrom: 2022,
        yearTo: 2026,
        displacement: '249 CC SOCS Dual Sport',
        totalParts: 420,
        catalogueFile: 'V STROME.pdf',
        description: 'Sports adventure tourer with 19-inch front wheel, tall windscreen, and dual-purpose chassis.'
      }
    ]
  },
  bajaj: {
    brand: {
      id: 'bajaj',
      name: 'Bajaj',
      slug: 'bajaj',
      logoColor: '#00539F',
      origin: 'India (Bajaj Auto)',
      vehicleType: 'Two & Three Wheeler'
    },
    models: [
      {
        id: 'boxer-150',
        name: 'Bajaj Boxer 150 (BM150)',
        slug: 'boxer-150',
        type: 'MOTORCYCLE',
        vehicleType: 'MOTORCYCLE',
        yearFrom: 2010,
        yearTo: 2026,
        displacement: '144.8 CC Natural Air Cooled',
        totalParts: 400,
        catalogueFile: 'BAJAJ BOXER 150 CATALOGUE.pdf / folder "Bajaj boxer bm150 parts list"',
        description: 'Heavy-duty rugged export commuter motorcycle engineered for African, Latin American and global markets.'
      },
      {
        id: 're-4-stroke',
        name: 'Bajaj RE 4-Stroke (Auto-Rickshaw)',
        slug: 're-4-stroke',
        type: 'TUKTUK',
        vehicleType: 'TUKTUK',
        yearFrom: 2012,
        yearTo: 2026,
        displacement: '199 CC Twin Spark 4-Stroke',
        totalParts: 550,
        catalogueFile: 'BAJAJ RE 4STOCK.pdf',
        description: 'India\'s and the world\'s leading passenger auto-rickshaw three-wheeler. High durability genuine chassis and differential components.'
      }
    ]
  },
  honda: {
    brand: {
      id: 'honda',
      name: 'Honda',
      slug: 'honda',
      logoColor: '#CC0000',
      origin: 'Japan / India (HMSI)',
      vehicleType: 'Two-Wheeler'
    },
    models: [
      {
        id: 'gl-150',
        name: 'Honda GL150 (GLAL9 / GLBL8)',
        slug: 'gl-150',
        type: 'MOTORCYCLE',
        vehicleType: 'MOTORCYCLE',
        yearFrom: 2014,
        yearTo: 2026,
        displacement: '149.2 CC OHC 4-Stroke',
        totalParts: 430,
        catalogueFile: 'GL150GLAL9_P74_14.pdf / GL150GLBL8_P74.pdf',
        description: 'Global utility and commuter motorcycle engineered for tough conditions, robust chassis and OHC reliable powertrain.'
      }
    ]
  },
  aprilia: {
    brand: {
      id: 'aprilia',
      name: 'Aprilia',
      slug: 'aprilia',
      logoColor: '#D31145',
      origin: 'Italy / India (Piaggio Group)',
      vehicleType: 'Scooter'
    },
    models: [
      {
        id: 'sr-125',
        name: 'Aprilia SR 125',
        slug: 'sr-125',
        type: 'SCOOTER',
        vehicleType: 'SCOOTER',
        yearFrom: 2018,
        yearTo: 2026,
        displacement: '124 CC i-Get 3V Tech',
        totalParts: 350,
        catalogueFile: 'SR 125 NEW.pdf',
        description: 'Sporty performance scooter with 14-inch wheels and racing-inspired aerodynamics.'
      },
      {
        id: 'sr-150',
        name: 'Aprilia SR 150',
        slug: 'sr-150',
        type: 'SCOOTER',
        vehicleType: 'SCOOTER',
        yearFrom: 2016,
        yearTo: 2021,
        displacement: '154.8 CC 3V Carb/FI',
        totalParts: 360,
        catalogueFile: 'SR 150 NEW.pdf',
        description: 'Original Italian performance scooter platform manufactured in Baramati, India.'
      },
      {
        id: 'sr-160',
        name: 'Aprilia SR 160',
        slug: 'sr-160',
        type: 'SCOOTER',
        vehicleType: 'SCOOTER',
        yearFrom: 2020,
        yearTo: 2026,
        displacement: '160 CC FI High Output',
        totalParts: 370,
        catalogueFile: 'SR 160 NEW (1).pdf',
        description: 'High-displacement sports crossover scooter with ABS and aggressive dual headlight styling.'
      },
      {
        id: 'storm-125',
        name: 'Aprilia Storm 125',
        slug: 'storm-125',
        type: 'SCOOTER',
        vehicleType: 'SCOOTER',
        yearFrom: 2019,
        yearTo: 2026,
        displacement: '124 CC High Ground Clearance',
        totalParts: 320,
        catalogueFile: 'STORM 125 NEW.pdf',
        description: 'Rugged all-terrain crossover scooter featuring 12-inch knobby dual-purpose tires and bold matte graphics.'
      }
    ]
  },
  vespa: {
    brand: {
      id: 'vespa',
      name: 'Vespa',
      slug: 'vespa',
      logoColor: '#00875A',
      origin: 'Italy / India (Piaggio Group)',
      vehicleType: 'Scooter'
    },
    models: [
      {
        id: 'vxl-150',
        name: 'Vespa VXL 150 cc',
        slug: 'vxl-150',
        type: 'SCOOTER',
        vehicleType: 'SCOOTER',
        yearFrom: 2016,
        yearTo: 2026,
        displacement: '149 CC 3V i-Get FI',
        totalParts: 360,
        catalogueFile: 'VESPA VXL 150 CC CATALOGUE.pdf',
        description: 'Monocoque steel chassis luxury retro scooter with chrome mirrors and 5-spoke alloys.'
      },
      {
        id: 'vxl-125',
        name: 'Vespa VXL 125',
        slug: 'vxl-125',
        type: 'SCOOTER',
        vehicleType: 'SCOOTER',
        yearFrom: 2016,
        yearTo: 2026,
        displacement: '124 CC 3V i-Get',
        totalParts: 350,
        catalogueFile: 'VXL-125-NEW.pdf',
        description: 'Iconic Italian steel body scooter with combined braking system and digital instrument console.'
      }
    ]
  },
  yamaha: {
    brand: {
      id: 'yamaha',
      name: 'Yamaha',
      slug: 'yamaha',
      logoColor: '#E60012',
      origin: 'Japan / India',
      vehicleType: 'Two-Wheeler'
    },
    models: [
      {
        id: 'ray',
        name: 'Yamaha Ray / Ray ZR',
        slug: 'ray',
        type: 'SCOOTER',
        vehicleType: 'SCOOTER',
        yearFrom: 2015,
        yearTo: 2026,
        displacement: '113 CC / 125 CC Blue Core Fi',
        totalParts: 380,
        catalogueFile: 'YAMAHA RAY NEW.pdf / YAMAHA RAY NEW.zip',
        description: 'Lightweight, high-efficiency Blue Core youth scooter with sporty motorcycle-inspired handlebars and sharp styling.'
      }
    ]
  }
};

export async function GET(
  request: Request,
  { params }: { params: { brand: string } }
) {
  try {
    const brandSlug = (params?.brand || '').toLowerCase().trim();
    const data = BRAND_DATA[brandSlug];

    if (!data) {
      return NextResponse.json({
        success: false,
        error: `Brand '${brandSlug}' not found`,
        brand: { id: brandSlug, name: brandSlug.toUpperCase(), slug: brandSlug },
        models: []
      }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const vehicleType = searchParams.get('vehicleType');

    let models = data.models;
    if (vehicleType && vehicleType !== 'all') {
      models = models.filter(m => m.type.toUpperCase() === vehicleType.toUpperCase() || m.vehicleType?.toUpperCase() === vehicleType.toUpperCase());
    }

    return NextResponse.json({
      success: true,
      brand: data.brand,
      models
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Failed to fetch brand models',
      models: []
    }, { status: 500 });
  }
}
