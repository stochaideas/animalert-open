"use client";

import Image from "next/image";
import Link from "next/link";
import { SVGAlert, SVGPin } from "~/components/icons";
import { Button } from "~/components/ui/simple/button";
import { useState, useEffect } from "react";

const cards = [
  {
    img: "/images/homepage-card-1.png",
    alt: "Conflicte & Interacțiuni",
    title: "Conflicte & Interacțiuni",
    strong:
      "Ești deranjat de prezența unor animale pe care le consideri nedorite sau periculoase?",
    body: "Află cum să rămâi în siguranță tu și gospodăria ta, cum să ții la distanță „intrușii” eficient și etic și care sunt obligațiile tale.",
    href: "/conflicte",
    button: "Solicită recomandări",
    disabled: false,
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
    disabled: false, 
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
    disabled: true, // TODO: temporary, remove when ready
  },
  {
    img: "/images/homepage-card-4.png",
    alt: "Arii Naturale & Specii Protejate",
    title: "Arii Naturale & Specii Protejate",
    strong: "Ce obligații avem într-o arie naturală protejată?",
    body: "Informează-te despre zonele protejate, specii rare, cu statut special de protecție și de conservare.",
    href: "/zone-protejate",
    button: "Află mai multe",
    disabled: true, // TODO: temporary, remove when ready
  },
];

export default function Home() {
  const [isShrinking, setIsShrinking] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      const timer = setTimeout(() => {
        setIsShrinking(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 1000); // Match the duration of the height transition
      }, 30000); // 30 seconds
      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <main className="bg-tertiary flex flex-col items-center justify-center gap-24 pb-24">
      <section className="h-[50rem] w-full bg-[url(/images/homepage-hero-sm.png)] bg-cover bg-[65%] bg-no-repeat md:bg-[url(/images/homepage-hero-lg.png)] md:bg-center">
        {isVisible && (
          <section
            className={`text-neutral-foreground text-body bg-primary m-auto mt-6 w-[85%] self-center overflow-hidden rounded-md px-3 py-1.5 transition-all duration-1000 md:px-6 md:py-3.5 ${
              isShrinking
                ? "mt-0 max-h-0 py-0 opacity-0"
                : "max-h-[500px] opacity-50"
            }`}
          >
            <div className="m-auto text-center select-none">
              <strong>
                Platforma se află în continuă dezvoltare, iar dacă observați
                erori sau probleme, vă rugăm să le raportați în
                <br />
                <Link className="text-blue-700 underline" href="/contact">
                  <Button variant="secondary">Formularul de Contact</Button>
                </Link>
              </strong>
            </div>
          </section>
        )}
        <div className="flex flex-col items-start gap-8 p-6 md:px-20 md:pt-32 xl:pt-40 xl:pl-80">
          <span className="text-heading-1 text-neutral lg:max-w-2xl">
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
      <div className="container mx-auto px-8 lg:px-0">
        <section className="border-tertiary-border mb-24 flex flex-col items-center gap-12 rounded-md border-[1px] border-solid bg-white p-12 lg:flex-row">
          <div className="relative h-[220px] w-[266px] flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-black sm:h-[250px] sm:w-[350px] md:h-[300px] md:w-[400px] lg:h-[300px] lg:w-[600px]">
            <video
              className="h-full w-full object-cover"
              controls={false}
              autoPlay
              loop
              muted
              playsInline
              webkit-playsinline="true"
            >
              <source src="/videos/homepage-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
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
            <Link href="/raporteaza-prezenta">
              <Button className="mt-8" variant="secondary" size="md">
                <SVGPin />
                Raportează prezență
              </Button>
            </Link>
          </article>
        </section>
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, i) => (
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
              <h3 className="text-heading-3 mt-8">{card.title}</h3>
              <p className="text-body-strong mt-2">{card.strong}</p>
              <p className="text-body mt-4">{card.body}</p>
              {card.disabled ? (
                <div className="mt-auto pt-8">
                  <Button variant="tertiary" size="md">
                    Modul în lucru...
                  </Button>
                </div>
              ) : (
                <div className="mt-auto pt-8">
                  <Link href={card.href}>
                    <Button variant="tertiary" size="md">
                      {card.button}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
