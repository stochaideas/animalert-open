"use client";

import { Roboto } from "next/font/google";
import { useState } from "react";
import { SVGAlert, SVGHeart, SVGLogo } from "~/components/icons";
import Hamburger from "~/components/icons/components/hamburger";
import { Button } from "~/components/ui/button";

// TODO: Refactor and fix typescript warnings
// TODO: Change links hrefs; change from a to next Link

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["900"],
});

const navItems = [
  { title: "Acasă", href: "#" },
  { title: "Acțiuni & Info", href: "#" },
  { title: "Despre noi", href: "#" },
  { title: "Contact", href: "#" },
];
const actionItems = [
  { title: "Donează", href: "#", variant: "neutral", icon: <SVGHeart /> },
  {
    title: "Raportează incident",
    href: "#",
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
    <nav
      className={`${isOpen ? "h-screen" : "h-auto"} bg-secondary text-secondary-foreground sticky top-0 w-full p-[1.5rem] md:flex-row lg:px-[15.625rem] lg:py-[1.5rem]`}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-[0.75rem]">
          <a href="#">
            <SVGLogo width="44" height="44" />
          </a>
          <a href="#">
            <span className={`${roboto.className} text-[1.25rem]`}>
              AnimAlert
            </span>
          </a>
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
              <a href={item.href}>{item.title}</a>
            </li>
          ))}
          {actionItems.map((item) => (
            <li key={item.title}>
              <a href={item.href}>
                <Button size="sm" variant={item.variant}>
                  {item.icon} {item.title}
                </Button>
              </a>
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
              <a href={item.href}>{item.title}</a>
            </li>
          ))}
        </div>
        <div className="flex flex-col items-center gap-[0.75rem]">
          {actionItems.map((item) => (
            <li key={item.title}>
              <a href={item.href}>
                <Button size="sm" variant={item.variant}>
                  {item.icon} {item.title}
                </Button>
              </a>
            </li>
          ))}
        </div>
      </ul>
    </nav>
  );
}
