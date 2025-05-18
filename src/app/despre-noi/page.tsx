import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/simple/button";

const partner_cards = [
  {
    img: "/images/about-us-photo.png",
    alt: "Foto",
    title: "Foto",
    strong: "Lonay Arthur",
  },
  {
    img: "/images/about-us-uiux.png",
    alt: "Design UI/UX",
    title: "Design UI/UX",
    strong: "Iulia Beches",
  },
  // {
  //   img: "/images/image-placeholder.png",
  //   alt: "X",
  //   title: "X",
  //   strong: "X",
  // },
  // {
  //   img: "/images/image-placeholder.png",
  //   alt: "X",
  //   title: "X",
  //   strong: "X",
  // },
];

const media_cards = [
  {
    img: "/images/about-us-tvr.png",
    alt: "Publicație",
    title: "Publicație",
    date: "30 Aprilie 2025",
    body: "La Cluj urmeaza sa fie lansata o aplicație prin care poate fi semnalată prezența animalelor sălbatice. De la cele care ar putea crea probleme in oras, cele care pur si",
    button: "Vezi material",
    link: "https://www.facebook.com/watch/?v=494823710381045&rdid=epj1nxooXPsMoEwF",
  },
  {
    img: "/images/about-us-radio-romania-cluj.png",
    alt: "Radio Romania Cluj",
    title: "Radio Romania Cluj",
    date: "8 mai 2025",
    body: "România înăsprește sancțiunile pentru folosirea ilegală a petardelor.",
    button: "Vezi material",
    link: "https://www.radiocluj.ro/2025/05/08/romania-inaspreste-sanctiunile-pentru-folosirea-ilegala-a-petardelor/",
  },
  // {
  //   img: "/images/image-placeholder.png",
  //   alt: "Et imperdiet",
  //   title: "Et imperdiet",
  //   date: "30 Aprilie 2025",
  //   body: "Quis egestas mauris amet turpis odio sit neque at. Sed lobortis a ultrices mattis blandit faucibus mauris.",
  //   button: "Vezi material",
  //   link: "",
  // },
  // {
  //   img: "/images/image-placeholder.png",
  //   alt: "Et imperdiet",
  //   title: "Et imperdiet",
  //   date: "30 Aprilie 2025",
  //   body: "Quis egestas mauris amet turpis odio sit neque at. Sed lobortis a ultrices mattis blandit faucibus mauris.",
  //   button: "Vezi material",
  //   link: "",
  // },
];

export default function AboutPage() {
  return (
    <main className="bg-tertiary flex flex-col gap-24 px-6 pt-20 pb-40 2xl:px-96 2xl:pt-24 2xl:pb-52">
      <div className="flex flex-col gap-6">
        <section>
          <div className="mb-12">
            <h1 className="text-heading-1 mb-2 text-center">
              Partenerii noștri
            </h1>
            <h3 className="text-subheading text-center">
              AnimAlert nu ar fi fost posibilă fără finanțarea acordată de{" "}
              <strong>Fundația Comunitară Cluj</strong>, prin programul{" "}
              <strong>„În ZONA TA”</strong> al{" "}
              <strong>Platformei de Mediu</strong>, inițiativă a{" "}
              <strong>ING România</strong> și fără sprijinul partenerilor noștri
              dedicați.
              <br />
              Mulțumim celor care au contribuit pentru a crea și întreține
              această platformă!
            </h3>
          </div>
          <section>
            <Image
              alt="Sponsors"
              src="/images/about-us-sponsors.png"
              width="1420"
              height="200"
            />
          </section>
        </section>
        <section className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-14">
          <div className="flex flex-1 flex-col gap-8">
            <div>
              <h1 className="text-heading-1 mb-2">Despre AnimAlert</h1>
              <h3 className="text-subheading">
                De ce am creat AnimAlert și cu ce ajută comunitatea?
              </h3>
            </div>
            <div>
              <p className="text-body mb-2">
                <strong>
                  Organizației pentru Protecția Mediului și Combaterea
                  Braconajului
                </strong>
                , un ONG cu activitate preponderent în județul Cluj, care
                acționează în domeniul protectiei mediului. Suntem implicați
                constant în conștientizare, educare și activități pe teren, iar
                pe anumite teme si advocacy. Am avut un aport în câteva{" "}
                <strong>
                  schimbări legislative pe linia de bunăstare a animalelor
                </strong>
                , am participat la <strong>consultări publice</strong> și suntem
                în relație strânsă cu o parte din{" "}
                <strong>autoritățile locale și centrale</strong>, pe temele ce
                țin de combaterea poluării, a braconajului și a salvării de
                animale aflate în pericol.
              </p>
              <p className="text-body mb-2">
                Dorim sa construim un mic centru pentru animalele sălbatice care
                necesita ingrijire, dar și sa continuam programul de{" "}
                <strong>educație în școli</strong> privitor la fauna salbatica,
                poluare și aspecte de bunastare animala. Pe langa acestea,
                suntem momentan implicați într-un proiect de{" "}
                <strong>conștientizare și monitorizare</strong> care vizează
                reducerea poluării apelor.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/3] max-h-[420px] w-full lg:w-1/2">
            <Image
              alt="Despre noi"
              src="/images/image-placeholder.png"
              fill
              sizes="(max-width: 1280px) 100vw, 50vw"
              className="rounded-md object-cover"
              priority
            />
          </div>
        </section>

        <h3 className="text-heading-3">
          O scurtă prezentare a activității asociației în ultimii ani:
        </h3>

        <section className="flex flex-col">
          <span className="text-subheading">Suntem implicați constant în:</span>
          <ul className="list-disc pl-5">
            <li>CONȘTIENTIZARE</li>
            <li>EDUCARE</li>
            <li>ACTIVITĂȚI PE TEREN</li>
            <li>ADVOCACY (pe anumite teme)</li>
          </ul>
        </section>

        <section className="flex flex-col">
          <span className="text-subheading">
            Am avut un aport în câteva{" "}
            <strong>
              schimbări legislative pe linia de bunăstare a animalelor
            </strong>
            :
          </span>
          <span className="text-body">Suntem implicați constant în:</span>
          <ul className="list-disc pl-5">
            <li>
              Legea bunăstării animalelor (205/2004, modificata) - am obtinut{" "}
              <strong>mărirea pedepselor</strong>, norme mai stricte și condiții
              mai clare de deținere
            </li>
            <li>
              Legea materialelor pirotehnice (126/1995) -{" "}
              <strong>interzicerea comercializarii de petarde</strong> către
              publicul larg:{" "}
              <Link
                className="text-blue-500 underline"
                href="https://www.radiocluj.ro/2025/05/08/romania-inaspreste-sanctiunile-pentru-folosirea-ilegala-a-petardelor/"
                target="_blank"
              >
                România înăsprește sancțiunile pentru folosirea ilegală a
                petardelor - Radio Romania Cluj
              </Link>
            </li>
          </ul>
        </section>

        <section className="flex flex-col">
          <span className="text-subheading">
            Am participat la <strong>consultări publice</strong> și suntem în
            relație strânsă cu o parte din{" "}
            <strong>autoritățile locale și centrale</strong>, pe temele ce țin
            de:
          </span>
          <span className="text-body">Suntem implicați constant în:</span>
          <ul className="list-disc pl-5">
            <li>combaterea poluării</li>
            <li>combaterea braconajului</li>
            <li>salvarea animalelor aflate în pericol.</li>
          </ul>
        </section>

        <section className="flex flex-col">
          <span className="text-subheading">Dorim să:</span>
          <span className="text-body">Suntem implicați constant în:</span>
          <ul className="list-disc pl-5">
            <li>
              construim un mic centru de salvare și recuperare pentru animalele
              sălbatice care necesita îngrijiri
            </li>
            <li>
              să continuăm programul de educație în școli privitor la:
              <ul className="list-disc pl-5">
                <li>fauna sălbatică</li>
                <li>poluare</li>
                <li>aspecte de bunăstare animală. </li>
              </ul>
            </li>
          </ul>
        </section>

        <section>
          <span className="text-body">
            Pe lângă acestea, am fost implicați într-un proiect de{" "}
            <strong>conștientizare și monitorizare</strong> care vizează
            reducerea poluării apelor, în cadrul programului “Cu apele curate”.
          </span>
        </section>
      </div>

      <section className="flex flex-col gap-8 rounded-md bg-[#C4CEB3] p-8 md:items-end md:p-12 xl:flex-row-reverse xl:items-center xl:justify-between xl:gap-14 xl:px-24 xl:py-11">
        <div className="flex flex-1 flex-col text-right text-[#395A03] xl:order-1">
          <h1 className="text-heading-1 mb-2">AnimAlert</h1>
          <h3 className="text-subheading">
            Împreună protejăm și ajutăm fauna sălbatică
          </h3>
        </div>
        <div className="flex flex-1 items-center justify-between gap-6 xl:order-2 xl:gap-14">
          <div className="relative aspect-[180/72] w-1/3 max-w-[220px]">
            <Image
              alt="Lup"
              src="/images/wolf.svg"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 66px, (max-width: 1280px) 33vw, 220px"
              unoptimized
            />
          </div>
          <div className="relative aspect-[70/82] w-1/4 max-w-[90px]">
            <Image
              alt="Iepure"
              src="/images/bunny.svg"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 32px, (max-width: 1280px) 25vw, 90px"
              unoptimized
            />
          </div>
          <div className="relative aspect-[147/95] w-1/4 max-w-[110px]">
            <Image
              alt="Pasare"
              src="/images/bird.svg"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 56px, (max-width: 1280px) 25vw, 110px"
              unoptimized
            />
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
          {partner_cards.map((card, i) => (
            <div
              key={i}
              className="border-tertiary-border flex min-w-0 flex-col rounded-md border-[1px] bg-white p-8"
            >
              <Image
                src={card.img}
                alt={card.alt}
                width={272}
                height={160}
                className="h-auto w-full object-cover"
              />
              <h3 className="text-heading-3 mt-8 text-center">{card.title}</h3>
              <p className="text-body-strong mt-2 text-center">{card.strong}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-12">
          <h1 className="text-heading-1 mb-2 text-center">Aparitii publice</h1>
          <h3 className="text-subheading text-center">
            Mass-media, presa, social media
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
          {media_cards.map((card, i) => (
            <div
              key={i}
              className="border-tertiary-border flex min-w-0 flex-col justify-between rounded-md border-[1px] bg-white p-8"
            >
              <Image
                src={card.img}
                alt={card.alt}
                width={272}
                height={160}
                className="h-auto w-full object-cover"
              />
              <div>
                <h3 className="text-heading-3 mt-8">{card.title}</h3>
                <span className="text-body-small mt-2">{card.date}</span>
                <p className="text-body mt-2 line-clamp-3">{card.body}</p>
                <Link href={card.link} target="_blank">
                  <Button className="mt-8 w-full" variant="tertiary" size="md">
                    {card.button}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
