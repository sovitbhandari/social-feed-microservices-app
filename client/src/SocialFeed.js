import { useState } from 'react';
import SocialPostCreate from './SocialPostCreate';
import SocialPostList from './SocialPostList';

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);

  const handleNewPost = (post) => {
    setPosts([post, ...posts]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto p-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Share</span>
            <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Space</span>
          </h1>
          <p className="text-gray-600">Express yourself uniquely</p>
        </div>
        <SocialPostCreate onPost={handleNewPost} />
        <SocialPostList posts={posts} setPosts={setPosts} />
      </div>
    </div>
  );
}
