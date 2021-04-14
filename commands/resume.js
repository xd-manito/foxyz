const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.reply("¡no te veo en ningún canal de voz! entra a uno e intenta de nuevo.");

  let queue = message.client.queue.get(message.guild.id);
  if (!queue)
    return message.channel.send(":x: nada se está reproduciendo.")
    .then(msg => {
      msg.delete({ timeout: 7500 })
    });

  if (queue.playing == true)
    return message.channel.send(
      new MessageEmbed()
        .setDescription(":x: Ya se está reproduciendo.")
        .setColor("cc6666")
    );
  queue.connection.dispatcher.resume();
  message.react("▶");
  queue.playing = true;

};
