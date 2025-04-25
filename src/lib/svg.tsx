export interface SVGProps extends React.SVGProps<SVGSVGElement> {
  width?: string;
  height?: string;
  strokeWidth?: string;
  className?: string;
  viewBox?: string;
}

// This component is used to create a reusable SVG component with default properties
export default function SVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ?? "16"}
      height={props.height ?? "16"}
      viewBox={props.viewBox ?? "0 0 16 16"}
      strokeWidth="0"
      className={`${props.className} fill-transparent stroke-current`}
    >
      {props.children}
    </svg>
  );
}
