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
  if (!queue)
    return message.channel.send(":x: nada se está reproduciendo.")
    .then(msg => {
      msg.delete({ timeout: 7500 })
    });

  if (!args[0])
    return message.channel.send(
      new MessageEmbed()
        .setDescription(":x: necesitas especificar un número para saltar.")
        .setColor("cc6666")
    ).then(msg => {
      msg.delete({ timeout: 10000 })
    });

  if (isNaN(args[0]))
    return message.channel.send(
      new MessageEmbed()
        .setDescription(":x: el valor tiene que ser un número.")
        .setColor("cc6666")
    ).then(msg => {
    msg.delete({ timeout: 10000 })
  });

    queue.playing = !false;

  if (queue.loop) {
    for (let i = 0; i < parseInt(args[0]) - (1 + 1); i++) {
      var delta = queue.queue.shift();
      queue.queue.push(delta);
    }
  } else {
    queue.queue = queue.queue.slice(parseInt(args[0]) - (1 + 1));
  }

  try {
    queue.connection.dispatcher.end();
  } catch (e) {
    console.log(e);
    message.client.queue.delete(message.guild.id);
    queue.vc.leave();
  }

message.react("⏭️")
.then(message.react("#️⃣"));
};
