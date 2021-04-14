const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.reply(
      "¡no te veo en ningún canal de voz! entra a uno e intenta de nuevo.")
        .then(msg => {
    msg.delete({ timeout: 7500 })
  });

  let queue = message.client.queue.get(message.guild.id);

  if (!args[0])
    return message.channel.send(
      new MessageEmbed()
        .setAuthor( "Volumen", " ")
        .setDescription("El volumen actual es **" + queue.volume + ".**")
    );

  if (args[0] > 100)
    return message.channel.send(
      new MessageEmbed()
        .setAuthor( "Controlador de volumen", " ")
        .setColor("cc6666")
        .setDescription(":x: el volumen no puede exeder de  **100.**")
    ).then(msg => {
      msg.delete({ timeout: 7500 })
    });

  queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
  queue.volume = args[0];
  message.channel.send(
    new MessageEmbed()
      .setAuthor("Volumen"," ")
      .setColor("a6cad6")
      .setDescription(":white_check_mark: el volumen se ha cambiado a **" + args[0] + ".**")
  ).then(msg => {
    msg.delete({ timeout: 10000 })
  });
};
