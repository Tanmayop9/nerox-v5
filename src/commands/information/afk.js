import { Command } from '../../classes/abstract/command.js';

export default class Afk extends Command {
    constructor() {
        super(...arguments);
        this.description = 'Set yourself as AFK';
        this.usage = '[reason]';
        this.options = [
            {
                name: 'reason',
                opType: 'string',
                description: 'Reason for being AFK',
                required: false,
            },
        ];
    }

    execute = async (client, ctx, args) => {
        const reason = args.join(' ') || await client.t(ctx.author.id, 'afk.defaultReason');
        const afkData = {
            reason: reason,
            timestamp: Date.now(),
        };

        await client.db.afk.set(ctx.author.id, afkData);

        await ctx.reply({
            embeds: [
                client
                    .embed()
                    .desc(
                        `${client.emoji.check} **${await client.t(ctx.author.id, 'afk.activated')}**\n\n` +
                        `${client.emoji.info} ${await client.t(ctx.author.id, 'afk.reason', { reason: reason })}\n` +
                        `${client.emoji.info} ${await client.t(ctx.author.id, 'afk.notifyOthers')}`
                    ),
            ],
        });
    };
}
/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
