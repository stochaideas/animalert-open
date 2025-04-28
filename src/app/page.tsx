import Image from "next/image";
import Link from "next/link";
import { SVGAlert, SVGPin } from "~/components/icons";
import { Button } from "~/components/ui/button";

const cards = [
  {
    img: "/images/homepage-card-1.png",
    alt: "Conflicte & Interacțiuni",
    title: "Conflicte & Interacțiuni",
    strong:
      "Ești deranjat de prezența unor animale pe care le consideri nedorite sau periculoase?",
    body: "Află cum să rămâi în siguranță tu și gospodăria ta, cum să ții la distanță „intrușii” eficient și etic și care sunt obligațiile tale.",
    href: "/recomandari",
    button: "Solicită recomandări",
  },
  {
    img: "/images/homepage-card-2.png",
    alt: "Sesizări & Legalitate",
    title: "Sesizări & Legalitate",
    strong:
      "Cunoști un caz de braconaj, maltratare sau de deținere ilegală a unui animal sălbatic? Ai observat vehicule motorizate într-o arie protejată sau într-un fond cinegetic?",
    body: "Raportează ilegalități aici.",
    href: "/sesizari",
    button: "Trimite sesizare",
  },
  {
    img: "/images/homepage-card-3.png",
    alt: "EduWild",
    title: "EduWild",
    strong:
      "Învață despre miracolul naturii în mod interactiv, la orice vârstă!",
    body: "Descoperă lumea animalelor, curiozități despre viața și mediul lor prin imagini fascinante, povești educative și activități distractive.",
    href: "/eduwild",
    button: "Explorează EduWild",
  },
  {
    img: "/images/homepage-card-4.png",
    alt: "Arii Naturale & Specii Protejate",
    title: "Arii Naturale & Specii Protejate",
    strong: "Ce obligații avem într-o arie naturală protejată?",
    body: "Informează-te despre zonele protejate, specii rare, cu statut special de protecție și de conservare.",
    href: "/zone-protejate",
    button: "Află mai multe",
  },
];

export default async function Home() {
  return (
    <main className="bg-tertiary flex flex-col items-center justify-center gap-[6.25rem] pb-[6.25rem]">
      <section className="h-[50rem] w-full bg-[url(/images/homepage-hero.png)] bg-[65%] bg-no-repeat lg:bg-center">
        <div className="flex flex-col items-start gap-[2rem] pt-28 pl-6 lg:pt-[10.25rem] lg:pl-[20.625rem]">
          <span className="text-heading-1 text-neutral lg:max-w-[40rem]">
            <b>Ai întâlnit un animal sălbatic rănit sau în pericol?</b>
          </span>
          <Link href="/raporteaza-incident">
            <Button
              size="lg"
              variant="primary"
              className="shadow-2xl shadow-black/60"
            >
              <SVGAlert /> Raportează incident
            </Button>
          </Link>
        </div>
      </section>
      <div className="container mx-auto px-8">
        <section className="border-tertiary-border mb-[6.25rem] flex flex-col items-center gap-[3rem] rounded-md border-[1px] border-solid bg-white p-[3rem] lg:flex-row">
          <video
            className="h-[300px] w-[600px] rounded-lg border border-gray-200 object-cover"
            controls={false}
            autoPlay={true}
            loop={true}
            muted={true}
          >
            <source src="/videos/homepage-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <article>
            <h2 className="text-heading-2">
              Observare Prezență Animale & Raportări
            </h2>
            <p className="text-subheading mt-2">
              Ai văzut un animal sălbatic, viu sau decedat? <br />
              Ai găsit urme, indicii sau alte semne ale prezenței lui?
            </p>
            <p className="text-body-small mt-6 text-[#3A3A3A]">
              Raportarea ta poate ajuta un animal aflat în pericol (rănit,
              bolnav, agresat) sau într-un mediu străin. Sprijină cercetarea
              științifică cu observațiile tale.
            </p>
            <Link href="/raporteaza-incident">
              <Button className="mt-[2rem]" variant="secondary" size="md">
                <SVGPin />
                Raportează prezență
              </Button>
            </Link>
          </article>
        </section>
        <section className="flex flex-col justify-between gap-6 lg:flex-row">
          {cards.map((card, i) => (
            <div
              key={i}
              className="border-tertiary-border flex min-w-0 flex-1 flex-col rounded-md border-[1px] bg-white p-[2rem]"
            >
              <Image src={card.img} alt={card.alt} width={272} height={160} />
              <h3 className="text-heading-3 mt-[2rem]">{card.title}</h3>
              <p className="text-body-strong mt-2">{card.strong}</p>
              <p className="text-body mt-4">{card.body}</p>
              <div className="mt-auto pt-[2rem]">
                <Link href={card.href}>
                  <Button variant="tertiary" size="md">
                    {card.button}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
