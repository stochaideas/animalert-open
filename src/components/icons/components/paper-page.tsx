import SVG from "~/lib/svg";
import type { SVGProps } from "~/lib/svg";

export default function SVGPaperPage(props: SVGProps) {
  return (
    <SVG {...props} viewBox="0 0 20 20">
      <path
        d="M11.6667 1.66669H5.00004C4.55801 1.66669 4.13409 1.84228 3.82153 2.15484C3.50897 2.4674 3.33337 2.89133 3.33337 3.33335V16.6667C3.33337 17.1087 3.50897 17.5326 3.82153 17.8452C4.13409 18.1578 4.55801 18.3334 5.00004 18.3334H15C15.4421 18.3334 15.866 18.1578 16.1786 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66669M11.6667 1.66669L16.6667 6.66669M11.6667 1.66669L11.6667 6.66669H16.6667M13.3334 10.8334H6.66671M13.3334 14.1667H6.66671M8.33337 7.50002H6.66671"
        fill="transparent"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  );
}
