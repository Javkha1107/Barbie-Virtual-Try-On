export function StarDecoration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`star-decoration ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L14.09 8.26L20 10L14.09 11.74L12 18L9.91 11.74L4 10L9.91 8.26L12 2Z"
        fill="#FFB6D9"
        stroke="#FF69B4"
        strokeWidth="1"
      />
    </svg>
  );
}
