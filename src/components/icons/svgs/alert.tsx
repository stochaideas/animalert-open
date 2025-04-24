import SVG from "~/lib/svg";
import type { SVGProps } from "~/lib/svg";

export default function SVGAlert(props: SVGProps) {
  return (
    <SVG {...props} viewBox="0 0 16 16">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props.strokeWidth ?? "1.6"}
        d="M8 6v2.667m0 2.666h.007M6.86 2.573 1.213 12a1.333 1.333 0 0 0 1.14 2h11.294a1.332 1.332 0 0 0 1.14-2L9.14 2.573a1.333 1.333 0 0 0-2.28 0"
      ></path>
    </SVG>
  );
}
