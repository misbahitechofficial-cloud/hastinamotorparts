import * as XLSX from 'xlsx';
import { store, PartRecord } from '../store';
import { slugify } from './slugify';
import { normalizePartNo } from './normalizePartNo';

export interface ImportResult {
  totalRows: number;
  importedCount: number;
  updatedCount: number;
  errors: Array<{
    row: number;
    partNumber?: string;
    field?: string;
    message: string;
  }>;
}

export function parseExcelBuffer(buffer: Buffer): ImportResult {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  const result: ImportResult = {
    totalRows: rawRows.length,
    importedCount: 0,
    updatedCount: 0,
    errors: []
  };

  rawRows.forEach((row, index) => {
    const rowNum = index + 2; // +2 for 1-based index and header row

    const partNumber = String(row['part_number'] || row['Part Number'] || '').trim();
    const name = String(row['name'] || row['Name'] || row['Part Name'] || '').trim();
    const brandName = String(row['brand'] || row['Brand'] || '').trim();
    const modelsStr = String(row['models'] || row['Models'] || '').trim();
    const categoryL1 = String(row['category_l1'] || row['Category L1'] || '').trim();
    const categoryL2 = String(row['category_l2'] || row['Category L2'] || '').trim();
    const categoryL3 = String(row['category_l3'] || row['Category L3'] || '').trim();
    const gradeRaw = String(row['grade'] || row['Grade'] || 'GENUINE').trim().toUpperCase();
    const altNumbersRaw = String(row['alt_numbers'] || row['Alt Numbers'] || '').trim();
    const description = String(row['description'] || row['Description'] || '').trim();
    const specsRaw = String(row['specs'] || row['Specs'] || '').trim();
    const moqRaw = Number(row['moq'] || row['MOQ'] || 1);
    const weightRaw = Number(row['weight_kg'] || row['Weight'] || 0.5);
    const imageFile = String(row['image_file'] || row['Image'] || '').trim();

    if (!partNumber) {
      result.errors.push({ row: rowNum, message: 'Missing required field: part_number' });
      return;
    }

    if (!name) {
      result.errors.push({ row: rowNum, partNumber, message: 'Missing required field: name' });
      return;
    }

    // Resolve Grade
    let grade: 'GENUINE' | 'OES' | 'AFTERMARKET' = 'GENUINE';
    if (['GENUINE', 'OES', 'AFTERMARKET'].includes(gradeRaw)) {
      grade = gradeRaw as any;
    }

    // Resolve Category
    let categoryId = 1; // Default
    if (categoryL3) {
      const match = store.categories.find(c => c.name.toLowerCase() === categoryL3.toLowerCase() && c.level === 3);
      if (match) categoryId = match.id;
    } else if (categoryL2) {
      const match = store.categories.find(c => c.name.toLowerCase() === categoryL2.toLowerCase() && c.level === 2);
      if (match) categoryId = match.id;
    } else if (categoryL1) {
      const match = store.categories.find(c => c.name.toLowerCase() === categoryL1.toLowerCase() && c.level === 1);
      if (match) categoryId = match.id;
    }

    // Resolve Models
    const fitmentModelIds: number[] = [];
    if (modelsStr) {
      const modelNames = modelsStr.split(/[,;|]/).map(s => s.trim().toLowerCase());
      for (const mName of modelNames) {
        if (!mName) continue;
        const matchedModel = store.models.find(m => m.name.toLowerCase().includes(mName) || m.slug.includes(mName));
        if (matchedModel) {
          fitmentModelIds.push(matchedModel.id);
        } else {
          result.errors.push({
            row: rowNum,
            partNumber,
            message: `Warning: Model '${mName}' not recognized in system`
          });
        }
      }
    }

    // Parse Specs (format: key:value;key:value)
    const specs: Record<string, string | number> = {};
    if (specsRaw) {
      const pairs = specsRaw.split(';');
      for (const pair of pairs) {
        const [k, v] = pair.split(':');
        if (k && v) specs[k.trim()] = v.trim();
      }
    }

    // Parse Alt Numbers
    const altNumbers = altNumbersRaw ? altNumbersRaw.split(/[,;|]/).map(s => s.trim()).filter(Boolean) : [];

    // Parse Images
    const images: string[] = imageFile ? [imageFile] : [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
    ];

    // Check if part exists
    const existingIndex = store.parts.findIndex(p => normalizePartNo(p.partNumber) === normalizePartNo(partNumber));
    if (existingIndex >= 0) {
      // Update existing part
      const existing = store.parts[existingIndex];
      store.parts[existingIndex] = {
        ...existing,
        name,
        altNumbers: Array.from(new Set([...existing.altNumbers, ...altNumbers])),
        categoryId,
        grade,
        description: description || existing.description,
        specs: { ...existing.specs, ...specs },
        moq: moqRaw || existing.moq,
        weightKg: weightRaw || existing.weightKg,
        images: images.length ? images : existing.images,
        fitmentModelIds: Array.from(new Set([...existing.fitmentModelIds, ...fitmentModelIds])),
        updatedAt: new Date()
      };
      result.updatedCount++;
    } else {
      // Insert new part
      const newPart: PartRecord = {
        id: Math.max(...store.parts.map(p => p.id), 0) + 1,
        partNumber,
        altNumbers,
        name,
        slug: slugify(`${name}-${partNumber}`),
        categoryId,
        grade,
        description: description || `Genuine export spare part for two-wheeler / three-wheeler from ALISONS GENERAL TRADING LLP.`,
        specs,
        weightKg: weightRaw,
        moq: moqRaw,
        isFeatured: false,
        isActive: true,
        images,
        fitmentModelIds,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      store.parts.unshift(newPart);
      result.importedCount++;
    }
  });

  return result;
}

export function generateTemplateWorkbook(): Buffer {
  const sampleData = [
    {
      'part_number': '36360086',
      'alt_numbers': 'DH101048, 36DH4001',
      'name': 'Cylinder Block Kit with Piston & Rings (57mm Bore)',
      'category_l1': 'Engine Parts',
      'category_l2': 'Piston & Cylinder Kits',
      'category_l3': 'Complete Bore & Piston Kits',
      'grade': 'GENUINE',
      'brand': 'Bajaj',
      'models': 'Pulsar 150, Discover 125',
      'description': 'Original OEM Bajaj cylinder block assembly with piston, rings, pin, and circlips.',
      'specs': 'Bore:57mm;Displacement:149.5cc;Material:Aluminum Sleeve',
      'moq': 10,
      'weight_kg': 2.85,
      'image_file': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
    },
    {
      'part_number': '27601-33G00',
      'alt_numbers': 'BANDO-765-19-28',
      'name': 'CVT Drive V-Belt for Suzuki Access & Burgman',
      'category_l1': 'Drive Belts & Rollers',
      'category_l2': 'CVT Variator Belts',
      'category_l3': 'OEM Standard Drive Belts',
      'grade': 'GENUINE',
      'brand': 'Suzuki',
      'models': 'Access 125, Burgman Street 125, Avenis 125',
      'description': 'Genuine Suzuki transmission belt with aramid tensile cords.',
      'specs': 'Length:765mm;Width:19.2mm;Angle:28deg',
      'moq': 20,
      'weight_kg': 0.22,
      'image_file': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Parts Import Template');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}
