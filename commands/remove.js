const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.reply(
      "¡no te veo en ningún canal de voz! entra a uno e intenta de nuevo.")
        .then(msg => {
    msg.delete({ timeout: 7500 })
  });

  if (!args[0])
    return message.reply(":x: especifica número de canción.")
    .then(msg => {
      msg.delete({ timeout: 7500 })
    });

  if (isNaN(args[0]))
    return message.reply(":x: tiene que especificar un número **(Ejemplo: -remove 3)**")
    .then(msg => {
      msg.delete({ timeout: 7500 })
    });

  let queue = message.client.queue.get(message.guild.id);
  if (args[0] == 1)
    return message.reply(":x: no se puede eliminar la reproducción actual, **utiliza el comando `" + client.config.prefix + "skip`.**")
    .then(msg => {
      msg.delete({ timeout: 7500 })
    });

  if (queue.queue.length == 1)
    return message.reply(":x: no se puede eliminar si solo hay una canción, **utiliza el comando `" +client.config.prefix + "stop`.**")
    .then(msg => {
      msg.delete({ timeout: 7500 })
    });

  if (args[0] > queue.queue.length)
    return message.reply(":x: la cola no tiene esa cantidad de canciones.")
    .then(msg => {
      msg.delete({ timeout: 7500 })
    });

  if (!queue)
        return message.reply(":x: nada se está reproduciendo.")
    .then(msg => {
      msg.delete({ timeout: 7500 })
    });
  var name = queue.queue[args[0] - 1].name;
  var url = queue.queue[args[0] - 1].url;
  queue.queue.splice(args[0] - 1);
  
message.react("✅");

  return message.channel.send(
    new MessageEmbed()
      .setAuthor("Se ha eliminado de la cola:", " ")
      .setTitle(name, false)
      .setURL(url, false)
//      .setDescription("Ha sido eliminada de la cola. 🗑️")
//      .setTimestamp()
      .setColor("cc6666")
  ).then(msg => {
    msg.delete({ timeout: 10000 })
  });
};
