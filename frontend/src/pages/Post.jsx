/**
 * Post Details Page
 * -----------------
 * Shows one post based on the URL parameter :id.
 *
 * Router basics:
 * - useParams() reads the route parameters.
 *   Example URL: /post/abc123  -> params.id === "abc123"
 */

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPostById } from "../api";
import PostComponent from "../components/post";

export default function Post() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getPostById(id);
      setPost(data.post);
    } catch (e) {
      setError(e.message || "Failed to load post.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  return (
    <div className="grid">
      <div className="card">
        <div className="btnRow">
          <Link to="/">← Back</Link>
          <Link to="/admin">Admin</Link>
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

      {!loading && !error && post && (
       <PostComponent post={post} showReadMore={false} />
      )}
    </div>
  );
}


