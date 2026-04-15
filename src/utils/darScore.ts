export const calculateDarScore = (property: any): number => {
  let score = 0;
  
  // 1. Location Score (30pts)
  const premiumWilayas = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Bejaia', 'Blida', 'Tlemcen'];
  const location = property.location?.toLowerCase() || '';
  if (premiumWilayas.some(w => location.includes(w.toLowerCase()))) {
    score += 25;
  } else if (location.length > 0) {
    score += 15;
  }
  
  // 2. Price Score (30pts) - Mock logic
  // In a real app, this would compare against wilaya averages
  score += 20; 
  
  // 3. Listing Quality Score (20pts)
  let qualityScore = 0;
  const images = property.images || (property.image ? [property.image] : []);
  if (images.length >= 5) qualityScore += 10;
  else if (images.length > 0) qualityScore += 5;
  
  if (property.description && property.description.length > 200) qualityScore += 10;
  else if (property.description && property.description.length > 50) qualityScore += 5;
  
  score += qualityScore;
  
  // 4. Agent Score (20pts)
  if (property.agent?.verified) {
    score += 20;
  } else if (property.agent) {
    score += 10;
  } else {
    // Default for listings without specific agent data but are published
    score += 5;
  }
  
  return Math.min(100, Math.max(0, score));
};

export const getDarScoreColor = (score: number): string => {
  if (score >= 75) return 'bg-green-500 text-white';
  if (score >= 50) return 'bg-orange-500 text-white';
  return 'bg-red-500 text-white';
};
