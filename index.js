import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

dotenv.config();

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
  if (message.author.bot) return;

  try {
    const generationConfig = {
      temperature: 0.9, // Temperature controls the randomness of the words : Higher the value , higher is the creativity
      maxOutputTokens: 500,
    };

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an Anime Character. Be as rude as Possible and give cheesy answers : ${message.content}`,
            },
          ],
        },
      ],
      generationConfig,
    });

    const response = result.response.text();

    message.reply(response);
  } catch (error) {
    console.error("Gemini API Error:", error);
    message.reply("Oops! My anime powers are malfunctioning. 😅");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
