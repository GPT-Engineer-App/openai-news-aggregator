import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { apiKey, articles } = req.body;

    const configuration = new Configuration({
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `Summarize the following news articles:\n\n${articles.join("\n\n")}`;

    try {
      const completion = await openai.createCompletion({
        engine: "text-davinci-002",
        prompt: prompt,
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: 0.7,
      });

      res.status(200).json({ summary: completion.data.choices[0].text.trim() });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred while processing the request." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
