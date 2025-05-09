import NewsFeed from "./News/NewsFeed";
import { useContext } from "react";
import { AppContext } from "../../state/app.context";
import Navbar from "../../NavBar/Navbar";
import Posts from "../Posts/Posts"


export default function Home() {
  const { user } = useContext(AppContext);

  return (
    <>
    <div>
      <Navbar/>
    </div>
      <div className="home">
        {!user ? (
          <NewsFeed />
        ) : (
          <>
          <Posts/>
          </>
        )}
      </div>
    </>
  );
}
