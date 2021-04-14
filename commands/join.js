const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.reply(
      "¡no te veo en ningún canal de voz! entra a uno e intenta de nuevo.")
        .then(msg => {
    msg.delete({ timeout: 7500 })
  });

  if (!channel.permissionsFor(message.client.user).has("CONNECT"))
    return error("¡No tengo permisos para entrar a este canal de voz! `CONNECT`");

  if (!channel.permissionsFor(message.client.user).has("SPEAK"))
    return error("¡No tengo permisos para hablar en este canal de voz! `SPEAK`");

  await channel.join()
  .then(connection => {
    connection.voice.setSelfDeaf(true);
});

message.react("🤝");

};
