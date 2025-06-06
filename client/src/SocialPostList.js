import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Globe, Users, Lock } from 'lucide-react';
import SocialCommentSection from './SocialCommentSection';

const visibilityIcons = {
  public: Globe,
  friends: Users,
  private: Lock
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60));
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

export default function SocialPostList({ posts }) {
  const [postComments, setPostComments] = useState({}); // {postId: [comments]}

  const handleAddComment = (postId, comment) => {
    setPostComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment]
    }));
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const VisibilityIcon = visibilityIcons[post.visibility];
        const comments = postComments[post.id] || [];

        return (
          <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  Y
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{post.author}</h3>
                  <p className="text-sm text-gray-500">{formatTimestamp(post.timestamp)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {post.mood && (
                  <span className={`px-2 py-1 rounded-full text-xs ${post.mood.color}`}>
                    {post.mood.emoji}
                  </span>
                )}
                {VisibilityIcon && <VisibilityIcon className="w-4 h-4 text-gray-400" />}
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-gray-800 leading-relaxed">{post.content}</p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-blue-600 text-sm hover:underline cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500">
                  <Heart className="w-5 h-5" /> <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
                  <MessageCircle className="w-5 h-5" /> <span>{comments.length}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500">
                  <Share2 className="w-5 h-5" /> <span>{post.shares}</span>
                </button>
              </div>
              <button className="text-gray-600 hover:text-purple-500">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>

            {/* Comment Section */}
            <SocialCommentSection
              comments={comments}
              onAddComment={(comment) => handleAddComment(post.id, comment)}
            />
          </div>
        );
      })}
    </div>
  );
}
