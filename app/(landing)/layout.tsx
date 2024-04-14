import { Footer } from './_components/footer';
import { Navbar } from './_components/navbar';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({
  children,
}: Readonly<LandingLayoutProps>) {
  return (
    <div className='h-full'>
      <Navbar />
      <main className='py-20'>{children}</main>
      <Footer />
    </div>
  );
}
