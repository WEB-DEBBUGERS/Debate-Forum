import NewsFeed from "../News/NewsFeed";
import { useContext } from "react";
import { AppContext } from "../../state/app.context";
import Navbar from "../../NavBar/Navbar";
import { useNavigate } from "react-router-dom";
import Posts from "../Posts/Posts";
import { Grid, Box } from "@chakra-ui/react";

export default function Home() {
  const { user, userData } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <>
      <Box>
        <Navbar />
      </Box>
      <Box
        marginTop="20px"
        borderWidth="1px"
        borderRadius="md"
        p={4}
        bg="gray.50"
        boxShadow="sm"
        _hover={{ boxShadow: "md", bg: "white" }}
        mb={4}
        maxH="100vh"
        overflowY="auto"
        
      >
        {!user ? (
          <>
          <NewsFeed />
          <Posts/>
          </>
        ) : (
          <>
            {userData?.isAdmin && (
              <button onClick={() => navigate("/admin")}>Admin Panel</button>
            )}
            <Grid templateColumns="1fr 1fr" gap={4}>
              <Box>
                <Posts />
              </Box>
              <Box>
                <NewsFeed />
              </Box>
            </Grid>
          </>
        )}
      </Box>
    </>
  );
}
