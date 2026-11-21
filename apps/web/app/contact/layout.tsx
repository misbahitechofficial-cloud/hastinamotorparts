import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Export Desk & Request Quotation | Hastina Motor Parts',
  description: 'Contact our export sales desk in New Delhi for container pricing, OEM parts lists, and international logistics support via WhatsApp or email.',
  keywords: [
    'contact hastina motor parts',
    'automotive parts export sales new delhi',
    'request rfq spare parts india',
    'alisons general trading contact',
    'spare parts export whatsapp india'
  ],
  alternates: {
    canonical: 'https://www.hastinamotorparts.in/contact',
  },
  openGraph: {
    title: 'Contact Export Desk & Request Quotation | Hastina Motor Parts',
    description: 'Contact our export sales desk in New Delhi for container pricing, OEM parts lists, and international logistics.',
    url: 'https://www.hastinamotorparts.in/contact',
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
