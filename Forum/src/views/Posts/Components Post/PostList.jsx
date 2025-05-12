import { Box, Text, Heading } from "@chakra-ui/react";
import Comments from "../../Comments/Comments";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../../state/app.context";
import { likeOrDislikePost } from "../../../services/posts.service";

function PostList({ posts }) {
  const { user, userData } = useContext(AppContext);
  const [visibleComments, setVisibleComments] = useState({});
  const [voted, setVoted] = useState({});
  const [postState, setPostState] = useState(posts);

  useEffect(() => {
    setPostState(posts);
  }, [posts]);

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

  return (
    <>
      {Object.entries(postState).map(([postId, post]) => (
        <Box
          marginLeft={"20px"}
          marginTop="20px"
          key={postId}
          borderWidth="1px"
          borderRadius="md"
          p={4}
          boxShadow="sm"
          _hover={{ boxShadow: "md" }}
          mb={4}
          bg="#FFF9E6"
        >
          <Heading color="black" size="md" mb={2}>
            {post.title}
          </Heading>
          <Text color="black" mb={2}>
            {post.content}
          </Text>
          <Text fontSize="sm" color="gray.500">
            By {post.authorHandle} on {post.createdOn}
          </Text>
          {user && (
            <div style={{ display: "flex", gap: 12, margin: "10px 0" }}>
              <button
                style={{
                  background: "#e0f7fa",
                  color: "#00796b",
                  border: "none",
                  borderRadius: 4,
                  padding: "6px 16px",
                  cursor: "pointer",
                  marginRight: 4,
                  fontWeight: post.likes?.includes(user.uid)
                    ? "bold"
                    : "normal",
                  boxShadow: post.likes?.includes(user.uid)
                    ? "0 0 0 2px #00796b"
                    : "none",
                }}
                onClick={() => handleVote(postId, "like")}
              >
                👍 Like ({post.likes ? post.likes.length : 0})
              </button>
              <button
                style={{
                  background: "#ffebee",
                  color: "#c62828",
                  border: "none",
                  borderRadius: 4,
                  padding: "6px 16px",
                  cursor: "pointer",
                  fontWeight: post.dislikes?.includes(user.uid)
                    ? "bold"
                    : "normal",
                  boxShadow: post.dislikes?.includes(user.uid)
                    ? "0 0 0 2px #c62828"
                    : "none",
                }}
                onClick={() => handleVote(postId, "dislike")}
              >
                👎 Dislike ({post.dislikes ? post.dislikes.length : 0})
              </button>
            </div>
          )}
          {user && (
            <>
              <button
                style={{ color: "black", marginTop: "10px" }}
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
                  <Comments postId={postId} userData={userData} />
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
