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
      <div>
        <Navbar />
      </div>
      <div className="home">
        {!user ? (
          <NewsFeed />
        ) : (
          <>
            {userData?.isAdmin && (
              <button onClick={() => navigate("/admin")}>Admin Panel</button>
            )}
            <Grid templateColumns="1fr 1fr" gap={4}>
              <Box>
                <Posts/>
              </Box>
              <Box>
                <NewsFeed/>
              </Box>
            </Grid>
          </>
        )}
      </div>
    </>
  );
}