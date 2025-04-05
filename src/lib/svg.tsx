export interface SVGProps extends React.SVGProps<SVGSVGElement> {
  width?: string;
  height?: string;
  strokeWidth?: string;
  className?: string;
}

// This component is used to create a reusable SVG component with default properties
const SVG: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ?? "16"}
      height={props.height ?? "16"}
      fill="none"
      viewBox={`0 0 ${props.width ?? "16"} ${props.height ?? "16"}`}
      className={`${props.className} stroke-current`}
    >
      {props.children}
    </svg>
  );
};
export default SVG;
