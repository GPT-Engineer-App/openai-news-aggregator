import React, { useState } from "react";
import { Box, Heading, Input, Button, Text, Spinner, VStack, useToast } from "@chakra-ui/react";
import { FaKey, FaNewspaper } from "react-icons/fa";

const Index = () => {
  const [apiKey, setApiKey] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const newsResponse = await fetch("https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_NEWS_API_KEY");
      const newsData = await newsResponse.json();
      const articles = newsData.articles.slice(0, 5);
      const articleSummaries = articles.map((article) => article.description);
      const prompt = `Summarize the following news articles:\n\n${articleSummaries.join("\n\n")}`;

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: apiKey,
          articles: articleSummaries,
        }),
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An error occurred while fetching data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <Box maxWidth="600px" margin="auto" padding="20px">
      <Heading as="h1" size="xl" textAlign="center" marginBottom="20px">
        News Summarizer
      </Heading>
      <VStack spacing={4}>
        <Input placeholder="Enter your OpenAI API key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} leftIcon={<FaKey />} />
        <Button onClick={handleSubmit} colorScheme="blue" leftIcon={<FaNewspaper />} isLoading={loading}>
          Summarize News
        </Button>
        {loading ? (
          <Spinner />
        ) : (
          summary && (
            <Box borderWidth="1px" borderRadius="md" padding="20px">
              <Heading as="h2" size="lg" marginBottom="10px">
                News Summary
              </Heading>
              <Text>{summary}</Text>
            </Box>
          )
        )}
      </VStack>
    </Box>
  );
};

export default Index;
