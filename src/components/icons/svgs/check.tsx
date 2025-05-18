import SVG from "~/lib/svg";
import type { SVGProps } from "~/lib/svg";

export default function SVGCheck(props: SVGProps) {
  return (
    <SVG {...props} viewBox="0 0 16 16">
      <path
        d="M13.3337 4L6.00033 11.3333L2.66699 8"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  );
}
