import NewsFeed from "./News/NewsFeed";
import { useContext } from "react";
import { AppContext } from "../../state/app.context";
import Navbar from "../../NavBar/Navbar";
import { useNavigate } from "react-router-dom";
import Posts from "../Posts/Posts"


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
              <button onClick={() => navigate("/admin")}>
                Admin Panel
              </button>
            )}

            <Posts />
          </>
        )}
      </div>
    </>
  );
}
