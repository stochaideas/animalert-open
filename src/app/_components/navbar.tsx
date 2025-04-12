"use client";

import { useState } from "react";
import { SVGLogo } from "~/components/icons";
import Hamburger from "~/components/icons/components/hamburger";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="bg-secondary text-secondary-foreground flex w-full flex-col items-center justify-between p-[1.5rem] md:flex-row lg:px-[15.625rem] lg:py-[1.5rem]">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-[0.75rem]">
          <SVGLogo width="44" height="44" />
          <span className="text-[1.25rem]">AnimAlert</span>
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
      </div>
      <ul
        className={`${isOpen ? "block" : "hidden"} flex w-full flex-col items-center gap-[0.5rem] transition-all transition-discrete duration-300 md:block md:w-auto md:flex-row`}
        id="navbar"
      >
        <li>
          <a href="#">Acasă</a>
        </li>
        <li>
          <a href="#">Acțiuni & Info</a>
        </li>
        <li>
          <a href="#">Despre noi</a>
        </li>
        <li>
          <a href="#">Contact</a>
        </li>
      </ul>
    </nav>
  );
}
