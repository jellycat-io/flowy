import { OrgsProvider } from '@/contexts/org-context';

import { Navbar } from './_components/navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <OrgsProvider>
      <div className='h-full'>
        <Navbar />
        <main className='pt-14'>{children}</main>
      </div>
    </OrgsProvider>
  );
}
