const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.reply(
      "¡no te veo en ningún canal de voz! entra a uno e intenta de nuevo.")
        .then(msg => {
    msg.delete({ timeout: 7500 })
  });

  let queue = message.client.queue.get(message.guild.id);
  if (!queue)
        return message.reply(":x: nada se está reproduciendo.")
    .then(msg => {
      msg.delete({ timeout: 7500 })
    });

  queue.connection.dispatcher.end();
  queue.queue = [];
  return message.react("⏹️");
};
