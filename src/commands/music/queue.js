import _ from 'lodash';
import { paginator } from '../../utils/paginator.js';
import { Command } from '../../classes/abstract/command.js';

export default class Queue extends Command {
    constructor() {
        super(...arguments);
        this.playing = true;
        this.inSameVC = true;
        this.aliases = ['q'];
        this.description = 'Get player queue';
        this.execute = async (client, ctx) => {
            const player = client.getPlayer(ctx);
            const current = player.queue.current;
            const previous = player.queue.previous;
            const upcoming = [...player.queue];
            
            const totalDuration = upcoming.reduce((acc, t) => acc + (t.length || 0), 0) + (current?.length || 0);
            const totalTracks = previous.length + 1 + upcoming.length;

            // Format queue items with cute styling
            const formatTrack = async (track, index, isCurrent = false, isPrevious = false) => {
                const duration = track.isStream ? `🔴 ${await client.t(ctx.author.id, 'common.live')}` : client.formatDuration(track.length);
                const title = track.title.length > 35 ? track.title.substring(0, 32) + '...' : track.title;
                
                if (isCurrent) {
                    return `**▶️ ${index}. ${title}**\n└ \`${duration}\` • *${await client.t(ctx.author.id, 'common.nowPlaying')}* 🎵`;
                }
                if (isPrevious) {
                    return `~~${index}. ${title}~~\n└ \`${duration}\` • *${await client.t(ctx.author.id, 'common.alreadyPlayed')}* ✨`;
                }
                return `${index}. ${title}\n└ \`${duration}\` • *${await client.t(ctx.author.id, 'common.upNext')}* 🎶`;
            };

            // Build queue list
            const queueList = [];
            
            // Previous tracks
            for (let i = 0; i < previous.length; i++) {
                queueList.push(await formatTrack(previous[i], i, false, true));
            }
            
            // Current track
            if (current) {
                queueList.push(await formatTrack(current, previous.length, true));
            }
            
            // Upcoming tracks
            for (let i = 0; i < upcoming.length; i++) {
                queueList.push(await formatTrack(upcoming[i], previous.length + 1 + i));
            }

            const chunked = _.chunk(queueList, 8);
            const pages = await Promise.all(chunked.map(async (chunk, pageIndex) => 
                client.embed('#FF69B4')
                    .setAuthor({
                        name: `🎵 ${await client.t(ctx.author.id, 'queue.title', { bot: client.user.username })}`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setThumbnail(current?.thumbnail || client.user.displayAvatarURL())
                    .desc(
                        `${await client.t(ctx.author.id, 'queue.description')} 💕\n\n` +
                        await client.t(ctx.author.id, 'queue.totalTracks', { 
                            count: totalTracks, 
                            s: totalTracks !== 1 ? 's' : '', 
                            duration: client.formatDuration(totalDuration) 
                        }) + ' 🎧\n\n' +
                        chunk.join('\n\n')
                    )
                    .footer({
                        text: `💖 ${await client.t(ctx.author.id, 'queue.pageInfo', { 
                            current: pageIndex + 1, 
                            total: chunked.length, 
                            loop: player.loop || await client.t(ctx.author.id, 'common.off'), 
                            volume: player.volume 
                        })}`,
                        iconURL: ctx.author.displayAvatarURL()
                    })
                    .setTimestamp()
            ));

            await paginator(ctx, pages, Math.floor(previous.length / 8) || 0);
        };
    }
}
