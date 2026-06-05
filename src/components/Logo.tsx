import React from 'react';

export default function Logo({ className = 'h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 720 340" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cyan-blue" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#02C3D7" />
          <stop offset="100%" stopColor="#1E88E5" />
        </linearGradient>
        
        <linearGradient id="blue-purple" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E88E5" />
          <stop offset="100%" stopColor="#9524AC" />
        </linearGradient>
        
        <linearGradient id="text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#02C3D7" />
          <stop offset="45%" stopColor="#1E88E5" />
          <stop offset="100%" stopColor="#9524AC" />
        </linearGradient>
      </defs>

      {/* Right Roof (Background) - Blue to Purple Gradient */}
      <path 
        d="M 270 210 L 420 60 L 570 210 L 542 210 L 420 88 L 298 210 Z" 
        fill="url(#blue-purple)" 
      />

      {/* Left Roof (Foreground with Chimney) - Cyan to Blue Gradient */}
      <path 
        d="M 150 210 L 205 155 L 205 95 L 230 95 L 230 130 L 300 60 L 450 210 L 422 210 L 300 88 L 178 210 Z" 
        fill="url(#cyan-blue)" 
      />

      {/* Window 4 panes (2x2 Grid) */}
      <g fill="url(#cyan-blue)">
        {/* Top-Left Pane */}
        <rect x="282" y="105" width="16" height="16" rx="2" />
        {/* Top-Right Pane */}
        <rect x="302" y="105" width="16" height="16" rx="2" />
        {/* Bottom-Left Pane */}
        <rect x="282" y="127" width="16" height="16" rx="2" />
        {/* Bottom-Right Pane */}
        <rect x="302" y="127" width="16" height="16" rx="2" />
      </g>

      {/* Logo Typography: Darlink DZ */}
      <text x="360" y="295" textAnchor="middle">
        <tspan 
          fill="url(#cyan-blue)"
          fontFamily="'Century Gothic', 'Montserrat', 'Proxima Nova', system-ui, sans-serif" 
          fontSize="72" 
          fontWeight="500" 
          letterSpacing="-1.5"
        >
          Darlink
        </tspan>
        <tspan 
          fill="url(#blue-purple)"
          fontFamily="'Century Gothic', 'Montserrat', 'Proxima Nova', 'Helvetica Neue', system-ui, sans-serif" 
          fontSize="72" 
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
