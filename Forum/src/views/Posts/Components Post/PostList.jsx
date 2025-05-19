import { Box, Text, Heading } from "@chakra-ui/react";
import Comments from "../../Comments/Comments";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../../state/app.context";
import {
  likeOrDislikePost,
  updatePost,
  deletePost,
} from "../../../services/posts.service";
import { toggleFavoritePost, getUserFavorites } from '../../../services/users.service';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function PostList({ posts, showOnlyFavorites, onFavoritesChanged }) {
  const { user, userData } = useContext(AppContext);
  const [visibleComments, setVisibleComments] = useState({});
  const [voted, setVoted] = useState({});
  const [postState, setPostState] = useState(posts);
  const [editMode, setEditMode] = useState({});
  const [editData, setEditData] = useState({});
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setPostState(posts);
  }, [posts]);

  useEffect(() => {
    async function fetchFavorites() {
      if (user) {
        const favs = await getUserFavorites(user.uid);
        setFavorites(favs || []);
      }
    }
    fetchFavorites();
  }, [user, posts]);

  const handleVote = async (postId, type) => {
    setPostState((prev) => {
      const updated = { ...prev };
      const post = { ...updated[postId] };
      const userId = user.uid;
      post.likes = Array.isArray(post.likes)
        ? post.likes.filter((id) => id !== userId)
        : [];
      post.dislikes = Array.isArray(post.dislikes)
        ? post.dislikes.filter((id) => id !== userId)
        : [];
      if (type === "like") {
        post.likes.push(userId);
      } else if (type === "dislike") {
        post.dislikes.push(userId);
      }
      updated[postId] = post;
      return updated;
    });
    await likeOrDislikePost(postId, user.uid, type);
    setVoted((prev) => ({ ...prev, [postId]: true }));
  };

  const handleEditToggle = (postId, post) => {
    setEditMode((prev) => ({ ...prev, [postId]: !prev[postId] }));

    if (!editMode[postId]) {
      setEditData({ title: post.title, content: post.content });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (postId) => {
    await updatePost(postId, editData);
    setPostState((prev) => ({
      ...prev,
      [postId]: { ...prev[postId], ...editData },
    }));
    setEditMode((prev) => ({ ...prev, [postId]: false }));
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
      setPostState((prev) => {
        const updated = { ...prev };
        delete updated[postId];
        return updated;
      });
    }
  };

  const handleFavorite = async (postId) => {
    if (!user) return;
    await toggleFavoritePost(user.uid, postId);
    const favs = await getUserFavorites(user.uid);
    setFavorites(favs || []);
    if (onFavoritesChanged) onFavoritesChanged();
  };

  return (
    <>
      {Object.entries(postState).map(([postId, post]) => (
        <Box className="post-box" key={postId}>
          {/* Heart icon for favorites */}
          {user && (
            <button
              onClick={() => handleFavorite(postId)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'absolute',
                top: 18,
                right: 18,
                fontSize: 28,
                color: favorites.includes(postId) ? '#00e6ff' : '#e3e8ef', // neon blue for filled
                filter: favorites.includes(postId) ? 'drop-shadow(0 0 8px #00e6ff)' : 'none',
                zIndex: 2,
              }}
              aria-label={favorites.includes(postId) ? 'Remove from favorites' : 'Add to favorites'}
              title={favorites.includes(postId) ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favorites.includes(postId) ? <FaHeart /> : <FaRegHeart />}
            </button>
          )}

          {editMode[postId] ? (
            <>
              <input
                name="title"
                value={editData.title}
                onChange={handleEditChange}
                style={{ marginBottom: 8, display: "block", width: "100%" }}
              />
              <textarea
                name="content"
                value={editData.content}
                onChange={handleEditChange}
                style={{ marginBottom: 8, display: "block", width: "100%" }}
              />
              <button
                onClick={() => handleUpdate(postId)}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  marginRight: 4,
                }}
              >
                Save
              </button>
              <button
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, [postId]: false }))
                }
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <Heading className="post-title" size="md" mb={2}>
                {post.title}
              </Heading>
              <Text className="post-content" mb={2}>
                {post.content}
              </Text>
            </>
          )}

          <Text fontSize="sm" color="gray.500">
            By {post.authorHandle} on {post.createdOn}
          </Text>

          {user && (
            <div className="like-dislike-group">
              <button
                className={`like-btn${
                  post.likes?.includes(user.uid) ? " selected" : ""
                }`}
                onClick={() => handleVote(postId, "like")}
              >
                👍 Like ({post.likes ? post.likes.length : 0})
              </button>
              <button
                className={`dislike-btn${
                  post.dislikes?.includes(user.uid) ? " selected" : ""
                }`}
                onClick={() => handleVote(postId, "dislike")}
              >
                👎 Dislike ({post.dislikes ? post.dislikes.length : 0})
              </button>
              {post.authorUid === user.uid && (
                <>
                  <button
                    className="edit-post-btn"
                    onClick={() => handleEditToggle(postId, post)}
                  >
                    {editMode[postId] ? "Cancel" : "Edit"}
                  </button>
                  {!editMode[postId] && (
                    <button
                      className="delete-post-btn"
                      onClick={() => handleDelete(postId)}
                    >
                      Delete
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {user && (
            <>
              <button
                className="show-comments-btn"
                style={{
                  color: "#00e6ff",
                  marginTop: "10px",
                  textShadow:
                    "0 0 8px #00e6ff, 0 0 16px #00e6ff, 0 0 32px #00e6ff",
                }}
                onClick={() =>
                  setVisibleComments((prev) => ({
                    ...prev,
                    [postId]: !prev[postId],
                  }))
                }
              >
                {visibleComments[postId] ? "Hide Comments" : "Show Comments"}
              </button>

              {visibleComments[postId] && (
                <Box
                  border="1px solid transparent"
                  padding="10px"
                  marginTop="10px"
                >
                  <Comments postId={postId} userData={userData} neon={true} />
                </Box>
              )}
            </>
          )}
        </Box>
      ))}
    </>
  );
}

export default PostList;
