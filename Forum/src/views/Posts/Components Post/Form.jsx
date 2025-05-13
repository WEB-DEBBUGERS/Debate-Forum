import {
  Box,
  Input,
  Textarea,
  Button,
  VStack,
  Heading,
} from "@chakra-ui/react";

function Form({ handleChange, title, content, handleSubmit }) {
  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      className="create-post-form-glass"
      maxW="lg"
      mx="auto"
      mt={8}
    >
      <VStack spacing={4} align="stretch">
        <Heading size="md" style={{ color: '#e3e8ef' }}>Create Post</Heading>
        <Input
          name="title"
          placeholder="Enter post title?"
          variant="filled"
          value={title}
          onChange={handleChange}
        />
        <Textarea
          name="content"
          placeholder="What's on your mind?"
          variant="filled"
          resize="vertical"
          value={content}
          onChange={handleChange}
        />
        <Button type="submit" colorScheme="blue" alignSelf="flex-end">
          Post
        </Button>
      </VStack>
    </Box>
  );
}

export default Form;