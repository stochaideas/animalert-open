"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, type JSX } from "react";
import {
  SVGAlert,
  SVGHeart,
  SVGMessageBubble,
  SVGPaperPage,
  SVGPhone,
  SVGPin,
  SVGVideoCamera,
  SVGStar,
} from "~/components/icons";
import Hamburger from "~/components/icons/svgs/hamburger";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";

const navItems: {
  title: string;
  href: string;
  content?: {
    title: string;
    href: string;
    description: string;
    icon: JSX.Element;
  }[];
}[] = [
  { title: "Acasă", href: "/" },
  {
    title: "Acțiuni & Info",
    href: "/actiuni-info",
    content: [
      {
        title: "Raportează prezență",
        href: "/raporteaza-prezenta",
        description: "Animal sălbatic viu/decedat",
        icon: <SVGPin />,
      },
      {
        title: "Conflicte & Interacțiuni",
        href: "/recomandari",
        description: "Info animal nedorit/periculos",
        icon: <SVGMessageBubble />,
      },
      {
        title: "Sesizări & Legalitate",
        href: "/sesizari",
        description: "Braconaj, ilegalități",
        icon: <SVGPaperPage />,
      },
      {
        title: "EduWild",
        href: "/eduwild",
        description: "Viața si lumea animalelor",
        icon: <SVGVideoCamera />,
      },
      {
        title: "Arii Naturale & Specii Protejate",
        href: "/zone-protejate",
        description: "Obligații, statut de protecție",
        icon: <SVGStar />,
      },
    ],
  },
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
        className={`${isOpen ? "h-screen" : "h-auto"} bg-secondary text-secondary-foreground sticky top-0 w-full p-6 md:flex-row lg:px-[15.625rem] lg:py-6`}
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3">
            <Link href="/">
              <Image
                src="/logo/logo-white.png"
                alt="AnimAlert Logo"
                width={150}
                height={45}
                className="max-w-[150px] min-w-[100px] lg:max-w-[150px] lg:min-w-[100px]"
              />
            </Link>
          </div>
          <Hamburger
            className="cursor-pointer lg:hidden"
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

          {/* LARGE SCREENS */}
          <NavigationMenu className={"hidden gap-2 lg:flex lg:items-center"}>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem
                  key={item.title}
                  className="text-single-line-body-base w-max px-4"
                >
                  {item.content ? (
                    <NavigationMenuTrigger
                      className={cn(
                        "hover:cursor-pointer",
                        navigationMenuTriggerStyle(),
                      )}
                    >
                      {item.title}
                    </NavigationMenuTrigger>
                  ) : (
                    <Link href={item.href} className="block w-full">
                      {item.title}
                    </Link>
                  )}
                  {item.content && (
                    <NavigationMenuContent className="bg-secondary text-secondary-foreground">
                      <ul className="flex w-[15rem] flex-col gap-2">
                        {item.content.map((contentItem) => (
                          <ListItem
                            className="hover:cursor-pointer"
                            key={contentItem.title}
                            title={contentItem.title}
                            href={contentItem.href}
                          >
                            {contentItem.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  )}
                </NavigationMenuItem>
              ))}
              {actionItems.map((item) => (
                <NavigationMenuItem key={item.title} className="px-2">
                  <Link href={item.href}>
                    <Button size="sm" variant={item.variant}>
                      {item.icon} {item.title}
                    </Button>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* SMALL AND MEDIUM SCREENS */}
        <NavigationMenu
          className={`${isOpen ? "flex" : "hidden"} h-11/12 flex-col items-start justify-between gap-2 lg:hidden`}
        >
          <NavigationMenuList className="mt-14 flex flex-col items-start gap-2">
            {navItems.map((item) => (
              <NavigationMenuItem
                key={item.title}
                className="text-single-line-body-base py-2"
              >
                <Link href={item.href}>{item.title}</Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
          <NavigationMenuList className="flex flex-col items-start gap-3">
            {actionItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <Link href={item.href}>
                  <Button size="xs" variant={item.variant}>
                    {item.icon}
                    <span className="text-single-line-body-base">
                      {item.title}
                    </span>
                  </Button>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <section className="text-neutral-foreground w-full bg-[#ADABA8] py-[0.875rem]">
        <div className="m-auto text-center">
          <SVGPhone className="mr-3 inline" width="20" height="20" /> Sună
          imediat la <b>112</b>, dacă ești în pericol sau vezi un animal
          sălbatic rănit și nu îl poți duce la o clinică (ex: vulpe, căprior,
          mistreț, urs).
        </div>
      </section>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-secondary-hover block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
            className,
          )}
          {...props}
        >
          <div className="text-single-line-body-base text-sm leading-none text-white">
            {title}
          </div>
          <p className="text-body-small text-tertiary-border line-clamp-2 leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
