/** 
 * @nerox v1.0.0
 * @author Tanmay
 * @copyright 2024 NeroX - Services
 */

import { Command } from "../../classes/abstract/command.js";

export default class Ping extends Command {
  constructor() {
    super(...arguments);
    this.aliases = ["latency", "pong"];
    this.description = "Displays latency stats";
  }

  execute = async (client, ctx) => {
    const msg = await ctx.reply({ 
      embeds: [
        client.desc(client.t('ping.checking'))
      ]
    });

    const start = performance.now();
    await client.db.blacklist.set("test", true);
    await client.db.blacklist.get("test");
    await client.db.blacklist.delete("test");
    const dbLatency = (performance.now() - start).toFixed(2);

    const wsLatency = client.ws.ping.toFixed(2);
    const msgLatency = msg.createdTimestamp - ctx.createdTimestamp;

    const embed = client.embed('#2B2D31')
      .setAuthor({
        name: `${client.user.username} - ${client.t('ping.title')}`,
        iconURL: client.user.displayAvatarURL()
      })
      .desc(
        `**${client.t('ping.websocket')}:** ${wsLatency}ms\n` +
        `**${client.t('ping.database')}:** ${dbLatency}ms\n` +
        `**${client.t('ping.message')}:** ${msgLatency}ms`
      )
      .footer({ 
        text: client.t('ping.requestedBy', { user: ctx.author.username }),
        iconURL: ctx.author.displayAvatarURL()
      });

    await msg.edit({ content: null, embeds: [embed] });
  };
}
