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
 
  if (queue.playing == false)
    return message.channel.send(
      new MessageEmbed()
        .setDescription(":x: La reproducción ya ha sido pausada.")
        .setColor("cc6666")
    );
  queue.connection.dispatcher.pause();
  message.react("⏸");
  queue.playing = false;

};
