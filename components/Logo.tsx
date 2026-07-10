export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="28.12,23 16,30 3.88,23 3.88,9 16,2 28.12,9"
        fill="#1a1a1a"
        stroke="#C9A84C"
        strokeWidth="1.5"
      />
      {/* Coluna esquerda */}
      <rect x="9" y="10" width="5" height="2" fill="#C9A84C" />
      <rect x="10" y="12" width="3" height="11" fill="#C9A84C" />
      <rect x="9" y="23" width="5" height="2" fill="#C9A84C" />
      {/* Coluna direita */}
      <rect x="18" y="10" width="5" height="2" fill="#C9A84C" />
      <rect x="19" y="12" width="3" height="11" fill="#C9A84C" />
      <rect x="18" y="23" width="5" height="2" fill="#C9A84C" />
      {/* Pedra-chave */}
      <path d="M16 6L13 10H19L16 6Z" fill="#C9A84C" />
    </svg>
  );
}
