import { useState } from 'react';
import axios from 'axios';
import { Image, Video, Smile, Hash, Sparkles, Globe, Users, Lock } from 'lucide-react';

const moods = [
  { emoji: '😊', name: 'Happy',    color: 'bg-yellow-100 text-yellow-800' },
  { emoji: '😢', name: 'Sad',      color: 'bg-blue-100 text-blue-800' },
  { emoji: '😡', name: 'Angry',    color: 'bg-red-100 text-red-800' },
  { emoji: '🤔', name: 'Thoughtful', color: 'bg-purple-100 text-purple-800' },
  { emoji: '🎉', name: 'Excited',  color: 'bg-pink-100 text-pink-800' },
  { emoji: '😴', name: 'Tired',    color: 'bg-gray-100 text-gray-800' },
  { emoji: '🔥', name: 'Motivated', color: 'bg-orange-100 text-orange-800' },
  { emoji: '💭', name: 'Dreamy',   color: 'bg-indigo-100 text-indigo-800' }
];

const visibilityOptions = [
  { id: 'public',  label: 'Public',  icon: Globe  },
  { id: 'friends', label: 'Friends', icon: Users  },
  { id: 'private', label: 'Private', icon: Lock   }
];

export default function SocialPostCreate({ onPost }) {
  const [currentPost, setCurrentPost] = useState({
    content: '',
    mood: null,
    visibility: 'public',
    tags: [],
    media: []
  });
  const [tagInput, setTagInput] = useState('');
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  /* ────────────────────────── helpers ────────────────────────── */

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !currentPost.tags.includes(tag)) {
      setCurrentPost({ ...currentPost, tags: [...currentPost.tags, tag] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setCurrentPost({
      ...currentPost,
      tags: currentPost.tags.filter((t) => t !== tagToRemove)
    });
  };

  /* ───────────────────── create post (backend) ───────────────── */

  const handlePostSubmit = async () => {
    if (!currentPost.content.trim()) return;

    try {
      // Send only what the Posts microservice needs
      const res = await axios.post('http://localhost:4000/posts', {
        title: currentPost.content
      });

      // Build the full object for the UI
      const newPost = {
        id: res.data.id,
        content: res.data.title,
        timestamp: new Date().toISOString(),
        author: 'You',
        likes: 0,
        shares: 0,
        tags: currentPost.tags,
        mood: currentPost.mood,
        visibility: currentPost.visibility,
        comments: []
      };

      onPost(newPost); // lift to parent
      // reset form
      setCurrentPost({ content: '', mood: null, visibility: 'public', tags: [], media: [] });
      setTagInput('');
    } catch (err) {
      console.error('❌ Could not create post:', err.message);
    }
  };

  /* ─────────────────────────── UI ─────────────────────────── */

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
      <div className="space-y-4">
        {/* mood & visibility row */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setShowMoodSelector(!showMoodSelector)}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm">
                {currentPost.mood
                  ? `${currentPost.mood.emoji} ${currentPost.mood.name}`
                  : 'Add mood'}
              </span>
            </button>

            {showMoodSelector && (
              <div className="absolute top-12 left-0 bg-white rounded-xl shadow-lg p-3 grid grid-cols-4 gap-2 z-10">
                {moods.map((mood) => (
                  <button
                    key={mood.name}
                    onClick={() => {
                      setCurrentPost({ ...currentPost, mood });
                      setShowMoodSelector(false);
                    }}
                    className="flex flex-col items-center p-2 hover:bg-gray-50"
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            value={currentPost.visibility}
            onChange={(e) => setCurrentPost({ ...currentPost, visibility: e.target.value })}
            className="px-3 py-2 bg-gray-100 rounded-full text-sm"
          >
            {visibilityOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* post textarea */}
        <textarea
          value={currentPost.content}
          onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
          placeholder="What's on your mind?"
          className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none"
        />

        {/* tag input */}
        <div className="flex items-center space-x-2">
          <Hash className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
            placeholder="Add tags..."
            className="flex-1 p-2 text-sm border border-gray-200 rounded-lg"
          />
          <button
            onClick={addTag}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm"
          >
            Add
          </button>
        </div>

        {/* tag pills */}
        {currentPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {currentPost.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                #{tag}
                <button onClick={() => removeTag(tag)} className="ml-2 text-blue-600">×</button>
              </span>
            ))}
          </div>
        )}

        {/* footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
              <Image className="w-4 h-4" /> <span>Photo</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
              <Video className="w-4 h-4" /> <span>Video</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
              <Smile className="w-4 h-4" /> <span>GIF</span>
            </button>
          </div>
          <button
            onClick={handlePostSubmit}
            disabled={!currentPost.content.trim()}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
