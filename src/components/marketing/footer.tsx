import Link from 'next/link';
import Image from 'next/image';
import Container from '../global/container';
import Wrapper from '../global/wrapper';
import { Button } from '../ui/button';
import { FOOTER_LINKS } from '@/constants';

const Footer = () => {
  return (
    <footer className="w-full py-10 relative border-t border-foreground/10">
      <Container>
        <Wrapper className="relative flex flex-col md:flex-row justify-between gap-10 pb-16">
          <div className="flex flex-col items-start max-w-sm">
            <Link href="/#home" className="hover:opacity-80 transition-opacity duration-300">
              <Image
                src="/images/icon.png"
                alt="Neros Finance  Nazeer Yazeed Ngunga"
                width={1536}
                height={1024}
                className="h-14 w-auto rounded-lg"
              />
            </Link>
            <p className="text-sm mt-4 text-muted-foreground leading-relaxed">
              Open-source car finance estimates by Nazeer  payment, balloon, budget leftover, and
              early trade. Not a bank quote, and not financial advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button asChild className="shadow-none">
                <Link href="/#calculator">Open calculator</Link>
              </Button>
              <Button asChild variant="outline" className="shadow-none">
                <Link href="/#how">How it works</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 w-full max-w-md mt-4 md:mt-0">
            {FOOTER_LINKS?.map((section, index) => (
              <div key={index} className="flex flex-col gap-4">
                <h4 className="text-sm font-medium text-foreground">{section.title}</h4>
                <ul className="space-y-3 w-full">
                  {section.links.map((link, linkIndex) => (
                    <li
                      key={linkIndex}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 w-full"
                    >
                      <Link href={link.href} className="w-full">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Wrapper>
      </Container>
      <Container>
        <Wrapper className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-foreground/10">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Nazeer · Neros Finance Application · MIT
          </p>
        </Wrapper>
      </Container>
    </footer>
  );
};

export default Footer;
