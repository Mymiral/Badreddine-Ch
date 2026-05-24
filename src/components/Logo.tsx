import React from 'react';

export default function Logo({ className = 'h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 220" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cyan-blue" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#02C3D7" />
          <stop offset="100%" stopColor="#3559CF" />
        </linearGradient>
        
        <linearGradient id="blue-purple" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3559CF" />
          <stop offset="100%" stopColor="#9524AC" />
        </linearGradient>
        
        <linearGradient id="text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#02C3D7" />
          <stop offset="45%" stopColor="#3559CF" />
          <stop offset="100%" stopColor="#9524AC" />
        </linearGradient>

        <clipPath id="roof-clip">
          <rect x="0" y="0" width="500" height="113" />
        </clipPath>

        <mask id="roof-mask">
          <rect width="100%" height="100%" fill="white" />
          <path d="M 110 125 L 215 20 L 320 125" stroke="black" strokeWidth="36" strokeLinejoin="miter" strokeMiterlimit="4" fill="none" />
        </mask>
      </defs>

      <g clipPath="url(#roof-clip)">
        <path 
          mask="url(#roof-mask)" 
          d="M 170 140 L 275 35 L 380 140" 
          stroke="url(#blue-purple)" 
          strokeWidth="22" 
          strokeLinejoin="miter" 
          strokeMiterlimit="4" 
        />
        
        <path 
          d="M 110 125 L 215 20 L 320 125" 
          stroke="url(#cyan-blue)" 
          strokeWidth="22" 
          strokeLinejoin="miter" 
          strokeMiterlimit="4" 
        />
        
        <line 
          x1="160" y1="35" 
          x2="160" y2="78" 
          stroke="url(#cyan-blue)" 
          strokeWidth="16" 
          strokeLinecap="butt"
        />
      </g>

      <g>
        <rect x="199" y="80" width="11" height="11" fill="#0CBDD7" />
        <rect x="215" y="80" width="11" height="11" fill="#1A8ADF" />
        <rect x="199" y="96" width="11" height="11" fill="#0CBDD7" />
        <rect x="215" y="96" width="11" height="11" fill="#1A8ADF" />
      </g>

      <text x="245" y="175" textAnchor="middle" fill="url(#text-grad)">
        <tspan 
          fontFamily="'Century Gothic', 'Montserrat', 'Proxima Nova', system-ui, sans-serif" 
          fontSize="58" 
          fontWeight="500" 
          letterSpacing="-1.5"
        >
          Darlink
        </tspan>
        <tspan 
          fontFamily="'Century Gothic', 'Montserrat', 'Proxima Nova', system-ui, sans-serif" 
          fontSize="60" 
          fontWeight="300" 
          fontStyle="italic" 
          letterSpacing="-0.5"
        >
          {" DZ"}
        </tspan>
      </text>
    </svg>
  );
}
