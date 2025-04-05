import SVG from "~/lib/svg";
import type { SVGProps } from "~/lib/svg";

export default function SVGPin(props: SVGProps) {
  return (
    <SVG {...props}>
      <g
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
        clipPath="url(#clip0_437_943)"
      >
        <path d="M14 6.667c0 4.666-6 8.666-6 8.666s-6-4-6-8.666a6 6 0 1 1 12 0"></path>
        <path d="M8 8.667a2 2 0 1 0 0-4 2 2 0 0 0 0 4"></path>
      </g>
      <defs>
        <clipPath id="clip0_437_943">
          <path fill="#fff" d="M0 0h16v16H0z"></path>
        </clipPath>
      </defs>
    </SVG>
  );
}
