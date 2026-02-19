/**
 * API helper (frontend)
 * --------------------
 *
 * The frontend does NOT talk to Firestore directly.
 * Instead, it calls Firebase Functions (serverless endpoints) using fetch().
 *
 * Why?
 * - This keeps your database logic in one place (the backend).
 * - In real apps, this is where you'd also enforce security and validation.
 */

// Vite exposes env via import.meta.env; only VITE_* variables are available.
// Example (local emulator): VITE_FUNCTIONS_BASE_URL=http://127.0.0.1:5001/<projectId>/us-central1/api
const BASE_URL =
  import.meta.env.VITE_FUNCTIONS_BASE_URL ||
  "http://127.0.0.1:5001/blog-cms-f0ed2/us-central1/api";

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  // Only set Content-Type when there's a body (avoids CORS preflight for GET).
  const hasBody = options.body !== undefined;
  const headers = hasBody
    ? { "Content-Type": "application/json", ...(options.headers || {}) }
    : { ...(options.headers || {}) };

  const res = await fetch(url, { headers, ...options });

  // Read response body (usually JSON).
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.error || `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export function getPosts() {
  return request("/getPosts");
}

export function getPostById(id) {
  const qs = new URLSearchParams({ id }).toString();
  return request(`/getPostById?${qs}`);
}

export function createPost(post) {
  return request("/createPost", {
    method: "POST",
    body: JSON.stringify(post),
  });
}

export function updatePost(id, post) {
  const qs = new URLSearchParams({ id }).toString();
  return request(`/updatePost?${qs}`, {
    method: "PUT",
    body: JSON.stringify(post),
  });
}

export function deletePost(id) {
  const qs = new URLSearchParams({ id }).toString();
  return request(`/deletePost?${qs}`, {
    method: "DELETE",
  });
}


