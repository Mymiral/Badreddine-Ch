import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface Comment {
  id: string;
  name: string;
  text: string;
  date: string;
}

export const CommentsSection = () => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', name: 'Karim', text: 'Très bel appartement, bien situé.', date: '2023-10-14' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      name,
      text,
      date: new Date().toISOString().split('T')[0]
    };

    setComments([newComment, ...comments]);
    setName('');
    setText('');
  };

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-brand-accent" /> Commentaires
      </h2>

      <form onSubmit={handleSubmit} className="bg-card border border-border p-6 rounded-2xl shadow-sm mb-8 space-y-4">
        <input
          type="text"
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all"
          required
        />
        <textarea
          placeholder="Votre commentaire..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-accent transition-all resize-none"
          required
        />
        <button
          type="submit"
          disabled={!name || !text}
          className="px-6 py-2 bg-brand-accent text-brand-primary font-bold rounded-lg hover:bg-brand-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Commenter
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-muted/30 p-4 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{comment.name}</span>
              <span className="text-sm text-muted-foreground">{comment.date}</span>
            </div>
            <p className="text-muted-foreground">{comment.text}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-muted-foreground text-center py-4">Aucun commentaire pour le moment. Soyez le premier !</p>
        )}
      </div>
    </section>
  );
};
