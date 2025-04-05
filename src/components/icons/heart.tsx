import * as React from "react";

const SVGHeart: React.FC<React.SVGProps<SVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ?? "16"}
      height={props.height ?? "16"}
      fill="none"
      viewBox={`0 0 ${props.width ?? "16"} ${props.height ?? "16"}`}
      className={props.className}
    >
      <path
        stroke={props.stroke ?? "#1E1E1E"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props.strokeWidth ?? "1.6"}
        d="M13.893 3.073a3.667 3.667 0 0 0-5.186 0L8 3.78l-.707-.707A3.668 3.668 0 0 0 2.107 8.26L8 14.153l5.893-5.893a3.667 3.667 0 0 0 0-5.187"
      ></path>
    </svg>
  );
};

export default SVGHeart;
