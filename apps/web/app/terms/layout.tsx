import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Hastina Motor Parts',
  description: 'Commercial terms, export conditions, and warranty policies for wholesale automotive spare parts supply.',
  alternates: {
    canonical: 'https://www.hastinamotorparts.in/terms',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
