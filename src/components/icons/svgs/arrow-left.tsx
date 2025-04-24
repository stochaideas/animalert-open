import SVG from "~/lib/svg";
import type { SVGProps } from "~/lib/svg";

export default function SVGArrowLeft(props: SVGProps) {
  return (
    <SVG {...props} viewBox="0 0 16 16">
      <path
        d="M12.6668 7.99967H3.3335M3.3335 7.99967L8.00016 12.6663M3.3335 7.99967L8.00016 3.33301"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  );
}
