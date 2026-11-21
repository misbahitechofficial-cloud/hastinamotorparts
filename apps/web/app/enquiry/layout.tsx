import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RFQ Inquiry Basket & Bulk Parts Order | Hastina Motor Parts',
  description: 'Submit your Request for Quotation (RFQ) or paste OEM part numbers for fast wholesale pricing and international shipping proforma.',
  keywords: [
    'request for quotation auto parts',
    'rfq spare parts india',
    'bulk motorcycle parts inquiry',
    'wholesale parts order online',
    'oem part number paste quotation'
  ],
  alternates: {
    canonical: 'https://www.hastinamotorparts.in/enquiry',
  },
  openGraph: {
    title: 'RFQ Inquiry Basket & Bulk Parts Order | Hastina Motor Parts',
    description: 'Submit your Request for Quotation (RFQ) for fast wholesale pricing and international shipping proforma.',
    url: 'https://www.hastinamotorparts.in/enquiry',
  }
};

export default function EnquiryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
