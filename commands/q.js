const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.reply(
      "¡no te veo en ningún canal de voz! entra a uno e intenta de nuevo.")
        .then(msg => {
    msg.delete({ timeout: 7500 })
  });;

  const queue = message.client.queue.get(message.guild.id);
  var status;
  var np;
  var count = 0;
  if (!queue) status = "La cola está vacía.";
  else
    status = queue.queue
      .map((x) => {
        count += 1;
        return ("• " + "`" + count + "." + "`" + x.name + " • Pedida por " + `<@${x.requested.id}>`);
      })
      .join("\n");
  if (!queue) np = status;
  else np = queue.queue[0].name;
  if (queue) thumbnail = queue.queue[0].thumbnail;
  else thumbnail = message.guild.iconURL();
  message.channel.send(
    new MessageEmbed()
      .setAuthor("Cola:", " ")
      .setThumbnail(thumbnail)
      .setColor("a6cad6")
      .addField("En reproducción:", np, true)
      .setDescription(status)
  );
};
