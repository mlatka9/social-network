import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/common/button';

export default function FourOhFour() {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <div className="flex lg:hidden w-full">
          <div className="relative flex w-full items-center justify-center mb-10">
            <div className="w-full h-36 md:h-72 relative">
              <Image src="/images/404-image.svg" alt="" layout="fill" />
            </div>
          </div>
        </div>
        <h1 className="font-poppins text-8xl lg:text-[250px]">404</h1>
        <p className="text-lg lg:text-3xl tracking-wide mb-16 lg:mb-24">
          Something is missing
        </p>
        <Link href="/" passHref>
          <Button>Go back home</Button>
        </Link>
      </div>
      <div className="hidden  lg:flex w-full items-center justify-center bg-blue-900/90 dark:bg-blue-900/60 p-20">
        <div className="relative w-full h-full max-w-[700px]">
          <Image src="/images/blob-animation.svg" alt="" layout="fill" />
          <Image src="/images/404-image.svg" layout="fill" />
        </div>
      </div>
    </div>
  );
}
