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
        const reason = args.join(' ') || client.t('afk.defaultReason');
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
                        `${client.emoji.check} **${client.t('afk.activated')}**\n\n` +
                        `${client.emoji.info} ${client.t('afk.reason', { reason: reason })}\n` +
                        `${client.emoji.info} ${client.t('afk.notifyOthers')}`
                    ),
            ],
        });
    };
}
/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
