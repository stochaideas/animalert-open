import Image from "next/image";
import Link from "next/link";
import {
  SVGFacebook,
  SVGFacebookFilled,
  SVGInstagram,
  SVGInstagramFilled,
  SVGYoutube,
  SVGYoutubeFilled,
} from "~/components/icons";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground w-full p-[2rem] lg:px-[15.625rem] lg:py-[3rem]">
      <div className="flex flex-col items-start justify-center gap-[3.75rem] lg:gap-[2rem]">
        <div className="flex w-full flex-col items-start justify-between gap-[3.75rem] lg:flex-row lg:gap-[2rem]">
          <section className="flex w-full flex-row items-center justify-between gap-[1.5rem] sm:w-auto lg:flex-col lg:items-start">
            <Image
              src="/logo/logo-white.png"
              alt="AnimAlert Logo"
              width={150}
              height={45}
            />
            <div className="flex flex-row gap-[0.5rem]">
              <Link
                href="https://www.instagram.com/opmcb.cluj/"
                target="_blank"
              >
                <SVGInstagram
                  className="hidden sm:inline"
                  width="32"
                  height="32"
                />
              </Link>
              <Link
                href="https://www.instagram.com/opmcb.cluj/"
                target="_blank"
              >
                <SVGInstagramFilled
                  className="sm:hidden"
                  width="32"
                  height="32"
                />
              </Link>
              <Link
                href="https://www.facebook.com/antibraconaj.cluj/"
                target="_blank"
              >
                <SVGFacebook
                  className="hidden sm:inline"
                  width="32"
                  height="32"
                />
              </Link>
              <Link
                href="https://www.facebook.com/antibraconaj.cluj/"
                target="_blank"
              >
                <SVGFacebookFilled
                  className="sm:hidden"
                  width="32"
                  height="32"
                />
              </Link>
              <Link
                href="https://www.youtube.com/@ProtectiaMediuluiAntibraconaj"
                target="_blank"
              >
                <SVGYoutube
                  className="hidden sm:inline lg:hidden"
                  width="32"
                  height="32"
                />
              </Link>
              <Link
                href="https://www.youtube.com/@ProtectiaMediuluiAntibraconaj"
                target="_blank"
              >
                <SVGYoutubeFilled
                  className="sm:hidden"
                  width="32"
                  height="32"
                />
              </Link>
            </div>
          </section>
          <section className="flex flex-col gap-[0.75rem]">
            <h3 className="text-body-strong mb-[1rem]">Contact</h3>
            <span className="text-single-line-body-base">
              Adresa: Cluj-Napoca, România
            </span>
            <span className="text-single-line-body-base">
              <Link href="mailto:ancbp.cluj@gmail.com">
                ancbp.cluj@gmail.com
              </Link>
            </span>
          </section>
          <section className="flex flex-col gap-[0.75rem]">
            <h3 className="text-body-strong mb-[1rem]">
              Termeni legali și Politici
            </h3>
            <span className="text-single-line-body-base">
              Politica de confidențialitate
            </span>
            <span className="text-single-line-body-base">
              Politica de cookies
            </span>
            <span className="text-single-line-body-base">
              Termeni și condiții
            </span>
          </section>
          <section className="flex flex-col gap-[0.75rem]">
            <h3 className="text-body-strong mb-[1rem]">Parteneri</h3>
            <span className="text-single-line-body-base">
              Foto: © Lonay Arthur
            </span>
            <span className="text-single-line-body-base">
              Ilustrații: © Katerina Limpitsouni
            </span>
          </section>
        </div>
        <span className="text-body-small flex w-full flex-col items-start lg:flex-row lg:justify-center lg:gap-[0.5rem] lg:text-center">
          <span>© 2024 AnimAlert.</span>
          <span>Toate drepturile rezervate.</span>
        </span>
      </div>
    </footer>
  );
}
