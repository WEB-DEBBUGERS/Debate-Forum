import { Box, Flex, Link, Spacer, Button } from "@chakra-ui/react";



function Navbar() {
  return (
    <Flex
      as="nav"
      bg="gray.800"
      color="white"
      padding="1.5rem"
      align="center"
    >
      <Box fontWeight="bold" fontSize="xl">
        MyApp
      </Box>

      <Spacer />

      <Flex gap="1rem">
        <Link to="/" _hover={{ textDecoration: 'none', color: 'teal.300' }}>
          Home
        </Link>
        <Link to="/login" _hover={{ textDecoration: 'none', color: 'teal.300' }}>
          Login
        </Link>
        <Link to="/register" _hover={{ textDecoration: 'none', color: 'teal.300' }}>
          Register
        </Link>
      </Flex>
    </Flex>
  );
}

export default Navbar;