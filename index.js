import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

dotenv.config();

// Initialize Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  try {
    const generationConfig = {
      temperature: 0.9,
      maxOutputTokens: 500,
    };

    // Send message to Gemini and get response
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Be as rude as possible : ${message.content}`,
            },
          ],
        },
      ],
      generationConfig,
    });

    // Get the response text
    const response = result.response.text();

    // Reply to Discord message
    message.reply(response);
  } catch (error) {
    console.error("Gemini API Error:", error);
    message.reply("Oops! My anime powers are malfunctioning. 😅");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
