import * as React from "react";

const SVGAlert: React.FC<React.SVGProps<SVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width ?? "16"}
    height={props.height ?? "16"}
    fill="none"
    viewBox={`0 0 ${props.width ?? "16"} ${props.height ?? "16"}`}
    className={props.className}
  >
    <path
      stroke={props.stroke ?? "#1C1C1C"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props.strokeWidth ?? "1.6"}
      d="M8 6v2.667m0 2.666h.007M6.86 2.573 1.213 12a1.333 1.333 0 0 0 1.14 2h11.294a1.332 1.332 0 0 0 1.14-2L9.14 2.573a1.333 1.333 0 0 0-2.28 0"
    ></path>
  </svg>
);

export default SVGAlert;
