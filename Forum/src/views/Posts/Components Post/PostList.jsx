import { Box, Text, Heading } from "@chakra-ui/react";
import Comments from "../../Comments/Comments";
import { useState, useContext } from "react";
import { AppContext } from "../../../state/app.context";

function PostList({ posts }) {
  const { userData } = useContext(AppContext);
  const [visibleComments, setVisibleComments] = useState({});

  return (
    <>
      {Object.entries(posts).map(([postId, post]) => (
        <Box
          marginLeft={"20px"}
          marginTop="20px"
          key={postId}
          borderWidth="1px"
          borderRadius="md"
          p={4}
          bg="gray.50"
          boxShadow="sm"
          _hover={{ boxShadow: "md", bg: "white" }}
          mb={4}
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
            <Box border="1px solid transparent" padding="10px" marginTop="10px">
              <Comments postId={postId} userData={userData} />
            </Box>
          )}
        </Box>
      ))}
    </>
  );
}

export default PostList;
