
import { Command } from '../../classes/abstract/command.js';
export default class Play extends Command {
    constructor() {
        super(...arguments);
        this.inSameVC = true;
        this.aliases = ['p'];
        this.usage = '<query>';
        this.description = 'Play music using query';
        this.options = [
            {
                name: 'query',
                required: true,
                opType: 'string',
                isAutoComplete: true,
                description: 'what would you like to listen to ?',
            },
        ];
        this.execute = async (client, ctx, args) => {
            if (!args.length) {
                await ctx.reply({
                    embeds: [client.embed().desc(`${client.emoji.cross} ${client.t('play.provideQuery')}`)],
                });
                return;
            }
            const player = client.getPlayer(ctx) ||
                (await client.manager.createPlayer({
                    deaf: true,
                    guildId: ctx.guild.id,
                    textId: ctx.channel.id,
                    shardId: ctx.guild.shardId,
                    voiceId: ctx.member.voice.channel.id,
                }));
            const waitEmbed = await ctx.reply({
                embeds: [
                    client
                        .embed()
                        .desc(`${client.emoji.timer} ${client.t('play.searching')}`),
                ],
            });
            const result = await player.search(args.join(' '), {
                requester: ctx.author,
            });
            if (!result.tracks.length) {
                await waitEmbed.edit({
                    embeds: [client.embed().desc(`${client.emoji.cross} ${client.t('play.noResults')}`)],
                });
                return;
            }
            const tracks = result.tracks;
            if (result.type === 'PLAYLIST')
                for (const track of tracks) {
                    if (track.length && track.length < 30000)
                        continue;
                    player.queue.add(track);
                }
            else {
                if (tracks[0].length < 30000 && !client.owners.includes(ctx.author.id)) {
                    await waitEmbed.edit({
                        embeds: [
                            client
                                .embed()
                                .desc(`${client.emoji.cross} ${client.t('play.tooShort')}`),
                        ],
                    });
                    return;
                }
                player.queue.add(tracks[0]);
            }
            const description = result.type === 'PLAYLIST' ?
                `${client.emoji.check} ${client.t('play.addedPlaylist', { count: tracks.length, name: result.playlistName })}`
                : `${client.emoji.check} ${client.t('play.addedTrack', { title: tracks[0].title })}`;
            if (!player.playing && !player.paused)
                player.play();
            await waitEmbed.edit({
                embeds: [client.embed().desc(description)],
            });
        };
    }
}
/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
