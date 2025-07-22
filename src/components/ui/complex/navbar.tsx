"use client";

// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, type JSX } from "react";

import {
  SVGAlert,
  SVGHeart,
  SVGMessageBubble,
  SVGPhone,
  SVGPin,
} from "~/components/icons";
import Hamburger from "~/components/icons/svgs/hamburger";
import { Button } from "~/components/ui/simple/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/simple/navigation-menu";

import { cn } from "~/lib/utils";
// import AuthButton from "./auth-button";

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
        href: "/conflicte",
        description: "Info animal nedorit/periculos",
        icon: <SVGMessageBubble />,
      },
      // {
      //   title: "Sesizări & Legalitate",
      //   href: "/sesizari",
      //   description: "Braconaj, ilegalități",
      //   icon: <SVGPaperPage />,
      // },
      // {
      //   title: "EduWild",
      //   href: "/eduwild",
      //   description: "Viața si lumea animalelor",
      //   icon: <SVGVideoCamera />,
      // },
      // {
      //   title: "Arii Naturale & Specii Protejate",
      //   href: "/zone-protejate",
      //   description: "Obligații, statut de protecție",
      //   icon: <SVGStar />,
      // },
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
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isAlertAnimating, setIsAlertAnimating] = useState(false);
  const [menuContentOpen, setMenuContentOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    window.scrollTo({
      top: 0,
    });
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isSmallScreen = window.innerWidth < 1024; // or your breakpoint
    let timeoutId: NodeJS.Timeout;
    if (isSmallScreen && showAlert) {
      timeoutId = setTimeout(() => {
        setIsAlertAnimating(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 1000); // Match the duration of the transition
      }, 10000); // 10 seconds (or 30000 for 30 seconds)
    }
    return () => clearTimeout(timeoutId);
  }, [showAlert]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="sticky top-0 z-20 flex w-full flex-col gap-0">
      <nav
        className={`${isOpen ? "h-screen" : "h-auto"} bg-secondary text-secondary-foreground sticky top-0 w-full p-6 sm:p-4 md:p-6 xl:px-32 2xl:px-64`}
      >
        <div className="container mx-auto flex flex-row items-center justify-between gap-6">
          <div className="flex flex-row items-center gap-3">
            <Link href="/">
              <Image
                src="/logo/logo-white.png"
                alt="AnimAlert Logo"
                className="h-full w-auto max-w-none object-cover"
                width={150}
                height={45}
                loading="eager"
              />
            </Link>
          </div>
          <Hamburger
            className="cursor-pointer 2xl:hidden"
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
          <NavigationMenu className={"hidden gap-2 2xl:flex 2xl:items-center"}>
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
                      <ul className="flex w-60 flex-col gap-2">
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
              {/* <AuthButton /> */}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* SMALL AND MEDIUM SCREENS */}
        <NavigationMenu
          className={`${isOpen ? "flex" : "hidden"} h-11/12 flex-col items-start justify-between gap-2 2xl:hidden`}
        >
          <NavigationMenuList className="mt-14 flex flex-col items-start gap-2">
            {navItems.map((item) =>
              item.content ? (
                <NavigationMenuItem
                  key={item.title}
                  className="text-single-line-body-base py-2"
                  onClick={() => setMenuContentOpen(!menuContentOpen)}
                >
                  {item.title}
                  {menuContentOpen && (
                    <NavigationMenuTrigger className="bg-secondary text-secondary-foreground h-full w-full flex-col items-start">
                      {item.content.map((contentItem) => (
                        <ListItem
                          className="align-items-start flex flex-col text-left hover:cursor-pointer"
                          key={contentItem.title}
                          title={contentItem.title}
                          href={contentItem.href}
                        >
                          {contentItem.description}
                        </ListItem>
                      ))}
                    </NavigationMenuTrigger>
                  )}
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem
                  key={item.title}
                  className="text-single-line-body-base py-2"
                >
                  <Link href={item.href}>{item.title}</Link>
                </NavigationMenuItem>
              ),
            )}
            {/* <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn> */}
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
      {showAlert && (
        <section
          className={`text-neutral-foreground text-body-small w-full overflow-hidden bg-[#ADABA8] px-3 py-1.5 transition-all duration-1000 md:px-6 md:py-3.5 ${
            isAlertAnimating
              ? "mt-0 max-h-0 py-0 opacity-0"
              : "max-h-[100px] opacity-100"
          }`}
        >
          <div className="m-auto text-center">
            <SVGPhone className="mr-3 inline" width="20" height="20" /> Apelează 
            în paralel și <b>112</b>, dacă te afli în pericol sau dacă observi 
            un animal rănit de talie mai mare (căprior, cerb, vulpe, lup, urs),
            din considerente legale.
          </div>
        </section>
      )}
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
