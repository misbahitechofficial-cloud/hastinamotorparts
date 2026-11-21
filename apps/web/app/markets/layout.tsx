import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Export Markets | Middle East, Africa, Asia & Latin America',
  description: 'Hastina Motor Parts ships commercial container cargo and air freight to UAE, Iraq, Saudi Arabia, Ghana, Nigeria, Kenya, Egypt, and beyond.',
  keywords: [
    'auto parts export to uae dubai',
    'motorcycle parts export africa nigeria ghana',
    'tuk tuk spares iraq middle east',
    'spare parts container shipping nhava sheva mundra',
    'automotive trade solutions worldwide'
  ],
  alternates: {
    canonical: 'https://www.hastinamotorparts.in/markets',
  },
  openGraph: {
    title: 'Global Export Markets | Middle East, Africa, Asia & Latin America',
    description: 'Hastina Motor Parts ships commercial container cargo and air freight worldwide.',
    url: 'https://www.hastinamotorparts.in/markets',
  }
};

export default function MarketsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
