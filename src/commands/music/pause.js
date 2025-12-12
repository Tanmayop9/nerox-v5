import { Command } from '../../classes/abstract/command.js';
import { updatePlayerButtons } from '../../functions/updatePlayerButtons.js';
export default class Pause extends Command {
    constructor() {
        super(...arguments);
        this.playing = true;
        this.inSameVC = true;
        this.description = 'Pause playing player';
        this.execute = async (client, ctx) => {
            const player = client.getPlayer(ctx);
            if (!player.playing) {
                await ctx.reply({
                    embeds: [
                        client
                            .embed()
                            .desc(`${client.emoji.cross} ${await client.t(ctx.author.id, 'queue.alreadyPaused')}`),
                    ],
                });
                return;
            }
            player.pause(true);
            await updatePlayerButtons(client, player);
            await ctx.reply({
                embeds: [client.embed().desc(`${client.emoji.check} ${await client.t(ctx.author.id, 'queue.paused')}`)],
            });
        };
    }
}
/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
