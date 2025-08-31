export function StatcastLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
    >
      <title>StatCast Insights Logo</title>
      <path d="M20 80H30V40H20V80Z" />
      <path d="M45 80H55V20H45V80Z" />
      <path d="M70 80H80V60H70V80Z" />
    </svg>
  );
}
