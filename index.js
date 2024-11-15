import { Client, GatewayIntentBits } from "discord.js";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  message.reply(`Welcome ${message.author}`);
});

client.login(
  "MTMwNjE5NTUyOTU0OTYxNTIyNQ.Go-W8k.kIUnz4DOFE7Tk2kWLsWOr1MxdIDXTnmRu2_90E"
);
