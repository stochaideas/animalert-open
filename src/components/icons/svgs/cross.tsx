import SVG from "~/lib/svg";
import type { SVGProps } from "~/lib/svg";

export default function SVGCross(props: SVGProps) {
  return (
    <SVG {...props} viewBox="0 0 32 32">
      <path
        d="M24 8L8 24M8 8L24 24"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  );
}
