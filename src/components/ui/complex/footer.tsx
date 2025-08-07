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
    <footer className="bg-secondary text-secondary-foreground mx-auto w-full p-6 sm:p-4 md:p-6 lg:py-12 xl:px-32 2xl:px-64">
      <div className="flex flex-col gap-6">
        <section>
          <Image
            alt="Sponsors"
            src="/images/about-us-sponsors.png"
            width="1420"
            height="200"
          />
        </section>
        <span className="font-poppins text-center text-[1.25rem] md:text-[1.5rem] md:leading-[1.6] md:font-medium">
          <strong>
            🐢 🐣
            <br className="sm:hidden" />
            <em className="sm:mx-6">
              Biodiversitate urbană și conviețuire armonioasă
            </em>
            <br className="sm:hidden" />
            🐻 🐍 🦊
          </strong>
        </span>
        <section className="mt-6 md:mt-0">
          <span className="font-poppins text-[1rem] md:text-[1.125rem] md:leading-[1.6] md:font-medium">
            Proiect finanțat din programul „În ZONA TA”, implementat prin
            Platforma de Mediu la Cluj-Napoca de către{" "}
            <Link
              className="text-primary underline"
              href="https://www.facebook.com/FundatiaComunitaraCluj"
              target="_blank"
            >
              Fundația Comunitară Cluj
            </Link>{" "}
            și{" "}
            <Link
              className="text-primary underline"
              href="https://ing.ro/persoane-fizice"
              target="_blank"
            >
              ING Bank România
            </Link>
          </span>
        </section>
      </div>

      <div className="container mx-auto flex flex-col items-start justify-center gap-14 md:mt-12 lg:gap-8">
        <div className="flex w-full flex-col items-start justify-between gap-14 lg:flex-row lg:gap-8">
          <section className="flex w-full flex-row items-center justify-between gap-6 sm:w-auto lg:flex-col lg:items-start">
            {/* Logo section for mobile view */}
            <div className="mt-12 flex flex-row gap-2 sm:hidden">
              <Link
                href="https://www.instagram.com/opmcb.cluj/"
                target="_blank"
              >
                <SVGInstagramFilled width="32" height="32" />
              </Link>

              <Link
                href="https://www.facebook.com/antibraconaj.cluj/"
                target="_blank"
              >
                <SVGFacebookFilled width="32" height="32" />
              </Link>

              <Link
                href="https://www.youtube.com/@ProtectiaMediuluiAntibraconaj"
                target="_blank"
              >
                <SVGYoutubeFilled width="32" height="32" />
              </Link>
            </div>

            {/* Logo section md and above */}
            <div className="hidden flex-row gap-2 sm:flex">
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
                href="https://www.youtube.com/@ProtectiaMediuluiAntibraconaj"
                target="_blank"
              >
                <SVGYoutube
                  className="hidden sm:inline"
                  width="32"
                  height="32"
                />
              </Link>
            </div>
          </section>
          <section className="flex flex-col gap-3">
            <h3 className="text-heading-3 mb-4">Contact</h3>
            <span className="text-single-line-body-base">
              <strong>Adresa</strong>: Cluj-Napoca, România
            </span>
            <span className="text-single-line-body-base">
              <strong>Email</strong>:{" "}
              <Link
                className="text-primary underline"
                href="mailto:ancbp.cluj@gmail.com"
              >
                ancbp.cluj@gmail.com
              </Link>
            </span>
          </section>
          <section className="flex flex-col gap-3">
            <h3 className="text-heading-3 mb-4">Termeni legali și Politici</h3>
            <span className="text-single-line-body-base">
              <Link
                href="/politica-confidentialitate"
                className="hover:underline"
              >
                Politica de confidențialitate
              </Link>
            </span>
            <span className="text-single-line-body-base">
              <Link href="/cookies" className="hover:underline">
                Politica de cookies
              </Link>
            </span>
            <span className="text-single-line-body-base">
              <Link href="/termeni-si-conditii" className="hover:underline">
                Termeni și condiții
              </Link>
            </span>
          </section>
          <section className="flex flex-col gap-3">
            <h3 className="text-heading-3 mb-4">Parteneri</h3>
            <span className="text-single-line-body-base">
              <strong>Foto</strong>: © Lonay Arthur
            </span>
            <span className="text-single-line-body-base">
              <strong>Ilustrații</strong>: © Katerina Limpitsouni
            </span>
          </section>
        </div>

        <div className="font-poppins container mx-auto mt-8 pt-6 text-center text-[1.25rem]">
          <span>
            Organizația pentru Protecția Mediului și Combaterea Braconajului
          </span>
        </div>

        <span className="text-body-small w-full items-start text-center lg:flex-row lg:justify-center lg:gap-2">
          <span>© 2025 AnimAlert. Toate drepturile rezervate.</span>
        </span>
      </div>
    </footer>
  );
}
