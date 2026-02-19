import React from 'react'
import { useState, useEffect } from 'react'
import { getPosts } from '../api'
import { Link } from 'react-router-dom'
import PostComponent from '../components/post'


export default function Home() {
const [loading, setLoading] = useState(false)
const [posts, setPosts] = useState([])
const [error, setError] = useState(null)

async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getPosts();
      setPosts(data.posts || []);
      console.log(data.posts);
    } catch (e) {
      setError(e.message || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);
  return (
    <div className='grid'>
      <div className="card">
        <h1 className="title">Blog Posts</h1>
        <p className="muted">
          This page calls a Firebase Function (serverless) to fetch posts.
        </p>
        <div className="btnRow">
          <button onClick={load} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div className="card">
          <p>Loading…</p>
        </div>
      )}
    {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

     {!loading && !error && posts.length === 0 && (
        <div className="card">
        <p className="muted">No posts yet. Add one from the Admin page.</p>
        <Link to="/admin">Go to Admin</Link>
      </div>
     )} 


{!loading &&
        !error &&
        posts.map((post) => (
         <PostComponent key={post.id} post={post} />
        ))}
       

    </div>
  )
}