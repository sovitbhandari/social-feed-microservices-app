import { useState, useEffect } from 'react';
import axios from 'axios';
import SocialPostCreate from './SocialPostCreate';
import SocialPostList from './SocialPostList';

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);

  // initial load from Query service
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get('http://localhost:4002/posts');
        // Query service returns an object keyed by id → convert to array
        const fetched = Object.values(res.data).map((p) => ({
          id: p.id,
          content: p.title,
          author: 'You',                       // placeholder
          timestamp: new Date().toISOString(),  // no timestamp on backend
          mood: null,
          visibility: 'public',
          tags: [],
          likes: 0,
          shares: 0,
          comments: p.comments?.map((c) => ({
            id: c.id,
            content: c.content,
            status: c.status,
            author: 'You',
            timestamp: new Date().toISOString()
          })) || []
        }));
        setPosts(fetched.reverse());
      } catch (err) {
        console.error('Could not load posts:', err.message);
      }
    };
    getPosts();
  }, []);

  const handleNewPost = (post) => setPosts([post, ...posts]);

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
