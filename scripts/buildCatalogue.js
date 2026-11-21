/**
 * Automated Catalogue Compiler
 * Reads all catalogue HTML code files in 'Catalogue/Code Files',
 * extracts PARTS, FIGURES, and technical DIAGRAM IMAGES,
 * saves diagram images as static WebP files to 'apps/web/public/diagrams/[modelSlug]/',
 * groups models by Brand, and generates optimized 'apps/web/lib/embeddedCatalogue.ts'.
 */

const fs = require('fs');
const path = require('path');

const CODE_FILES_DIR = path.resolve(__dirname, '../Catalogue/Code Files');
const TARGET_CATALOGUE_TS = path.resolve(__dirname, '../apps/web/lib/embeddedCatalogue.ts');
const DIAGRAMS_PUBLIC_DIR = path.resolve(__dirname, '../apps/web/public/diagrams');

function extractImagesMap(content) {
  const start = content.indexOf('const IMAGES = ');
  if (start === -1) return {};

  const nextConst = content.indexOf('const COLORS', start);
  const end = nextConst !== -1
    ? content.lastIndexOf('}', nextConst) + 1
    : content.indexOf('};\n', start) + 1;

  const jsonStr = content.substring(start + 'const IMAGES = '.length, end);
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    console.warn('Could not parse IMAGES JSON:', err.message);
    return {};
  }
}

function main() {
  console.log('--- Scanning Code Files in:', CODE_FILES_DIR);

  // Ensure diagrams dir exists
  if (!fs.existsSync(DIAGRAMS_PUBLIC_DIR)) {
    fs.mkdirSync(DIAGRAMS_PUBLIC_DIR, { recursive: true });
  }

  // Read existing embeddedCatalogue to retain models that don't have code files yet
  let existingDB = { m: [], c: [], r: [] };
  if (fs.existsSync(TARGET_CATALOGUE_TS)) {
    try {
      const existingContent = fs.readFileSync(TARGET_CATALOGUE_TS, 'utf8');
      const match = existingContent.match(/CATALOGUE_DB:\s*CatalogueDBType\s*=\s*(\{[\s\S]*\});?\s*$/);
      if (match) {
        existingDB = JSON.parse(match[1]);
        console.log(`Loaded existing DB with ${existingDB.m.length} models and ${existingDB.r.length} parts.`);
      }
    } catch (err) {
      console.warn('Could not parse existing DB, creating fresh:', err.message);
    }
  }

  // Scan Code Files
  const codeFiles = fs.readdirSync(CODE_FILES_DIR).filter(f => f.toLowerCase().endsWith('.html'));
  console.log(`Found ${codeFiles.length} code file(s):`, codeFiles);

  const modelMap = new Map();

  codeFiles.forEach(file => {
    const fullPath = path.join(CODE_FILES_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const lower = file.toLowerCase();

    let brand = 'Other';
    let brandSlug = 'other';
    let modelCode = '';
    let modelLabel = '';
    let modelSlug = '';

    // Brand mapping
    if (lower.includes('bajaj')) { brand = 'Bajaj'; brandSlug = 'bajaj'; }
    else if (lower.includes('suzuki')) { brand = 'Suzuki'; brandSlug = 'suzuki'; }
    else if (lower.includes('honda')) { brand = 'Honda'; brandSlug = 'honda'; }
    else if (lower.includes('tvs')) { brand = 'TVS'; brandSlug = 'tvs'; }
    else if (lower.includes('yamaha')) { brand = 'Yamaha'; brandSlug = 'yamaha'; }
    else if (lower.includes('vespa')) { brand = 'Vespa'; brandSlug = 'vespa'; }
    else if (lower.includes('aprilia')) { brand = 'Aprilia'; brandSlug = 'aprilia'; }
    else if (lower.includes('piaggio')) { brand = 'Piaggio'; brandSlug = 'piaggio'; }

    // Model mapping
    if (lower.includes('bajaj_re_4s') || lower.includes('re_4s') || lower.includes('re_4stock') || lower.includes('re_4_stroke')) {
      modelCode = 'RE4S';
      modelLabel = 'Bajaj RE 4S (4-Stroke Tuk-Tuk)';
      modelSlug = 're-4-stroke';
    } else if (lower.includes('boxer') || lower.includes('bm_150') || lower.includes('bm150')) {
      modelCode = 'BM150';
      modelLabel = 'Boxer BM 150';
      modelSlug = 'boxer-150';
    } else if (lower.includes('access') || lower.includes('uz125m5')) {
      modelCode = 'UZ125M5';
      modelLabel = 'Access 125 (UZ125M5 2025)';
      modelSlug = 'access-125';
    } else if (lower.includes('avenis') || lower.includes('un125m6')) {
      modelCode = 'UN125M6';
      modelLabel = 'Avenis 125 (UN125M6 2025-26)';
      modelSlug = 'avenis-125';
    } else if (lower.includes('burgman') || lower.includes('ub125m6')) {
      modelCode = 'UB125M6';
      modelLabel = 'Burgman Street 125 (UB125M6)';
      modelSlug = 'burgman-street-125';
    } else if (lower.includes('gixxer_sf_250') || lower.includes('gsx250f')) {
      modelCode = 'GSX250F';
      modelLabel = 'Gixxer SF 250 (GSX250F)';
      modelSlug = 'gixxer-sf-250';
    } else if (lower.includes('gixxer_sf_150') || lower.includes('gsx150frlm4')) {
      modelCode = 'GSX150FR';
      modelLabel = 'Gixxer SF 150 (GSX150FRLM4)';
      modelSlug = 'gixxer-sf-150';
    } else if (lower.includes('gixxer_150') || lower.includes('gsx150rlm4')) {
      modelCode = 'GSX150M4';
      modelLabel = 'Gixxer 150 (GSX150RLM4)';
      modelSlug = 'gixxer-150';
    } else if (lower.includes('intruder') && lower.includes('glal9')) {
      modelCode = 'GL150AL9';
      modelLabel = 'Intruder 150 (GLAL9 / RLAL9)';
      modelSlug = 'intruder-glal9';
    } else if (lower.includes('intruder') && lower.includes('glbl8')) {
      modelCode = 'GL150BL8';
      modelLabel = 'Intruder 150 (GLBL8 / RLBL8)';
      modelSlug = 'intruder-glbl8';
    } else if (lower.includes('v_strom') || lower.includes('ds250rlm3') || lower.includes('v-strom')) {
      modelCode = 'DS250M3';
      modelLabel = 'V-Strom SX 250 (DS250RLM3)';
      modelSlug = 'v-strom-sx-250';
    } else if (lower.includes('sr_125')) {
      modelCode = 'SR125';
      modelLabel = 'Aprilia SR 125 (BS6 MY21)';
      modelSlug = 'aprilia-sr-125';
    } else if (lower.includes('sr_150')) {
      modelCode = 'SR150';
      modelLabel = 'Aprilia SR 150';
      modelSlug = 'aprilia-sr-150';
    } else if (lower.includes('storm_125')) {
      modelCode = 'STORM125';
      modelLabel = 'Aprilia Storm 125 (DT BS-VI)';
      modelSlug = 'aprilia-storm-125';
    } else if (lower.includes('sxr_gt_125') || lower.includes('sxr_125')) {
      modelCode = 'SXR125';
      modelLabel = 'Aprilia SXR GT 125 HPE (MY 2026)';
      modelSlug = 'aprilia-sxr-gt-125';
    } else if (lower.includes('sxr_gt_175') || lower.includes('sxr_175')) {
      modelCode = 'SXR175';
      modelLabel = 'Aprilia SXR GT 175 HPE (MY 2026)';
      modelSlug = 'aprilia-sxr-gt-175';
    } else if (lower.includes('vespa_vxl_125') || lower.includes('vxl_125')) {
      modelCode = 'VXL125';
      modelLabel = 'Vespa VXL 125';
      modelSlug = 'vespa-vxl-125';
    } else if (lower.includes('vespa_vxl_150') || lower.includes('vxl_150')) {
      modelCode = 'VXL150';
      modelLabel = 'Vespa VXL 150 (ABS BS-VI)';
      modelSlug = 'vespa-vxl-150';
    } else if (lower.includes('ray_xc115') || lower.includes('xc115') || lower.includes('ray')) {
      modelCode = 'XC115';
      modelLabel = 'Yamaha Ray (XC115 1GC1)';
      modelSlug = 'yamaha-ray-115';
    } else {
      modelCode = file.replace(/\.html$/i, '').toUpperCase().slice(0, 10);
      modelLabel = file.replace(/\.html$/i, '').replace(/_/g, ' ');
      modelSlug = modelCode.toLowerCase();
    }

    // Extract Diagram Images Map
    const imagesMap = extractImagesMap(content);
    const modelDiagramsDir = path.join(DIAGRAMS_PUBLIC_DIR, modelSlug);
    if (!fs.existsSync(modelDiagramsDir)) {
      fs.mkdirSync(modelDiagramsDir, { recursive: true });
    }

    let savedImagesCount = 0;
    Object.keys(imagesMap).forEach(imgKey => {
      const dataUri = imagesMap[imgKey];
      if (dataUri && dataUri.startsWith('data:image')) {
        const base64Data = dataUri.replace(/^data:image\/[a-z]+;base64,/, '');
        const targetFilePath = path.join(modelDiagramsDir, `${imgKey}.webp`);
        fs.writeFileSync(targetFilePath, Buffer.from(base64Data, 'base64'));
        savedImagesCount++;
      }
    });
    console.log(`Saved ${savedImagesCount} diagram images to /diagrams/${modelSlug}/`);

    // Extract Parts
    const partsMatch = content.match(/const PARTS\s*=\s*(\[[\s\S]*?\]);/);
    if (!partsMatch) {
      console.warn(`No 'const PARTS' found in ${file}`);
      return;
    }

    const rawParts = JSON.parse(partsMatch[1]);
    const cleanParts = rawParts.map(p => {
      const imgKey = p.i || '';
      const hasImg = imagesMap[imgKey] ? true : false;
      const imgUrl = hasImg ? `/diagrams/${modelSlug}/${imgKey}.webp` : '';

      return {
        partNo: (p.p || '').trim(),
        desc: (p.n || '').trim(),
        fig: (p.f || '').trim(),
        category: (p.t || p.s || 'General Components').trim(),
        qty: String(p.q || '1').trim(),
        refNo: String(p.r || '').trim(),
        img: imgUrl
      };
    }).filter(p => p.partNo && p.desc);

    console.log(`[Code File] ${file} => Brand: ${brand}, Model: ${modelLabel} (${modelCode}), Parts: ${cleanParts.length}`);

    modelMap.set(modelCode, {
      modelMeta: {
        code: modelCode,
        label: modelLabel,
        brand,
        brandSlug,
        slug: modelSlug,
        count: cleanParts.length
      },
      parts: cleanParts
    });
  });

  // Retain models from existingDB that were not in Code Files
  if (existingDB && existingDB.m && existingDB.r) {
    existingDB.m.forEach((oldM, oldIdx) => {
      if (!modelMap.has(oldM.code)) {
        const oldParts = existingDB.r
          .filter(r => r[0] === oldIdx)
          .map(r => ({
            fig: r[1],
            category: existingDB.c[r[2]] || 'General Components',
            partNo: r[3],
            desc: r[4],
            qty: String(r[5] || '1'),
            refNo: String(r[6] || ''),
            img: String(r[7] || '')
          }));

        let brand = 'Suzuki';
        let brandSlug = 'suzuki';
        if (oldM.label.toLowerCase().includes('bajaj')) { brand = 'Bajaj'; brandSlug = 'bajaj'; }

        console.log(`[Retained Existing Model] ${oldM.label} (${oldM.code}) with ${oldParts.length} parts.`);

        modelMap.set(oldM.code, {
          modelMeta: {
            code: oldM.code,
            label: oldM.label,
            brand: oldM.brand || brand,
            brandSlug: oldM.brandSlug || brandSlug,
            slug: oldM.slug || oldM.code.toLowerCase(),
            count: oldParts.length
          },
          parts: oldParts
        });
      } else {
        console.log(`[Replaced Model] '${oldM.code}' replaced by official Code File.`);
      }
    });
  }

  // Build unified compact DB
  const models = [];
  const categoryIndexMap = new Map();
  const categories = [];
  const rows = [];

  function getCategoryIndex(catName) {
    const norm = (catName || 'General Components').trim();
    if (!categoryIndexMap.has(norm)) {
      categoryIndexMap.set(norm, categories.length);
      categories.push(norm);
    }
    return categoryIndexMap.get(norm);
  }

  // Sort models by Brand then Model Name
  const sortedModelKeys = Array.from(modelMap.keys()).sort((a, b) => {
    const ma = modelMap.get(a).modelMeta;
    const mb = modelMap.get(b).modelMeta;
    if (ma.brand !== mb.brand) return ma.brand.localeCompare(mb.brand);
    return ma.label.localeCompare(mb.label);
  });

  sortedModelKeys.forEach((mCode, modelIdx) => {
    const item = modelMap.get(mCode);
    models.push({
      ...item.modelMeta,
      count: item.parts.length
    });

    item.parts.forEach(p => {
      const catIdx = getCategoryIndex(p.category);
      rows.push([
        modelIdx,
        p.fig,
        catIdx,
        p.partNo,
        p.desc,
        p.qty,
        p.refNo,
        p.img
      ]);
    });
  });

  console.log(`\n=== FINAL COMPILATION STATS ===`);
  console.log(`Total Models: ${models.length}`);
  models.forEach(m => console.log(` - [${m.brand}] ${m.label} (${m.code}): ${m.count} parts`));
  console.log(`Total Unique Categories: ${categories.length}`);
  console.log(`Total Parts: ${rows.length}`);

  // Generate TypeScript source
  const tsSource = `export interface ModelMeta {
  code: string;
  label: string;
  brand: string;
  brandSlug: string;
  slug: string;
  count: number;
}

export interface CatalogueDBType {
  m: ModelMeta[];
  c: string[];
  r: [number, string, number, string, string, string, string, string][];
}

export const CATALOGUE_DB: CatalogueDBType = ${JSON.stringify({ m: models, c: categories, r: rows })};

export function getCatalogueBrands(): { name: string; slug: string; modelCount: number; partCount: number }[] {
  const brandMap = new Map<string, { name: string; slug: string; modelCount: number; partCount: number }>();
  CATALOGUE_DB.m.forEach((m) => {
    if (!brandMap.has(m.brand)) {
      brandMap.set(m.brand, { name: m.brand, slug: m.brandSlug, modelCount: 0, partCount: 0 });
    }
    const b = brandMap.get(m.brand)!;
    b.modelCount += 1;
    b.partCount += m.count;
  });
  return Array.from(brandMap.values());
}
`;

  fs.writeFileSync(TARGET_CATALOGUE_TS, tsSource, 'utf8');
  console.log(`\nSuccessfully wrote compiled catalogue to: ${TARGET_CATALOGUE_TS}`);
}

main();
