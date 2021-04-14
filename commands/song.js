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
    return message.channel.send(":x: nada se está reproduciendo.")
    .then(msg => {
      msg.delete({ timeout: 7500 })
    });

  message.channel.send(
    new MessageEmbed()
      .setAuthor(
        "Reproduciendo:", " ")
//      .setColor("a6cad6")
      .setTitle(queue.queue[0].name, false)
      .setURL(queue.queue[0].url, false)
      .setThumbnail(queue.queue[0].thumbnail)
      .addFields(
		    { name: "Visitas", value: queue.queue[0].views, inline: true },
        { name: "Duración", value: queue.queue[0].duration, inline: true },
        { name: "Pedida por", value: "<@" + queue.queue[0].requested + ">", inline: true },
//        { name: "Desde", value: "'www.youtube.com'", inline: true }
      )
//      .setDescription(" • Pedida por:: " + "<@" + queue.queue[0].requested + "> Hay otras " + queue.queue.length + " canciones en cola.")
//      .setFooter("Hay " + queue.queue.length + " canciones en cola.")
  );
};
