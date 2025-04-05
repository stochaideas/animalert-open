import SVG from "~/lib/svg";
import type { SVGProps } from "~/lib/svg";

export default function SVGLogo(props: SVGProps) {
  return (
    <SVG {...props} viewBox="0 0 44 44">
      <path
        d="M0.5 22C0.5 10.1259 10.1259 0.5 22 0.5C33.8741 0.5 43.5 10.1259 43.5 22C43.5 33.8741 33.8741 43.5 22 43.5C10.1259 43.5 0.5 33.8741 0.5 22Z"
        fill="#F5F5F5"
      />
      <path
        d="M0.5 22C0.5 10.1259 10.1259 0.5 22 0.5C33.8741 0.5 43.5 10.1259 43.5 22C43.5 33.8741 33.8741 43.5 22 43.5C10.1259 43.5 0.5 33.8741 0.5 22Z"
        stroke="#D9D9D9"
        strokeLinecap="round"
      />
    </SVG>
  );
}
