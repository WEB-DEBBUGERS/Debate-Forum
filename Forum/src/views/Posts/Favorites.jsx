import { useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../../state/app.context";
import { getUserFavorites } from "../../services/users.service";
import { getAllPosts } from "../../services/posts.service";
import PostList from "./Components Post/PostList";
import Navbar from "../../NavBar/Navbar";

export default function Favorites() {
  const { user } = useContext(AppContext);
  const [favoritePosts, setFavoritePosts] = useState({});
  const [reload, setReload] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    const favIds = await getUserFavorites(user.uid);
    const allPosts = await getAllPosts();
    const favPosts = {};
    (favIds || []).forEach((id) => {
      if (allPosts[id]) favPosts[id] = allPosts[id];
    });
    setFavoritePosts(favPosts);
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [user, reload, fetchFavorites]);

  // Handler to trigger reload from PostList when a favorite is toggled
  const handleFavoritesChanged = () => setReload((r) => !r);

  return (
    <>
      <Navbar />
      <div className="all-posts-bg" style={{ minHeight: "100vh", padding: 32 }}>
        <h2 style={{ color: "#00e6ff", textAlign: "center", marginBottom: 32 }}>
          My Favorites
        </h2>
        <PostList posts={favoritePosts} showOnlyFavorites onFavoritesChanged={handleFavoritesChanged} />
      </div>
    </>
  );
}
