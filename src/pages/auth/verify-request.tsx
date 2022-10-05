import Image from 'next/image';

const VerifyRequestPage = () => (
  <div className="lg:grid grid-cols-2 min-h-screen bg-white dark:bg-transparent">
    <div className="hidden lg:flex bg-blue-900/90 dark:bg-blue-900/60 py-20">
      <div className="relative flex w-full items-center justify-center">
        <Image src="/images/blob-animation.svg" alt="" layout="fill" />
        <div className="w-[500px] h-[500px] relative">
          <Image src="/images/login-image.svg" alt="" layout="fill" />
        </div>
      </div>
    </div>
    <div className="p-5 lg:p-20 h-full max-w-[800px] mx-auto flex flex-col justify-center">
      <h2 className="font-poppins text-2xl lg:text-5xl font-semibold mb-5">
        Check your email
      </h2>
      <p className="text-lg lg:text-2xl mb-10 lg:mb-20">
        A sign in link has been sent to your email address.
      </p>
    </div>
  </div>
);

export default VerifyRequestPage;
