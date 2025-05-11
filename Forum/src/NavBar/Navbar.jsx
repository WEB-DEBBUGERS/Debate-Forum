import { Box, Flex, Link, Spacer, Button } from "@chakra-ui/react";
import { AppContext } from "../state/app.context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth.service";

function Navbar() {
  const { user, setAppState } = useContext(AppContext);
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

  return (
    <Flex as="nav" bg="gray.800" color="white" padding="1.5rem" align="center">
      <Box fontWeight="bold" fontSize="xl">
        THE BEST DEBATE FORUM
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
            <Button
              variant="link"
              onClick={logout}
              _hover={{ color: "teal.300" }}
            >
              Logout
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
}

export default Navbar;
