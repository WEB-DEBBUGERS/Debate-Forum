import NewsFeed from "./News/NewsFeed";
import { useContext } from "react";
import { AppContext } from "../../state/app.context";
import Demo from "../../Components/Demo/Demo";
export default function Home() {
  const { user } = useContext(AppContext);

  return (
    <>
      <div>
        <Demo></Demo>
      </div>
      <div className="home">
        {!user ? (
          <NewsFeed />
        ) : (
          <h1>Here will be the logged in user component Home page</h1>
        )}
      </div>
    </>
  );
}
