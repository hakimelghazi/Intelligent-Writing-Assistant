import OpenAI from "openai"; // Use OpenAI module
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

// Load environment variables from .env file
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Listen on port 5001
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Grammar check route
import qs from "qs"; // Import querystring library to handle form-urlencoded data

// Grammar check route
app.post("/check-grammar", async (req, res) => {
  const { text } = req.body;

  console.log("Received text for grammar check:", text); // Log incoming text

  try {
    const response = await axios.post(
      "https://api.languagetoolplus.com/v2/check",
      qs.stringify({ text, language: "en-US" }), // Use querystring to format the payload
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Set the correct content type
        },
      }
    );

    console.log("LanguageTool API response:", response.data); // Log full API response
    res.json(response.data);
  } catch (error) {
    console.error("Error in LanguageTool API call:", error.response?.data || error.message); // Detailed error log
    res.status(500).json({ message: "Error checking grammar", error: error.response?.data || error.message });
  }
});



// Suggestions route using OpenAI API
app.post("/suggestions", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You will be provided with statements, and your task is to convert them to standard English.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1,
    });

    const suggestion = response.choices[0].message.content.trim();
    res.json({ suggestion });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    res.status(500).json({ message: "Error generating suggestions" });
  }
});

// Autocomplete route
app.post("/autocomplete", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a text prediction assistant. Your task is to provide short, logical, and concise completions or continuations of incomplete user input. 
          - Do not provide answers to questions or unrelated responses.
          - Only suggest continuations when the user input clearly indicates an incomplete sentence or phrase.
          - If the input does not provide enough context to generate a meaningful continuation, respond with an empty string ("").
          - Focus on helping the user complete their thought rather than introducing new information.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      max_tokens: 8,
      temperature: 0.4,
      top_p: 1,
    });

    const suggestion = response.choices[0].message.content.trim();
    res.json({ suggestion });
  } catch (error) {
    console.error("Error generating autocomplete suggestions:", error);
    res.status(500).json({ message: "Error generating suggestions" });
  }
});

// Rewrite text route
app.post("/rewrite", async (req, res) => {
  const { text, tone } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a writing assistant. Rewrite the following text in the specified tone: ${tone}.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const rewritten = response.choices[0].message.content.trim();
    res.json({ rewritten });
  } catch (error) {
    console.error("Error rewriting text:", error);
    res.status(500).json({ message: "Error rewriting text" });
  }
});

// Translation route
app.post("/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res
      .status(400)
      .json({ error: "Both text and target language are required." });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a translation assistant. Translate the following text to ${targetLanguage}. If the language is not recognized or supported, return "Unsupported language".`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const translation = response.choices[0].message.content.trim();

    if (translation.toLowerCase().includes("unsupported language")) {
      res.status(400).json({ error: "Unsupported language" });
    } else {
      res.json({ translation });
    }
  } catch (error) {
    console.error("Error translating text:", error);
    res.status(500).json({ error: "Error translating text" });
  }
});
