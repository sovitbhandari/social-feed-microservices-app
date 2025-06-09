import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Trash2,          // 🗑 delete-post icon
  Globe,
  Users,
  Lock
} from 'lucide-react';
import SocialCommentSection from './SocialCommentSection';

/* ───── helpers ───── */

const visibilityIcons = { public: Globe, friends: Users, private: Lock };

const formatTimestamp = (ts) => {
  const date = new Date(ts);
  const now  = new Date();
  const diff = Math.floor((now - date) / (1000 * 60)); // minutes
  if (diff < 1)       return 'Just now';
  if (diff < 60)      return `${diff}m ago`;
  if (diff < 60 * 24) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

/* ───── component ───── */

export default function SocialPostList({ posts, setPosts }) {
  const [postComments, setPostComments] = useState({}); // {postId: comments[]}

  /* seed comments whenever posts change */
  useEffect(() => {
    const initial = {};
    posts.forEach((p) => (initial[p.id] = p.comments || []));
    setPostComments(initial);
  }, [posts]);

  /* ─── Delete a post ─── */
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:4000/posts/${postId}`);
      // remove post + its local comments
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setPostComments(({ [postId]: _, ...rest }) => rest);
    } catch (err) {
      console.error('❌ Could not delete post:', err.message);
    }
  };

  /* ─── Add / delete comments ─── */
  const handleAddComment = async (postId, commentObj) => {
    try {
      await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
        content: commentObj.content
      });
      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), commentObj]
      }));
    } catch (err) {
      console.error('❌ Could not add comment:', err.message);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(
        `http://localhost:4001/posts/${postId}/comments/${commentId}`
      );
      setPostComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId)
      }));
    } catch (err) {
      console.error('❌ Could not delete comment:', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const VisibilityIcon = visibilityIcons[post.visibility];
        const comments       = postComments[post.id] || [];

        return (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  Y
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{post.author}</h3>
                  <p className="text-sm text-gray-500">
                    {formatTimestamp(post.timestamp)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {post.mood && (
                  <span className={`px-2 py-1 rounded-full text-xs ${post.mood.color}`}>
                    {post.mood.emoji}
                  </span>
                )}
                {VisibilityIcon && <VisibilityIcon className="w-4 h-4 text-gray-400" />}
                <button                          /* delete-post button */
                  onClick={() => handleDeletePost(post.id)}
                  className="text-gray-400 hover:text-red-600"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="mb-4">
              <p className="text-gray-800 leading-relaxed">{post.content}</p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-blue-600 text-sm hover:underline cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── Actions ── */}
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

            {/* ── Comments ── */}
            <SocialCommentSection
              postId={post.id}
              comments={comments}
              onAddComment={(c) => handleAddComment(post.id, c)}
              onDeleteComment={(cid) => handleDeleteComment(post.id, cid)}
            />
          </div>
        );
      })}
    </div>
  );
}
