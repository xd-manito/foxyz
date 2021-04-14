const Discord = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const client = new Discord.Client();
const config = {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX,
};
client.config = config;
client.queue = new Map();

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`); // || require(`./aliasses/${file}`);
    let commandName = file.split(".")[0];
    console.log(`[Administrador de comandos]: Cargando comando ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.on("ready", () => {
  console.log("estoy listo!");
client.user.setActivity("+help by @maia#8300", {
    type:"LISTENING",
    url: "https://www.twitch.tv/maiatler"})
  .catch(console.error);
  });

client.login(client.config.token);
