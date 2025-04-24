import SVG from "~/lib/svg";
import type { SVGProps } from "~/lib/svg";

export default function SVGStar(props: SVGProps) {
  return (
    <SVG {...props} viewBox="0 0 20 20">
      <path
        d="M9.99996 1.66663L12.575 6.88329L18.3333 7.72496L14.1666 11.7833L15.15 17.5166L9.99996 14.8083L4.84996 17.5166L5.83329 11.7833L1.66663 7.72496L7.42496 6.88329L9.99996 1.66663Z"
        fill="transparent"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  );
}
