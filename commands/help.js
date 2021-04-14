const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const commands = `join\`\` - entra al canal de voz en que te encuentras
   leave\`\` - sale del canal de voz en que te encuentras
   play <nombre de la canción o url>\`\` - reproduce canciones de youtube
   pause\`\` - pausa la reproducción
   resume\`\` - continúa la reproducción pausada
   queue\`\` - muestra la cola de reproducción del servidor
   skip\`\` - salta a la siguiente canción en cola
   skipto <número>\`\` - salta múltiples veces hasta la reproducción indicada
   stop\`\` - detiene la reproducción y elimina la cola
   volume <número o nada>\`\` - ver o ajustar el volumen de las reproducciones
   song\`\` - muestra la reproducción actual
   lyrics\`\` - busca la lírica de la reproducción actual
   shuffle\`\` - aleatoriza la cola
   invite\`\` - obtén el enlace de invitación del bot
   loop\`\` - activa / desactiva el loop en la reproducción actual
   remove <número>\`\` - elimina una canción de la cola
   help\`\` - para ver este comando 'ekide'`;

  const revised = commands
    .split("\n")
    .map((x) => "• " + "``" + client.config.prefix + x.trim())
    .join("\n");

  message.channel.send(
    new MessageEmbed()
      .setAuthor("Ayuda", " ")
//      .setTimestamp()
      .setDescription(revised)
  );
};
