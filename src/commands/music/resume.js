import { Command } from '../../classes/abstract/command.js';
import { updatePlayerButtons } from '../../functions/updatePlayerButtons.js';
export default class Resume extends Command {
    constructor() {
        super(...arguments);
        this.playing = true;
        this.inSameVC = true;
        this.description = 'Resume paused player';
        this.execute = async (client, ctx) => {
            const player = client.getPlayer(ctx);
            if (!player.paused) {
                await ctx.reply({
                    embeds: [
                        client
                            .embed()
                            .desc(`${client.emoji.cross} ${client.t('queue.alreadyPlaying')}`),
                    ],
                });
                return;
            }
            player.pause(false);
            await updatePlayerButtons(client, player);
            await ctx.reply({
                embeds: [client.embed().desc(`${client.emoji.check} ${client.t('queue.resumed')}`)],
            });
        };
    }
}
/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
