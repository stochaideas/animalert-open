export interface SVGProps extends React.SVGProps<SVGSVGElement> {
  width?: string;
  height?: string;
  strokeWidth?: string;
  className?: string;
  viewBox?: string;
  filled?: boolean;
}

// This component is used to create a reusable SVG component with default properties
export default function SVG(props: SVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ?? "16"}
      height={props.height ?? "16"}
      viewBox={props.viewBox ?? "0 0 16 16"}
      strokeWidth="0"
      className={`${props.className} ${props.filled ? "fill-current" : "fill-transparent"} stroke-current`}
    >
      {props.children}
    </svg>
  );
}
