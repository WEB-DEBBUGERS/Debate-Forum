import { Box, Text, Heading, VStack } from "@chakra-ui/react";
import Comments from "../../Comments/Comments";
import { useState ,useContext } from "react";
import { AppContext } from "../../../state/app.context";


function PostList({ title, content, authorHandle, createdOn, id }) {
  const [visibleComments, setVisibleComments] = useState({});
  const {userData} = useContext(AppContext)
  return (
    <Box
      key={id.id}
      borderWidth="1px"
      borderRadius="md"
      p={4}
      bg="gray.50"
      boxShadow="sm"
      _hover={{ boxShadow: "md", bg: "white" }}
    >
      <Heading style={{ color: "black" }} size="md" mb={2}>
        {title}
      </Heading>
      <Text style={{ color: "black" }} mb={2}>
        {content}
      </Text>
      <Text fontSize="sm" color="gray.500">
        By {authorHandle} on {createdOn}
      </Text>
      <button style={{color: 'black'}}
        onClick={() =>
          setVisibleComments((prev) => ({
            ...prev,
            [id]: !prev[id],
          }))
        }
      >
        {visibleComments[id] ? "Hide Comments" : "Show Comments"}
      </button>

      {visibleComments[id] && (
        <div
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <Comments postId={id} userData={userData} />
        </div>
      )}
    </Box>
  );
}

export default PostList;
