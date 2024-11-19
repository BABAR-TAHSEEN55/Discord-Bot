import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import OpenAI from "openai";
import { Models } from "openai/resources/models.mjs";
import Bottleneck from "bottleneck";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OpenAiKey,
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const limiter = new Bottleneck({
  minTime: 200, // Wait 200ms between requests
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  try {
    const reply = await limiter.schedule(() =>
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an Anime Character. Give cheesy punch lines.",
          },
          { role: "user", content: message.content },
        ],
      })
    );

    message.reply(reply.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
    message.reply("I am not Ultron! Shut up and leave.");
  }
});

// client.on("messageCreate", (message) => {
//   if (message.author.bot) return;
//   message.reply(`Welcome ${message.author} `);
// });

client.login(process.env.Client);
