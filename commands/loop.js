const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const queue = message.client.queue.get(message.guild.id);

  if (!queue)
        return message.reply(":x: nada se está reproduciendo.")
    .then(msg => {
      msg.delete({ timeout: 7500 })
    });

  queue.loop = !queue.loop;

  message.channel.send(
    new MessageEmbed()
      .setAuthor(
        "Bucle", " "
      )

      .setTimestamp()
      .setDescription(":repeat: el bucle ha sido **" +
          (queue.loop == true ? " Activado " : " Desactivado ") + "** para la actual reproducción.")
  );
};
