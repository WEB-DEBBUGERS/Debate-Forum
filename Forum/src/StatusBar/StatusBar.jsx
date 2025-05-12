import { Flex, Box, Text, Spacer, Badge } from "@chakra-ui/react";
import { useState , useEffect} from "react";
import { getAllUsers } from "../services/users.service";
import { getAllPosts } from "../services/posts.service";
import { getAllComments } from "../services/posts.service";
import { getAllReplies } from "../services/posts.service";

function StatusBar() {

    const [users, setUsers] = useState(0);
    const [posts, setPosts] = useState(0);
    const [comments, setComments] = useState(0);
    const [replies, setReplies] = useState(0);
   

    const handleUserCount = async () => {
     const user = await getAllUsers();
     const userLength = Object.keys(user).length
     setUsers(userLength)
    }

    const handlePostsCount = async () => {
        const posts = await getAllPosts();
        const postsLength = Object.keys(posts).length
        setPosts(postsLength)
    }

     const handleComments = async () => {
        const comments = await getAllComments();
        const commentsLength = Object.keys(comments).length
        setComments(commentsLength)
    }

     const handleReplies = async () => {
        const replies = await getAllReplies();
        const repliesLength = Object.keys(replies).length
        setReplies(repliesLength)
    }

    useEffect(() => {
        handleUserCount();
        handlePostsCount();
        handleComments();
        handleReplies()
    },[])

  return (
    <Flex
      bg="gray.800"
      color="white"
      px={6}
      py={3}
      align="center"
      fontSize="sm"
      shadow="md"
      height='60px'
    >
      <Box>
        <Text>👥 Active Users: <Badge colorScheme="green" ml={1}>{users}</Badge></Text>
      </Box>
      <Spacer />
      <Box>
        <Text>📝 Posts Total: <Badge colorScheme="blue" ml={1}>{posts}</Badge></Text>
      </Box>
      <Spacer />
      <Box>
        <Text>Comments<Badge colorScheme="purple" ml={1}>{comments}</Badge></Text>
        <Text>Replies<Badge colorScheme="purple" ml={1}>{replies}</Badge></Text>
      </Box>
    </Flex>
  );
}

export default StatusBar;
