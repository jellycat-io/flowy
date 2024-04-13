import Image from 'next/image';

import logo from '../public/seer_logo.svg';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className='p-4'>
      <h1>Hello Flowy!</h1>
      <Button>Click me</Button>
    </main>
  );
}
