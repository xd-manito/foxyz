const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

exports.run = async (client, message, args) => {
  const queue = message.client.queue.get(message.guild.id);
  if (!queue)
    return message.channel.send(":x: nada se está reproduciendo.")
    .then(msg => {
      msg.delete({ timeout: 7500 })
    })
      .catch(console.error);

  let lyrics = null;

  try {
    lyrics = await lyricsFinder(queue.queue[0].name, "");
    if (!lyrics) lyrics = `No se encontró la lírica de ${queue.queue[0].name} :x:`;
  } catch (error) {
    lyrics = `No se encontró la lírica de ${queue.queue[0].name} :x:`;
  }

  let lyricsEmbed = new MessageEmbed()
    .setAuthor(
      `Lírica de ${queue.queue[0].name}`," ")
    .setDescription(lyrics)
//    .setColor("03bb85")
    .setTimestamp();

  if (lyricsEmbed.description.length >= 2048)
    lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
  return message.channel.send(lyricsEmbed).catch(console.error);
};
