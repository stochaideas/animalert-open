import type { MouseEventHandler } from "react";
import type { SVGProps } from "~/lib/svg";
import SVG from "~/lib/svg";

interface HamburgerProps extends SVGProps {
  isOpen: boolean;
  toggleMenu: MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function SVGHamburger(props: HamburgerProps) {
  const { isOpen, toggleMenu, ...svgProps } = props;

  return (
    <button onClick={toggleMenu} className="flex items-center justify-center">
      <SVG {...svgProps} viewBox="0 0 24 24">
        <rect
          className={`origin-[7px] ${isOpen ? "rotate-45" : ""} fill-current transition-transform duration-300`}
          x="4"
          rx="1"
          y="6"
          ry="1"
          width="16"
          height="2"
        ></rect>
        <rect
          className={`${isOpen ? "w-0" : ""} fill-current transition-all duration-150`}
          x="4"
          rx="1"
          y="11"
          ry="1"
          width="16"
          height="2"
        ></rect>
        <rect
          className={`origin-[7px] ${isOpen ? "-rotate-45" : ""} fill-current transition-transform duration-300`}
          x="4"
          rx="1"
          y="16"
          ry="1"
          width="16"
          height="2"
        ></rect>
      </SVG>
    </button>
  );
}
