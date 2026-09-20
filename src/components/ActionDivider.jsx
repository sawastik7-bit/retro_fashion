export default function ActionDivider({ className = '' }) {
  return (
    <div className={`action-divider my-0 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 40"
        className="w-full h-[30px]"
        preserveAspectRatio="none"
      >
        <path
          d="M0,20 L20,5 L40,25 L60,2 L80,22 L100,8 L120,28 L140,3 L160,20 L180,6 L200,24 L220,2 L240,22 L260,8 L280,26 L300,4 L320,20 L340,6 L360,24 L380,2 L400,22 L420,8 L440,28 L460,3 L480,20 L500,6 L520,24 L540,2 L560,22 L580,8 L600,26 L620,4 L640,20 L660,6 L680,24 L700,2 L720,22 L740,8 L760,28 L780,3 L800,20 L820,6 L840,24 L860,2 L880,22 L900,8 L920,26 L940,4 L960,20 L980,6 L1000,24 L1020,2 L1040,22 L1060,8 L1080,28 L1100,3 L1120,20 L1140,6 L1160,24 L1180,2 L1200,20"
          fill="none"
          stroke="#0a0a0a"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M0,22 L30,12 L60,28 L90,8 L120,26 L150,10 L180,24 L210,6 L240,22 L270,12 L300,28 L330,8 L360,24 L390,10 L420,26 L450,6 L480,22 L510,12 L540,28 L570,8 L600,24 L630,10 L660,26 L690,6 L720,22 L750,12 L780,28 L810,8 L840,24 L870,10 L900,26 L930,6 L960,22 L990,12 L1020,28 L1050,8 L1080,24 L1110,10 L1140,26 L1170,6 L1200,22"
          fill="none"
          stroke="#ff2d6b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="8 12"
        />
        <circle cx="600" cy="20" r="4" fill="#ffd600" className="ink-pulse" />
      </svg>
    </div>
  );
}
