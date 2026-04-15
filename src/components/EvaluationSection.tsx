import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface Evaluation {
  id: string;
  name: string;
  rating: number;
  date: string;
}

export const EvaluationSection = () => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    { id: '1', name: 'Ahmed', rating: 5, date: '2023-10-15' },
    { id: '2', name: 'Sarah', rating: 4, date: '2023-10-12' }
  ]);

  const averageRating = evaluations.length > 0 
    ? (evaluations.reduce((acc, curr) => acc + curr.rating, 0) / evaluations.length).toFixed(1)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || rating === 0) return;

    const newEval: Evaluation = {
      id: Date.now().toString(),
      name,
      rating,
      date: new Date().toISOString().split('T')[0]
    };

    setEvaluations([newEval, ...evaluations]);
    setName('');
    setRating(0);
  };

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Évaluations</h2>
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 fill-brand-accent text-brand-accent" />
          <span className="text-xl font-bold">{averageRating}/5</span>
          <span className="text-muted-foreground text-sm">({evaluations.length} avis)</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border p-6 rounded-2xl shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
          <input
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
            required
          />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none"
              >
                <Star 
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || rating) 
                      ? 'fill-brand-accent text-brand-accent' 
                      : 'text-muted-foreground'
                  }`} 
                />
              </button>
            ))}
            <span className="ml-2 font-medium text-lg w-8">{rating > 0 ? `${rating}/5` : ''}</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={!name || rating === 0}
          className="px-6 py-2 bg-brand-accent text-brand-primary font-bold rounded-lg hover:bg-brand-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Évaluer
        </button>
      </form>

      <div className="space-y-4">
        {evaluations.map((ev) => (
          <div key={ev.id} className="bg-muted/30 p-4 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{ev.name}</span>
              <span className="text-sm text-muted-foreground">{ev.date}</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`w-4 h-4 ${star <= ev.rating ? 'fill-brand-accent text-brand-accent' : 'text-muted-foreground/30'}`} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
