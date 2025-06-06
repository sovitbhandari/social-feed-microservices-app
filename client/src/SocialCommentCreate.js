import { useState } from 'react';
import { Smile } from 'lucide-react';

export default function CommentCreate({ onAddComment }) {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onAddComment({
      id: Date.now(),
      content: comment,
      author: 'You',
      timestamp: new Date().toISOString()
    });

    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center space-x-2">
        <Smile className="w-5 h-5 text-purple-400" />
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 p-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm hover:from-purple-600 hover:to-indigo-600 transition-all"
        >
          Post
        </button>
      </div>
    </form>
  );
}
