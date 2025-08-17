import { footerLinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => (
  <footer className="mt-5 flex flex-col  border-t border-gray-100 text-black-100">
    <div className="flex flex-wrap justify-between gap-5 px-6 py-10 max-md:flex-col sm:px-16">
      <div className="flex flex-col items-start justify-start gap-6">
        <Image src="/logo.svg" alt="logo" width={118} height={18} className="object-contain" />
        <p className="text-base text-gray-700">
          Carhub {new Date().getFullYear()} <br />
          All Rights Reserved &copy;
        </p>
      </div>

      <div className="footer__links">
        {footerLinks.map((item) => (
          <div key={item.title} className="footer__link">
            <h3 className="font-bold">{item.title}</h3>
            <div className="flex flex-col gap-5">
              {item.links.map((link) => (
                <Link key={link.title} href={link.url} className="text-gray-500">
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-10 flex flex-wrap items-center justify-between border-t border-gray-100 px-6 py-10 sm:px-16">
      <p>Copyright @ {new Date().getFullYear()} CarHub. Ali - Tous droits réservés.</p>

      <div className="footer__copyrights-link">
        <Link href="/" className="text-gray-500">
          Privacy & Policy
        </Link>
        <Link href="/" className="text-gray-500">
          Terms & Condition
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
