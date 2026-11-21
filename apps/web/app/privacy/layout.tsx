import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Alisons General Trading LLP',
  description: 'Privacy policy and client data confidentiality commitment for international B2B buyers of Hastina Motor Parts.',
  alternates: {
    canonical: 'https://www.hastinamotorparts.in/privacy',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
