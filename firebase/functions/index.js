/**
 * Firebase Cloud Functions (Serverless Backend)
 * --------------------------------------------
 *
 * What are Firebase Functions?
 * - Small pieces of backend code that run on Firebase's infrastructure.
 * - You can expose them as HTTP endpoints (URLs) like a normal API.
 *
 * What does "serverless" mean?
 * - It does NOT mean "no servers exist".
 * - It means YOU do not manage servers manually (no VPS, no Nginx, no PM2).
 * - Firebase runs your code when it is needed and scales it automatically.
 *
 * How does the frontend call Functions?
 * - The React app uses fetch() to call a URL like:
 *   GET https://...cloudfunctions.net/api/getPosts
 * - This file handles those routes and reads/writes Firestore.
 *
 * How does Firestore store data?
 * - Firestore is a NoSQL database.
 * - Data is organized in Collections and Documents.
 * - In this project we use a collection named: "posts"
 */

import { onRequest } from "firebase-functions/v2/https";
import admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import express from "express";
import cors from "cors";

// Admin SDK allows this backend to securely talk to Firestore.
// In production, Firebase automatically provides credentials.
admin.initializeApp();

const db = admin.firestore();
const POSTS_COLLECTION = "posts";

const app = express();

// CORS is needed because your React app runs on a different domain/port in development.
// This allows the browser to call this API.
app.use(cors({ origin: true }));

// Parse JSON bodies for POST/PUT requests.
app.use(express.json());

// Helper: convert Firestore Timestamp -> ISO string
function timestampToIso(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate().toISOString();
  return null;
}

/**
 * GET /getPosts
 * Returns all posts (newest first).
 */
app.get("/getPosts", async (req, res) => {
  try {
    const snap = await db
      .collection(POSTS_COLLECTION)
      .orderBy("createdAt", "desc")
      .get();

    const posts = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        content: data.content || "",
        author: data.author || "",
        createdAt: timestampToIso(data.createdAt),
      };
    });

    return res.json({ posts });
  } catch (err) {
    console.error("GET /getPosts failed:", err);
    return res.status(500).json({ error: "Failed to fetch posts." });
  }
});

/**
 * GET /getPostById?id=POST_ID
 */
app.get("/getPostById", async (req, res) => {
  try {
    const postId = req.query.id;
    if (!postId) return res.status(400).json({ error: "Missing ?id=POST_ID" });

    const ref = db.collection(POSTS_COLLECTION).doc(String(postId));
    const doc = await ref.get();

    if (!doc.exists) return res.status(404).json({ error: "Post not found." });

    const data = doc.data();
    return res.json({
      post: {
        id: doc.id,
        title: data.title || "",
        content: data.content || "",
        author: data.author || "",
        createdAt: timestampToIso(data.createdAt),
      },
    });
  } catch (err) {
    console.error("GET /getPostById failed:", err);
    return res.status(500).json({ error: "Failed to fetch post." });
  }
});

/**
 * POST /createPost
 * Body JSON: { title, content, author }
 */
app.post("/createPost", async (req, res) => {
  try {
    const { title, content, author } = req.body || {};

    // Very simple validation (beginner-friendly).
    if (!title || !content || !author) {
      return res.status(400).json({
        error: "Missing fields. Required: title, content, author",
      });
    }

    const ref = await db.collection(POSTS_COLLECTION).add({
      title: String(title),
      content: String(content),
      author: String(author),
      // Use serverTimestamp so the backend (not the browser) sets the time.
      // This is a common Firestore pattern.
      createdAt: FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ id: ref.id });
  } catch (err) {
    console.error("POST /createPost failed:", err);
    return res.status(500).json({ error: "Failed to create post." });
  }
});

/**
 * PUT /updatePost?id=POST_ID
 * Body JSON: { title, content, author }
 */
app.put("/updatePost", async (req, res) => {
  try {
    const postId = req.query.id;
    if (!postId) return res.status(400).json({ error: "Missing ?id=POST_ID" });

    const { title, content, author } = req.body || {};
    if (!title || !content || !author) {
      return res.status(400).json({
        error: "Missing fields. Required: title, content, author",
      });
    }

    const ref = db.collection(POSTS_COLLECTION).doc(String(postId));
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: "Post not found." });

    await ref.update({
      title: String(title),
      content: String(content),
      author: String(author),
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("PUT /updatePost failed:", err);
    return res.status(500).json({ error: "Failed to update post." });
  }
});

/**
 * DELETE /deletePost?id=POST_ID
 */
app.delete("/deletePost", async (req, res) => {
  try {
    const postId = req.query.id;
    if (!postId) return res.status(400).json({ error: "Missing ?id=POST_ID" });

    const ref = db.collection(POSTS_COLLECTION).doc(String(postId));
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: "Post not found." });

    await ref.delete();
    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /deletePost failed:", err);
    return res.status(500).json({ error: "Failed to delete post." });
  }
});

/**
 * Export ONE HTTPS function that contains our Express app.
 *
 * Your final URLs will look like:
 *   https://<region>-<projectId>.cloudfunctions.net/api/getPosts
 */
export const api = onRequest(app);



