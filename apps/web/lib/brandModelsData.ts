export interface BrandModelItem {
  id: string;
  name: string;
  slug: string;
  type: 'MOTORCYCLE' | 'SCOOTER' | 'TUKTUK';
  typeLabel: string;
  displacement: string;
  desc: string;
  totalParts: number;
}

export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logoColor: string;
  origin: string;
  vehicleTypes: ('MOTORCYCLE' | 'SCOOTER' | 'TUKTUK')[];
  types: string[];
  modelsCount: number;
  models: BrandModelItem[];
}

export const ALL_BRANDS_WITH_MODELS: BrandItem[] = [
  {
    id: 'suzuki',
    name: 'Suzuki',
    slug: 'suzuki',
    logoColor: '#002E6D',
    origin: 'Japan / India (SMIPL)',
    vehicleTypes: ['SCOOTER', 'MOTORCYCLE'],
    types: ['Scooters', 'Motorcycles'],
    modelsCount: 9,
    models: [
      {
        id: 'access-125',
        name: 'Suzuki Access 125 (UZ125M5)',
        slug: 'access-125',
        type: 'SCOOTER',
        typeLabel: 'Scooter',
        displacement: '124 CC SEP',
        desc: "India's leading 125cc executive scooter with combined braking and LED illumination.",
        totalParts: 1327
      },
      {
        id: 'avenis-125',
        name: 'Suzuki Avenis 125 (UN125M6)',
        slug: 'avenis-125',
        type: 'SCOOTER',
        typeLabel: 'Scooter',
        displacement: '124 CC SEP',
        desc: 'Sporty youth scooter with sharp split headlamp and lightweight alloy wheels.',
        totalParts: 1159
      },
      {
        id: 'burgman-street-125',
        name: 'Suzuki Burgman Street 125 (UB125M6)',
        slug: 'burgman-street-125',
        type: 'SCOOTER',
        typeLabel: 'Maxi Scooter',
        displacement: '124 CC SEP',
        desc: 'Maxi-scooter styling with premium step-through ergonomics and USB charging.',
        totalParts: 1084
      },
      {
        id: 'gixxer-150',
        name: 'Suzuki Gixxer 150 (GSX150M4)',
        slug: 'gixxer-150',
        type: 'MOTORCYCLE',
        typeLabel: 'Streetfighter',
        displacement: '155 CC SEP FI',
        desc: 'Naked streetfighter styling with high-tensile diamond chassis and monoshock.',
        totalParts: 1092
      },
      {
        id: 'gixxer-sf-150',
        name: 'Suzuki Gixxer SF 150 (GSX150FR)',
        slug: 'gixxer-sf-150',
        type: 'MOTORCYCLE',
        typeLabel: 'Motorcycle',
        displacement: '155 CC SEP FI',
        desc: 'Aerodynamic full-faired 155cc street motorcycle with fuel injection and ABS.',
        totalParts: 1103
      },
      {
        id: 'gixxer-sf-250',
        name: 'Suzuki Gixxer SF 250 (GSX250F)',
        slug: 'gixxer-sf-250',
        type: 'MOTORCYCLE',
        typeLabel: 'Motorcycle',
        displacement: '249 CC SOCS',
        desc: 'Quarter-liter sportbike with Suzuki Oil Cooling System (SOCS) and clip-on handlebars.',
        totalParts: 1328
      },
      {
        id: 'intruder-glal9',
        name: 'Suzuki Intruder 150 (GLAL9 / RLAL9)',
        slug: 'intruder-glal9',
        type: 'MOTORCYCLE',
        typeLabel: 'Cruiser',
        displacement: '155 CC SEP FI',
        desc: 'Modern cruiser design with low-slung bucket seat, forward pegs and aerodynamic cowl.',
        totalParts: 1311
      },
      {
        id: 'intruder-glbl8',
        name: 'Suzuki Intruder 150 (GLBL8 / RLBL8)',
        slug: 'intruder-glbl8',
        type: 'MOTORCYCLE',
        typeLabel: 'Cruiser',
        displacement: '155 CC SEP Carb/FI',
        desc: 'Cruiser platform with twin-exhaust pipe styling and electronic instrumentation.',
        totalParts: 1385
      },
      {
        id: 'v-strom-sx-250',
        name: 'Suzuki V-Strom SX 250 (DS250M3)',
        slug: 'v-strom-sx-250',
        type: 'MOTORCYCLE',
        typeLabel: 'Adventure Tourer',
        displacement: '249 CC SOCS Dual Sport',
        desc: 'Sports adventure tourer with 19-inch front wheel, tall windscreen, and dual-purpose chassis.',
        totalParts: 1158
      }
    ]
  },
  {
    id: 'bajaj',
    name: 'Bajaj',
    slug: 'bajaj',
    logoColor: '#00539F',
    origin: 'India (Bajaj Auto)',
    vehicleTypes: ['MOTORCYCLE', 'TUKTUK'],
    types: ['Motorcycles', 'Tuk-Tuk 3W'],
    modelsCount: 2,
    models: [
      {
        id: 'boxer-150',
        name: 'Bajaj Boxer BM 150',
        slug: 'boxer-150',
        type: 'MOTORCYCLE',
        typeLabel: 'Motorcycle',
        displacement: '144.8 CC Air Cooled',
        desc: 'Heavy-duty rugged commuter engineered for African, Latin American and global export markets.',
        totalParts: 755
      },
      {
        id: 're-4-stroke',
        name: 'Bajaj RE 4S (4-Stroke Tuk-Tuk)',
        slug: 're-4-stroke',
        type: 'TUKTUK',
        typeLabel: 'Tuk-Tuk 3-Wheeler',
        displacement: '199 CC Twin Spark 4-Stroke',
        desc: "India's leading passenger auto-rickshaw three-wheeler with high durability chassis and differential.",
        totalParts: 1563
      }
    ]
  },
  {
    id: 'aprilia',
    name: 'Aprilia',
    slug: 'aprilia',
    logoColor: '#D31145',
    origin: 'Italy / India (Piaggio Group)',
    vehicleTypes: ['SCOOTER'],
    types: ['Sport Scooters'],
    modelsCount: 5,
    models: [
      {
        id: 'aprilia-sr-125',
        name: 'Aprilia SR 125 (BS6 MY21)',
        slug: 'aprilia-sr-125',
        type: 'SCOOTER',
        typeLabel: 'Sport Scooter',
        displacement: '124 CC i-Get 3V Tech',
        desc: 'Sporty performance scooter with 14-inch wheels and racing-inspired aerodynamics.',
        totalParts: 782
      },
      {
        id: 'aprilia-sr-150',
        name: 'Aprilia SR 150',
        slug: 'aprilia-sr-150',
        type: 'SCOOTER',
        typeLabel: 'Sport Scooter',
        displacement: '154.8 CC 3V Carb/FI',
        desc: 'Original Italian performance scooter platform manufactured in Baramati, India.',
        totalParts: 735
      },
      {
        id: 'aprilia-storm-125',
        name: 'Aprilia Storm 125 (DT BS-VI)',
        slug: 'aprilia-storm-125',
        type: 'SCOOTER',
        typeLabel: 'Crossover Scooter',
        displacement: '124 CC High Ground Clearance',
        desc: 'Rugged all-terrain crossover scooter featuring 12-inch knobby dual-purpose tires.',
        totalParts: 752
      },
      {
        id: 'aprilia-sxr-gt-125',
        name: 'Aprilia SXR GT 125 HPE (MY 2026)',
        slug: 'aprilia-sxr-gt-125',
        type: 'SCOOTER',
        typeLabel: 'Maxi Scooter',
        displacement: '125 CC HPE OBD2B',
        desc: 'Crossmax styling scooter with full LED headlamps and Bluetooth connectivity.',
        totalParts: 818
      },
      {
        id: 'aprilia-sxr-gt-175',
        name: 'Aprilia SXR GT 175 HPE (MY 2026)',
        slug: 'aprilia-sxr-gt-175',
        type: 'SCOOTER',
        typeLabel: 'Maxi Scooter',
        displacement: '175 CC HPE ABS',
        desc: 'High output performance grand tourer with advanced ABS and digital cockpit.',
        totalParts: 837
      }
    ]
  },
  {
    id: 'vespa',
    name: 'Vespa',
    slug: 'vespa',
    logoColor: '#00875A',
    origin: 'Italy / India (Piaggio Group)',
    vehicleTypes: ['SCOOTER'],
    types: ['Classic Scooters'],
    modelsCount: 2,
    models: [
      {
        id: 'vespa-vxl-125',
        name: 'Vespa VXL 125',
        slug: 'vespa-vxl-125',
        type: 'SCOOTER',
        typeLabel: 'Classic Scooter',
        displacement: '124 CC 3V i-Get',
        desc: 'Iconic Italian steel body scooter with combined braking system and digital console.',
        totalParts: 853
      },
      {
        id: 'vespa-vxl-150',
        name: 'Vespa VXL 150 (ABS BS-VI)',
        slug: 'vespa-vxl-150',
        type: 'SCOOTER',
        typeLabel: 'Classic Scooter',
        displacement: '149 CC 3V i-Get FI',
        desc: 'Monocoque steel chassis luxury retro scooter with chrome mirrors and 5-spoke alloys.',
        totalParts: 928
      }
    ]
  },
  {
    id: 'yamaha',
    name: 'Yamaha',
    slug: 'yamaha',
    logoColor: '#E60012',
    origin: 'Japan / India',
    vehicleTypes: ['SCOOTER'],
    types: ['Scooters'],
    modelsCount: 1,
    models: [
      {
        id: 'yamaha-ray-115',
        name: 'Yamaha Ray (XC115 1GC1)',
        slug: 'yamaha-ray-115',
        type: 'SCOOTER',
        typeLabel: 'Scooter',
        displacement: '113 CC Blue Core',
        desc: 'Lightweight, high-efficiency Blue Core youth scooter with sporty styling.',
        totalParts: 707
      }
    ]
  }
];
