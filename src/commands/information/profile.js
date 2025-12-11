/**
 * @fuego v1.0.0
 * @author painfuego (www.codes-for.fun)
 * @copyright 2024 1sT - Services | CC BY-NC-SA 4.0
 */
import { paginator } from '../../utils/paginator.js';
import { Command } from '../../classes/abstract/command.js';
import { getPrefix } from '../../utils/getPrefix.js';

export default class Profile extends Command {
    constructor() {
        super(...arguments);
        this.aliases = ['pr'];
        this.description = 'Shows user profile';
        this.execute = async (client, ctx) => {
            const prefix = await getPrefix(client, ctx.guild.id);
            let [commandsUsed, songsPlayed, likedSongs, spotifyData, afkData, premiumData] = await Promise.all([
                client.db.stats.commandsUsed.get(ctx.author.id),
                client.db.stats.songsPlayed.get(ctx.author.id),
                client.db.likedSongs.get(ctx.author.id),
                client.db.spotify.get(ctx.author.id),
                client.db.afk.get(ctx.author.id),
                client.db.botstaff.get(ctx.author.id),
            ]);
            songsPlayed ||= 0;
            commandsUsed ||= 0;
            likedSongs ||= [];
            // Calculate user level and progress
            const totalActivity = commandsUsed + songsPlayed;
            const level = Math.floor(totalActivity / 50) + 1;
            const nextLevelProgress = totalActivity % 50;
            const progressBar = this.generateProgressBar(nextLevelProgress, 50);

            // Calculate account age
            const accountAge = Math.floor((Date.now() - ctx.author.createdTimestamp) / (1000 * 60 * 60 * 24));

            // Achievements and Badges
            const challenges = {
                commands: {
                    'Basic user': 10,
                    'Junior user': 50,
                    'Senior user': 100,
                    'Master user': 500,
                    'Unhinged user': 1000,
                },
                songs: {
                    'Basic listener': 10,
                    'Junior listener': 50,
                    'Senior listener': 100,
                    'Master listener': 500,
                    'Unhinged listener': 1000,
                },
            };
            const achievements = {
                commands: Object.entries(challenges.commands).map(([name, count]) =>
                    commandsUsed >= count
                        ? `<:neroxCheck:1446475406864683222> ${name} ( ${count} / ${count} )`
                        : `<:NeroxNope:1446475361494765639> ${name} ( ${commandsUsed} / ${count} )`
                ),
                songs: Object.entries(challenges.songs).map(([name, count]) =>
                    songsPlayed >= count
                        ? `<:neroxCheck:1446475406864683222> ${name} ( ${count} / ${count} )`
                        : `<:NeroxNope:1446475361494765639> ${name} ( ${songsPlayed} / ${count} )`
                ),
            };

            const badges = [];
            if (client.owners.includes(ctx.author.id) || client.admins.includes(ctx.author.id) || (await client.db.noPrefix.has(ctx.author.id)))
                badges.push('<:neroxinfo:1446475383481303052> No Prefix');
            if (ctx.author.id === '1056087251068649522')
                badges.push('<:neroxinfo:1446475383481303052> Developer');
            if (client.admins.includes(ctx.author.id))
                badges.push('<:neroxinfo:1446475383481303052> Admin');
            if (client.owners.includes(ctx.author.id))
                badges.push('<:neroxinfo:1446475383481303052> Owner');
            // Achievement based badges
            for (const [name, count] of Object.entries(challenges.commands)) {
                if (commandsUsed >= count) badges.push(name);
            }
            for (const [name, count] of Object.entries(challenges.songs)) {
                if (songsPlayed >= count) badges.push(name);
            }

            // Minimalist Embeds:
            const overviewEmbed = client.embed()
                .setAuthor({ name: `${ctx.author.username}'s Profile`, iconURL: ctx.author.displayAvatarURL() })
                .setThumbnail(ctx.author.displayAvatarURL({ size: 512 }))
                .setDescription(
                    `<:neroxinfo:1446475383481303052> Level: ${level} (Progress: ${progressBar} ${nextLevelProgress}/50)
<:neroxinfo:1446475383481303052> Commands Used: ${commandsUsed}
<:neroxinfo:1446475383481303052> Songs Played: ${songsPlayed}
<:neroxinfo:1446475383481303052> Liked Songs: ${likedSongs.length}
<:neroxinfo:1446475383481303052> Premium: ${premiumData ? 'Active' : 'Inactive'}
<:neroxinfo:1446475383481303052> AFK: ${afkData ? `Yes - ${afkData.reason}` : 'No'}
<:neroxinfo:1446475383481303052> Spotify: ${spotifyData ? 'Linked' : 'Not Linked'}
<:neroxinfo:1446475383481303052> Account Age: ${accountAge} days`
                )
                .setFooter({ text: `Page 1/3 • ${ctx.author.tag}` })
                .setTimestamp();

            const badgesEmbed = client.embed()
                .setAuthor({ name: `${ctx.author.username}'s Badges`, iconURL: ctx.author.displayAvatarURL() })
                .setThumbnail(ctx.author.displayAvatarURL({ size: 512 }))
                .setDescription(
                    badges.length ?
                        badges.join('\n')
                        : 'No badges yet.\nComplete achievements to earn badges. See the Achievements page to track progress.'
                )
                .setFooter({ text: `Page 2/3 • Total Badges: ${badges.length}` })
                .setTimestamp();

            const achievementsEmbed = client.embed()
                .setAuthor({ name: `${ctx.author.username}'s Achievements`, iconURL: ctx.author.displayAvatarURL() })
                .setThumbnail(ctx.author.displayAvatarURL({ size: 512 }))
                .setDescription(
                    `<:icono_:1446046474898112624> Commands:\n${achievements.commands.join('\n')}\n\n<:icono_:1446046474898112624> Songs:\n${achievements.songs.join('\n')}`
                )
                .setFooter({ text: `Page 3/3 • Progress` })
                .setTimestamp();

            // Music & Spotify details in the Profile page, not as a separate page (minimalism)

            await paginator(ctx, [overviewEmbed, badgesEmbed, achievementsEmbed]);
        };
    }

    generateProgressBar(current, max) {
        const filled = Math.floor((current / max) * 10);
        const empty = 10 - filled;
        return '█'.repeat(filled) + '░'.repeat(empty);
    }
}
/**@codeStyle - https://google.github.io/styleguide/tsguide.html */