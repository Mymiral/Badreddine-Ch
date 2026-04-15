import React from 'react';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import { calculateDarScore, getDarScoreColor } from '@/utils/darScore';

export const DarScoreBadge = ({ property }: { property: any }) => {
  const score = calculateDarScore(property);
  const colorClass = getDarScoreColor(score);
  
  let Icon = Shield;
  if (score >= 75) Icon = ShieldCheck;
  else if (score < 50) Icon = ShieldAlert;

  return (
    <div 
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-sm ${colorClass}`} 
      title={`Dar Score: ${score}/100 (Basé sur l'emplacement, le prix, la qualité et l'agent)`}
    >
      <Icon className="w-3 h-3" />
      <span>{score}</span>
    </div>
  );
};
