import * as XLSX from 'xlsx';
import { store } from '../store';

export function exportPartsToExcel(): Buffer {
  const parts = store.parts.map(p => {
    const category = store.categories.find(c => c.id === p.categoryId);
    const models = store.getCompatibleModels(p.fitmentModelIds);
    return {
      'Part Number': p.partNumber,
      'Alt Numbers': p.altNumbers.join(', '),
      'Name': p.name,
      'Grade': p.grade,
      'Category': category?.name || '',
      'Compatible Models': models.map(m => `${m.brandName} ${m.name}`).join('; '),
      'MOQ': p.moq,
      'Weight (kg)': p.weightKg,
      'Description': p.description,
      'Specs': Object.entries(p.specs || {}).map(([k, v]) => `${k}:${v}`).join('; '),
      'Is Active': p.isActive ? 'Yes' : 'No'
    };
  });

  const ws = XLSX.utils.json_to_sheet(parts);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Catalogue Parts');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

export function exportEnquiriesToExcel(): Buffer {
  const rows: any[] = [];
  store.enquiries.forEach(e => {
    e.items.forEach((item, idx) => {
      rows.push({
        'Ref Number': e.refNo,
        'Date': e.createdAt.toISOString().split('T')[0],
        'Status': e.status,
        'Buyer Name': e.name,
        'Company': e.company || '',
        'Country': e.country,
        'Email': e.email,
        'Phone': e.phone || '',
        'Item #': idx + 1,
        'Part Number': item.partNumber,
        'Part Name': item.partName || '',
        'Quantity': item.quantity,
        'Customer Message': idx === 0 ? e.message || '' : '',
        'Admin Notes': idx === 0 ? e.notes || '' : ''
      });
    });
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Quotation Enquiries');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}
