import Link from "next/link";
import Image from "next/image";

export default function SponsorsHeader() {
  return (
    <section className="flex flex-col items-center justify-between bg-white px-6 py-2 lg:flex-row xl:px-32 xl:py-3 2xl:px-64">
      <div className="text-body-small text-center lg:max-w-[560px] lg:text-left">
        Proiect finanțat din programul „În ZONA TA”, implementat prin Platforma
        de Mediu la Cluj-Napoca de către{" "}
        <Link
          className="underline"
          href="https://www.facebook.com/FundatiaComunitaraCluj"
          target="_blank"
        >
          Fundația Comunitară Cluj
        </Link>{" "}
        și{" "}
        <Link
          className="underline"
          href="https://ing.ro/persoane-fizice"
          target="_blank"
        >
          ING Bank România
        </Link>
      </div>
      <Image
        alt="Sponsors"
        src="/images/about-us-sponsors.png"
        width="390"
        height="65"
      />
    </section>
  );
}
