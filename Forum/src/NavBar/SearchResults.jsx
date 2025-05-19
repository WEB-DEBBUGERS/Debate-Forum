import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllPosts } from "../services/posts.service";
import PostList from "../views/Posts/Components Post/PostList";
import Navbar from "./Navbar";

export default function SearchResults() {
  const location = useLocation();
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(true);

  // Get query from URL
  const query =
    new URLSearchParams(location.search).get("query")?.toLowerCase() || "";

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const allPosts = await getAllPosts();
      setPosts(allPosts);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  // Filter posts by title
  const filteredPosts = query
    ? Object.fromEntries(
        Object.entries(posts).filter(([, post]) =>
          post.title?.toLowerCase().includes(query)
        )
      )
    : posts;

  return (
    <>
      <Navbar />
      <div
        className="all-posts-bg"
        style={{ minHeight: "100vh", paddingTop: 32 }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ color: "#00e6ff", marginBottom: 24 }}>
            Search Results{query ? ` for "${query}"` : ""}
          </h2>
          {loading ? (
            <div style={{ color: "#e3e8ef" }}>Loading...</div>
          ) : Object.keys(filteredPosts).length === 0 ? (
            <div style={{ color: "#e3e8ef" }}>No posts found.</div>
          ) : (
            <PostList posts={filteredPosts} />
          )}
        </div>
      </div>
    </>
  );
}
