import { Roboto } from "next/font/google";
import {
  SVGFacebook,
  SVGInstagram,
  SVGLogo,
  SVGYoutube,
} from "~/components/icons";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["900"],
});

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground w-full px-[15.625rem] py-[3rem]">
      <div className="flex flex-col items-start justify-center gap-[2rem]">
        <div className="flex w-full flex-row items-start justify-between gap-[2rem]">
          <section className="flex flex-col gap-[1.5rem]">
            <div className="flex flex-row items-center justify-center gap-[0.75rem]">
              <SVGLogo width="44" height="44" />
              <span
                className={`${roboto.className} mr-[0.75rem] text-[1.25rem]`}
              >
                AnimAlert
              </span>
            </div>
            <div className="flex flex-row gap-[1rem]">
              <SVGInstagram width="32" height="32" />
              <SVGFacebook width="32" height="32" />
              <SVGYoutube width="32" height="32" />
            </div>
          </section>
          <section className="flex flex-col gap-[0.75rem]">
            <h3 className="text-body-strong mb-[1rem]">Contact</h3>
            <span className="text-single-line-body-base">Adresa</span>
            <span className="text-single-line-body-base">
              Cluj-Napoca, România
            </span>
            <span className="text-single-line-body-base">Email</span>
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
            <span className="text-single-line-body-base">x</span>
          </section>
        </div>
        <span className="w-full text-center">
          © 2024 AnimAlert. Toate drepturile rezervate.
        </span>
      </div>
    </footer>
  );
}
