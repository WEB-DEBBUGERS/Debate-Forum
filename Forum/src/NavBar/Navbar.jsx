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
        THE BEST DEBATE FORUM
      </Box>

      <Spacer />

      <Flex gap="1rem">
        <Link href="/" _hover={{ textDecoration: 'none', color: 'teal.300' }}>
          Home
        </Link>
        <Link href="/login" _hover={{ textDecoration: 'none', color: 'teal.300' }}>
          Login
        </Link>
        <Link href="/register" _hover={{ textDecoration: 'none', color: 'teal.300' }}>
          Register
        </Link>
      </Flex>
    </Flex>
  );
}

export default Navbar;