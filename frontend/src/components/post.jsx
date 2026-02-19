// this is a component that displays a single post
// it is used in the Post component
// it can be also used in the Home component
import { Link } from 'react-router-dom'

function preview(text, maxLength = 100) {
    const t = String(text || "");
    if(t.length <= maxLength) return t;
    return t.substring(0, maxLength) + "...";
  }
export default function PostComponent({ post, showReadMore = true }) {
  return  <div key={post.id} className="card">
  <h2 style={{ margin: "0 0 6px" }}>
    <Link to={`/post/${post.id}`}>{post.title}</Link>
  </h2>
  <div className="muted" style={{ fontSize: 14 }}>
    {post.author || "Unknown"} •{" "}
    {post.createdAt ? new Date(post.createdAt).toLocaleString() : "No date"}
  </div>
  <p style={{ marginTop: 10 }}>{showReadMore ? preview(post.content) : post.content}</p>
  {showReadMore && <Link to={`/post/${post.id}`}>Read more</Link>}
</div>
}