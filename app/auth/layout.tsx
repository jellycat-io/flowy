import { ThemeToggle } from '@/components/theme/theme-toggle';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className='h-full flex items-center justify-center bg-gradient-to-r from-sky-400 to-amber-500'
      suppressHydrationWarning
    >
      <div className='fixed top-4 right-4'>
        <ThemeToggle />
      </div>
      {children}
    </main>
  );
}
