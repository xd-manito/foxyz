const ytdl = require("discord-ytdl-core");
const youtubeScraper = require("yt-search");
const yt = require("ytdl-core");
const { MessageEmbed, Util } = require("discord.js");
const forHumans = require("../utils/forhumans.js");
//const Youtube = require('simple-youtube-api');
//const { youtubeAPI } = require('../../config.json');
//const youtube = new Youtube(youtubeAPI);

exports.run = async (client, message, args) => {
  const channel = message.member.voice.channel;

  const error = (err) => message.channel.send(err);
  const errorReply = (err2) => message.reply(err2);
  const send = (content) => message.channel.send(content);
  const setqueue = (id, obj) => message.client.queue.set(id, obj);
  const deletequeue = (id) => message.client.queue.delete(id);
  var song;

  if (!channel) return errorReply("¡no te veo en ningún canal de voz! entra a uno e intenta de nuevo.")
  .then(msg => {
    msg.delete({ timeout: 7500 })
  });

  if (!channel.permissionsFor(message.client.user).has("CONNECT"))
    return error("¡No tengo permisos para entrar a este canal de voz! `CONNECT`");

  if (!channel.permissionsFor(message.client.user).has("SPEAK"))
    return error("¡No tengo permisos para hablar en este canal de voz! `SPEAK`");

  const query = args.join(" ");

  if (!query) return errorReply("¡especifica una canción!")
  .then(msg => {
    msg.delete({ timeout: 7500 })
  });

  if (query.includes("www.youtube.com")) {
    try {
      const ytdata = await yt.getBasicInfo(query);

      if (!ytdata) return errorReply("no se encontró ninguna canción con la URL dada.");
      song = {
        name: Util.escapeMarkdown(ytdata.videoDetails.title),
        thumbnail:
          ytdata.player_response.videoDetails.thumbnail.thumbnails[0].url,
        requested: message.author,
        videoId: ytdata.videoDetails.videoId,
        duration: forHumans(ytdata.videoDetails.lengthSeconds),
        url: ytdata.videoDetails.video_url,        
        views: ytdata.videoDetails.viewCount,
      };
    } catch (e) {
      console.log(e);
      return error("Error ocurrido.");
    }
  } 
  
  else {
    try {
      const fetched = await (await youtubeScraper(query)).videos;
      if (fetched.length === 0 || !fetched)
        return errorReply("¡no pude encontrar la canción que me solicitas!");
      const data = fetched[0];
      song = {
        name: Util.escapeMarkdown(data.title),
        thumbnail: data.image,
        requested: message.author,
        videoId: data.videoId,
        duration: data.duration.toString(),
        url: data.url,
        views: data.views,
      };
    } catch (err) {
      console.log(err);
      return error("Error ocurrido.");
    }
  }

  var list = message.client.queue.get(message.guild.id);

message.react("👍");

  if (list) {
    list.queue.push(song);
    return send(
      new MessageEmbed()
        .setAuthor("Añadida a la cola:", " ")
        .setTitle(song.name, false)
        .setURL(song.url, false)
        .setDescription("Se ecuentra en la posición " + list.queue.length + " de la cola, `[" + song.duration + "]` " )
        .setThumbnail(song.thumbnail)
        .setColor("03bb85")
        ).then(msg => {
          msg.delete({ timeout: 20000 })
        });
  }

  const structure = {
    channel: message.channel,
    vc: channel,
    volume: 75,
    playing: true,
    queue: [],
    connection: null,
  };

  setqueue(message.guild.id, structure);
  structure.queue.push(song);

  try {
    const join = await channel.join();

    channel.join()
    .then(connection =>
      connection.voice.setDeaf(true))
      .then(connection =>
        connection.voice.setSelfDeaf(true));
      
        structure.connection = join;
        play(structure.queue[0]);
  } catch (e) {
    console.log(e);
    deletequeue(message.guild.id);
    return error("No pude entrar en el canal de voz. Error ocurrido.");
  }

  async function play(track) {
    try {
      const data = message.client.queue.get(message.guild.id);
      if (!track) {
        data.channel.send("La cola está vacía... saliendo del canal de voz.")
        .then(msg => {
          msg.delete({ timeout: 7500 })
        });
        message.guild.me.voice.channel.leave();
        return deletequeue(message.guild.id);
      }
      data.connection.on("disconnect", () => deletequeue(message.guild.id));
      const source = await ytdl(track.url, {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        opusEncoded: true,
      });
      const player = data.connection
        .play(source, { type: "opus" })
        .on("finish", () => {
          var removed = data.queue.shift();
          if(data.loop == true){
            data.queue.push(removed)
          }
          play(data.queue[0]);
        });
      player.setVolumeLogarithmic(data.volume / 100);

message.react("👍");

      data.channel.send(
        new MessageEmbed()
          .setAuthor("Sonando ahora:", " ")
          .setTitle(track.name, false)
          .setURL(track.url, false)
          .setDescription("• Pedida por: <@" + track.requested + ">, `[" + track.duration + "]` ")
          .setThumbnail(track.thumbnail)
//          .setColor("03bb85")
//          .addField("Nombre", track.name, false)
//          .addField("Visitas", track.views, false)
//          .addField("Duración", track.duration, false)
//          .addField("Pedida por", track.requested, false)
//          .setFooter("desde www.youtube.com")
      )
    } catch (e) {
      console.error(e);
    }
  }
};
