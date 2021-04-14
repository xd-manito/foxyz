const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.reply("¡no te veo en ningún canal de voz! entra a uno e intenta de nuevo.");

  const queue = message.client.queue.get(message.guild.id);
  if (!queue)
    return message.reply(":x: no hay canciones para aleatorizar.")
    .then(msg => {
      msg.delete({ timeout: 7500 })
    });

  let songs = queue.queue;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
  }
  queue.queue = songs;
  message.client.queue.set(message.guild.id, queue);
  message.channel
    .send(
      new MessageEmbed()
        .setAuthor("Aleatorización", " ")
        .setDescription(":twisted_rightwards_arrows: cola aleatorizada.")
        .setColor("a6cad6")
    )
    .catch(console.error);
};
