const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60));
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

export default function CommentList({ comments }) {
  return (
    <ul className="mt-4 space-y-3">
      {comments.map((comment) => (
        <li key={comment.id} className="bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-700">{comment.author}</span>
            <span className="text-xs text-gray-400">{formatTimestamp(comment.timestamp)}</span>
          </div>
          <p className="text-sm text-gray-800">{comment.content}</p>
        </li>
      ))}
    </ul>
  );
}
