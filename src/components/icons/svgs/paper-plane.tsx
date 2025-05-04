import SVG from "~/lib/svg";
import type { SVGProps } from "~/lib/svg";

export default function SVGPaperPlane(props: SVGProps) {
  return (
    <SVG {...props} viewBox="0 0 16 16">
      <g clipPath="url(#clip0_9832_1737)">
        <path
          d="M14.6668 1.44531L7.3335 8.77865M14.6668 1.44531L10.0002 14.7786L7.3335 8.77865M14.6668 1.44531L1.3335 6.11198L7.3335 8.77865"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_9832_1737">
          <rect width="16" height="16" transform="translate(0 0.113281)" />
        </clipPath>
      </defs>
    </SVG>
  );
}
