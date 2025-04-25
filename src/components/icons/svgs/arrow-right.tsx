import SVG from "~/lib/svg";
import type { SVGProps } from "~/lib/svg";

export default function SVGArrowRight(props: SVGProps) {
  return (
    <SVG {...props} viewBox="0 0 16 16">
      <path
        d="M3.33325 7.99967H12.6666M12.6666 7.99967L7.99992 3.33301M12.6666 7.99967L7.99992 12.6663"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  );
}
