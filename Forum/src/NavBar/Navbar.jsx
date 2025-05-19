import { Box, Flex, Link, Spacer, Button, Input } from "@chakra-ui/react";
import { AppContext } from "../state/app.context";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth.service";
import PostList from "../views/Posts/Components Post/PostList";

function Navbar() {
  const { user, userData, setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const logout = () => {
    logoutUser()
      .then(() => {
        setAppState({ user: null, userData: null });
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  // Search state
  const [search, setSearch] = useState("");
  const [allPosts, setAllPosts] = useState({});
  const [filteredPosts, setFilteredPosts] = useState(null);
  const [searchTouched, setSearchTouched] = useState(false);

  useEffect(() => {
    // Fetch all posts once on mount
    import("../services/posts.service")
      .then(({ getAllPosts }) => {
        getAllPosts().then((posts) => {
          setAllPosts(posts || {});
        });
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
      });
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredPosts(null);
      return;
    }
    const query = search.trim().toLowerCase();
    const matches = Object.entries(allPosts).filter(([, post]) => {
      const titleMatch = post.title && post.title.toLowerCase().includes(query);
      const contentMatch = post.content && post.content.toLowerCase().includes(query);
      return titleMatch || contentMatch;
    });
    setFilteredPosts(Object.fromEntries(matches));
  }, [search, allPosts]);

  return (
    <>
      <Flex as="nav" bg="gray.800" color="white" padding="1.5rem" align="center">
        <Box
          className="logo"
          onClick={() => {
            navigate("/");
          }}
          fontWeight="bold"
          fontSize="4xl"
          fontFamily="'Bebas Neue', sans-serif"
        >
          DEBATABLE
        </Box>

        <Spacer />

        <Flex gap="1rem">
          <Link href="/" _hover={{ textDecoration: "none", color: "teal.300" }}>
            Home
          </Link>
          {!user && (
            <>
              <Link
                href="/login"
                _hover={{ textDecoration: "none", color: "teal.300" }}
              >
                Login
              </Link>
              <Link
                href="/register"
                _hover={{ textDecoration: "none", color: "teal.300" }}
              >
                Register
              </Link>
            </>
          )}
          {user && (
            <>
              <Link
                href="/create-post"
                _hover={{ textDecoration: "none", color: "teal.300" }}
              >
                Create Post
              </Link>
              <Link
                href="/favorites"
                _hover={{ textDecoration: "none", color: "#00e6ff" }}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span role="img" aria-label="favorites" style={{ fontSize: 22, color: '#00e6ff', filter: 'drop-shadow(0 0 8px #00e6ff)' }}>❤</span>
                Favorites
              </Link>
              <Button
                variant="link"
                onClick={logout}
                _hover={{ color: "teal.300" }}
              >
                Logout
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/profile")}
                aria-label="User Profile"
                style={{
                  borderRadius: "50%",
                  padding: 0,
                  width: 40,
                  height: 40,
                  marginLeft: 8,
                  overflow: 'hidden',
                  background: 'none',
                  border: 'none',
                  boxShadow: userData?.avatarBase64 ? '0 0 8px #00e6ff' : 'none',
                }}
              >
                {userData?.avatarBase64 ? (
                  <img
                    src={userData.avatarBase64}
                    alt="Avatar"
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span role="img" aria-label="user" style={{ fontSize: 24 }}>
                    👤
                  </span>
                )}
              </Button>
            </>
          )}
        </Flex>
      </Flex>
      {/* Simplified, perfectly centered search bar area below navbar */}
      <Box
        className="searchbar-container"
        width="100%"
        bg="#232526"
        py={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearchTouched(true);
          }}
          style={{
            width: "100%",
            maxWidth: 500,
            margin: "0 auto",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            gap: 0,
          }}
        >
          <Input
            placeholder="Search posts by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchTouched(true);
            }}
            size="md"
            bg="#181a1b"
            color="#e3e8ef"
            borderColor="#00e6ff"
            borderRadius="8px 0 0 8px"
            fontSize="1.08rem"
            flex={1}
            _placeholder={{ color: "#b0b3b8" }}
            borderRight="none"
          />
          <Button
            type="submit"
            colorScheme="cyan"
            borderRadius="0 8px 8px 0"
            fontWeight="bold"
            minWidth={90}
            fontSize="1.05rem"
            background="#00e6ff"
            color="#181a1b"
            border="none"
            boxShadow="none"
            _hover={{
              background: "#00bcd4",
              color: "white",
            }}
            style={{ padding: 0 }}
          >
            Search
          </Button>
        </form>
      </Box>
      {/* Render search results below search bar if search is touched */}
      {searchTouched && search.trim() !== "" && (
        <Box bg="#181a1b" px={8} py={6} minH="200px">
          {filteredPosts && Object.keys(filteredPosts).length > 0 ? (
            <PostList posts={filteredPosts} />
          ) : (
            <Box color="#e3e8ef" fontSize="lg" textAlign="center" py={8}>
              No matches found with this title.
            </Box>
          )}
        </Box>
      )}
    </>
  );
}

export default Navbar;
