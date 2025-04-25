import SVG from "~/lib/svg";
import type { SVGProps } from "~/lib/svg";

export default function SVGVideoCamera(props: SVGProps) {
  return (
    <SVG {...props} viewBox="0 0 20 20">
      <g clipPath="url(#clip0_9768_68)">
        <path
          d="M19.1667 5.83335L13.3334 10L19.1667 14.1667V5.83335Z"
          fill="transparent"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.6667 4.16669H2.50004C1.57957 4.16669 0.833374 4.91288 0.833374 5.83335V14.1667C0.833374 15.0872 1.57957 15.8334 2.50004 15.8334H11.6667C12.5872 15.8334 13.3334 15.0872 13.3334 14.1667V5.83335C13.3334 4.91288 12.5872 4.16669 11.6667 4.16669Z"
          fill="transparent"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_9768_68">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </SVG>
  );
}
