export function RibbonDecoration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 5L22 15H28L23 19L25 29L20 24L15 29L17 19L12 15H18L20 5Z"
        fill="#DDA0DD"
        stroke="#FF69B4"
        strokeWidth="1.5"
      />
      <path
        d="M20 24L18 35M20 24L22 35"
        stroke="#FF69B4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
