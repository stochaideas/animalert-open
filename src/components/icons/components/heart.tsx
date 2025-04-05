import SVG from "~/lib/svg";
import type { SVGProps } from "~/lib/svg";

export default function SVGHeart(props: SVGProps) {
  return (
    <SVG {...props} viewBox="0 0 16 16">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props.strokeWidth ?? "1.6"}
        d="M13.893 3.073a3.667 3.667 0 0 0-5.186 0L8 3.78l-.707-.707A3.668 3.668 0 0 0 2.107 8.26L8 14.153l5.893-5.893a3.667 3.667 0 0 0 0-5.187"
      ></path>
    </SVG>
  );
}
