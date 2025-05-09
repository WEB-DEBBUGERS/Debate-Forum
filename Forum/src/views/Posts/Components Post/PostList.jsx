import { Box, Text, Heading, VStack } from "@chakra-ui/react";

function PostItem({ title , content , authorHandle , createdOn , id}) {
  return (
    <Box
      key={id.id}
      borderWidth="1px"
      borderRadius="md"
      p={4}
      bg="gray.50"
      boxShadow="sm"
      _hover={{ boxShadow: "md", bg: "white" }}
    >
      <Heading style={{color: 'black'}} size="md" mb={2}>{title}</Heading>
      <Text style={{color: 'black'}} mb={2}>{content}</Text>
      <Text fontSize="sm" color="gray.500">
        By {authorHandle} on {createdOn}
      </Text>
    </Box>
  );
}

export default PostItem;