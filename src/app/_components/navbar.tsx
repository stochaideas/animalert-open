"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type JSX } from "react";
import { SVGAlert, SVGHeart, SVGPhone } from "~/components/icons";
import Hamburger from "~/components/icons/svgs/hamburger";
import { Button } from "~/components/ui/button";

const navItems: { title: string; href: string }[] = [
  { title: "Acasă", href: "/" },
  { title: "Acțiuni & Info", href: "/actiuni-info" },
  { title: "Despre noi", href: "/despre-noi" },
  { title: "Contact", href: "/contact" },
];
const actionItems: {
  title: string;
  href: string;
  variant: "neutral" | "primary" | "secondary" | "tertiary" | undefined;
  icon: JSX.Element;
}[] = [
  {
    title: "Donează",
    href: "/doneaza",
    variant: "neutral",
    icon: <SVGHeart />,
  },
  {
    title: "Raportează incident",
    href: "/raporteaza-incident",
    variant: "primary",
    icon: <SVGAlert />,
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="sticky top-0 z-20 flex w-full flex-col gap-0">
      <nav
        className={`${isOpen ? "h-screen" : "h-auto"} bg-secondary text-secondary-foreground sticky top-0 w-full p-[1.5rem] md:flex-row lg:px-[15.625rem] lg:py-[1.5rem]`}
      >
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-[0.75rem]">
            <Link href="/">
              <Image
                src="/logo/logo-white.png"
                alt="AnimAlert Logo"
                width={150}
                height={45}
              />
            </Link>
          </div>
          <Hamburger
            className="cursor-pointer md:hidden"
            data-collapse-toggle="navbar"
            type="button"
            aria-controls="navbar"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            width="40"
            height="40"
            isOpen={isOpen}
            toggleMenu={toggleMenu}
          />
          <ul className={"hidden items-center gap-[0.5rem] md:flex"}>
            {navItems.map((item) => (
              <li
                key={item.title}
                className="text-single-line-body-base px-[0.5rem]"
              >
                <Link href={item.href}>{item.title}</Link>
              </li>
            ))}
            {actionItems.map((item) => (
              <li key={item.title}>
                <Link href={item.href}>
                  <Button size="sm" variant={item.variant}>
                    {item.icon} {item.title}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <ul
          className={`${isOpen ? "flex" : "hidden"} h-11/12 flex-col items-center justify-between gap-[0.5rem] md:hidden`}
        >
          <div className="mt-[4rem] flex flex-col items-center gap-[0.5rem]">
            {navItems.map((item) => (
              <li
                key={item.title}
                className="text-single-line-body-base py-[0.5rem]"
              >
                <Link href={item.href}>{item.title}</Link>
              </li>
            ))}
          </div>
          <div className="flex flex-col items-center gap-[0.75rem]">
            {actionItems.map((item) => (
              <li key={item.title}>
                <Link href={item.href}>
                  <Button size="sm" variant={item.variant}>
                    {item.icon} {item.title}
                  </Button>
                </Link>
              </li>
            ))}
          </div>
        </ul>
      </nav>
      <section className="text-neutral-foreground w-full bg-[#ADABA8] py-[0.875rem]">
        <div className="m-auto w-max">
          <SVGPhone className="mr-[0.75rem] inline" width="20" height="20" />{" "}
          Sună imediat la <b>112</b>, dacă ești în pericol sau vezi un animal
          sălbatic rănit și nu îl poți duce la o clinică (ex: vulpe, căprior,
          mistreț, urs).
        </div>
      </section>
    </div>
  );
}
