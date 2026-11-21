import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Export FAQ & Ordering Guidelines | Hastina Motor Parts',
  description: 'Frequently asked questions regarding international MOQ, shipping terms (FOB/CIF), genuine OEM packaging, and custom parts lists.',
  keywords: [
    'spare parts export faq',
    'automotive import moq india',
    'shipping terms fob cif spare parts',
    'oem packaging verification india',
    'two wheeler spare parts export guidance'
  ],
  alternates: {
    canonical: 'https://www.hastinamotorparts.in/faq',
  },
  openGraph: {
    title: 'Export FAQ & Ordering Guidelines | Hastina Motor Parts',
    description: 'Frequently asked questions regarding international MOQ, shipping terms (FOB/CIF), and genuine OEM packaging.',
    url: 'https://www.hastinamotorparts.in/faq',
  }
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
