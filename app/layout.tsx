import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Encapsul — Empty kilos. Full potential.',
  description: 'A new way to move things across Nigeria. Join the Encapsul waitlist for early access and beta testing. Planned pilot: Lagos to Abuja.',
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
