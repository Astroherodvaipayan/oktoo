import Link from 'next/link';

const FooterLinkContent = () => {
  const oktopayContent = (
    <Link href="https://x.com/oktopayit" target="_blank" className="flex-row flex items-center gap-2">
      <img className="h-4 w-4" src="/logo.webp" />
      <h1 className="text-primary text-sm text-center font-bold">emoji pay</h1>
    </Link>
  );
  return (
    <footer className="font-sans border-t px-4 gap-4 md:px-6 py-6 flex items-center justify-between mt-12">
      <div className="hidden sm:flex p-2 rounded-4xl hover:bg-accent">{oktopayContent}</div>
      <div className="flex flex-row  flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="sm:hidden">{oktopayContent}</div>
        <Link href="https://x.com/oktopayit" prefetch={false}>
          Terms & Conditions
        </Link>
        <Link href="https://x.com/oktopayit" prefetch={false}>
          Privacy Policy
        </Link>
        <Link href="https://x.com/oktopayit" prefetch={false}>
          Contact
        </Link>
        <span className="text-white">© Copyright {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};

export default FooterLinkContent;
