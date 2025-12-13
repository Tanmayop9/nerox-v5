import { Command } from '../../classes/abstract/command.js';

export default class AnalyticsCommand extends Command {
    constructor() {
        super(...arguments);
        this.aliases = ['insights', 'usage', 'patterns'];
        this.description = 'View advanced usage analytics and insights';
        this.owner = true;
    }

    async execute(client, ctx, args) {
        const subcommand = args[0]?.toLowerCase();

        switch (subcommand) {
            case 'summary':
                return this.showSummary(client, ctx);
            case 'peak':
            case 'hours':
                return this.showPeakHours(client, ctx);
            case 'users':
                return this.showTopUsers(client, ctx);
            case 'guilds':
                return this.showTopGuilds(client, ctx);
            case 'user':
                return this.showUserInsights(client, ctx, args[1]);
            case 'guild':
                return this.showGuildInsights(client, ctx, args[1]);
            case 'session':
                return this.showSessionStats(client, ctx);
            default:
                return this.showOverview(client, ctx);
        }
    }

    async showOverview(client, ctx) {
        const summary = client.analytics.getSummary();

        const embed = client.embed()
            .setAuthor({ 
                name: '📊 Analytics Overview',
                iconURL: client.user.displayAvatarURL()
            })
            .desc(
                `**Session Statistics**\n` +
                `${client.emoji.info1} Duration: \`${summary.session.duration.formatted}\`\n` +
                `${client.emoji.info1} Total Commands: \`${summary.session.totalCommands}\`\n` +
                `${client.emoji.info1} Unique Users: \`${summary.session.uniqueUsers}\`\n` +
                `${client.emoji.info1} Unique Guilds: \`${summary.session.uniqueGuilds}\`\n` +
                `${client.emoji.info1} Commands/Min: \`${summary.session.commandsPerMinute.toFixed(2)}\`\n\n` +
                `**Peak Hours (Top 3)**\n` +
                summary.peakHours.slice(0, 3).map((h, i) => 
                    `${i + 1}. Hour \`${h.hour}:00\` - \`${h.count}\` commands`
                ).join('\n') + '\n\n' +
                `**Commands Available:**\n` +
                `\`summary\`, \`peak\`, \`users\`, \`guilds\`, \`user\`, \`guild\`, \`session\`\n\n` +
                `Usage: \`${client.prefix}analytics <command>\``
            );

        await ctx.reply({ embeds: [embed] });
    }

    async showSummary(client, ctx) {
        const summary = client.analytics.getSummary();

        const embed = client.embed()
            .setAuthor({ 
                name: '📊 Analytics Summary',
                iconURL: client.user.displayAvatarURL()
            })
            .addFields([
                {
                    name: '⏱️ Session Statistics',
                    value: 
                        `Duration: \`${summary.session.duration.formatted}\`\n` +
                        `Total Commands: \`${summary.session.totalCommands}\`\n` +
                        `Commands/Min: \`${summary.session.commandsPerMinute.toFixed(2)}\`\n` +
                        `Avg per User: \`${summary.session.averageCommandsPerUser.toFixed(2)}\``,
                },
                {
                    name: '👥 User Statistics',
                    value: 
                        `Unique Users: \`${summary.session.uniqueUsers}\`\n` +
                        `Unique Guilds: \`${summary.session.uniqueGuilds}\``,
                },
                {
                    name: '🏆 Top Users',
                    value: summary.topUsers.length > 0
                        ? summary.topUsers.map((u, i) => 
                            `${i + 1}. <@${u.userId}> - \`${u.count}\` commands`
                          ).join('\n')
                        : 'No data',
                    inline: true,
                },
                {
                    name: '🌐 Top Guilds',
                    value: summary.topGuilds.length > 0
                        ? summary.topGuilds.map((g, i) => 
                            `${i + 1}. \`${g.guildId}\` - \`${g.count}\` commands`
                          ).join('\n')
                        : 'No data',
                    inline: true,
                },
            ]);

        await ctx.reply({ embeds: [embed] });
    }

    async showPeakHours(client, ctx) {
        const peakHours = client.analytics.getPeakHours();

        if (peakHours.length === 0) {
            return ctx.reply({
                embeds: [client.embed().desc('No usage data available yet.')]
            });
        }

        const description = peakHours.map((h, i) => 
            `**${i + 1}. Hour ${h.hour}:00 - ${(h.hour + 1) % 24}:00**\n` +
            `${client.emoji.info1} Commands: \`${h.count}\``
        ).join('\n\n');

        const embed = client.embed()
            .setAuthor({ 
                name: '⏰ Peak Usage Hours',
                iconURL: client.user.displayAvatarURL()
            })
            .desc(description);

        await ctx.reply({ embeds: [embed] });
    }

    async showTopUsers(client, ctx) {
        const topUsers = client.analytics.getMostActiveUsers(15);

        if (topUsers.length === 0) {
            return ctx.reply({
                embeds: [client.embed().desc('No user data available yet.')]
            });
        }

        const description = topUsers.map((u, i) => 
            `**${i + 1}. <@${u.userId}>**\n` +
            `${client.emoji.info1} Commands: \`${u.count}\`\n` +
            `${client.emoji.info1} Last Seen: <t:${Math.floor(u.lastSeen / 1000)}:R>`
        ).join('\n\n');

        const embed = client.embed()
            .setAuthor({ 
                name: '👥 Most Active Users',
                iconURL: client.user.displayAvatarURL()
            })
            .desc(description);

        await ctx.reply({ embeds: [embed] });
    }

    async showTopGuilds(client, ctx) {
        const topGuilds = client.analytics.getMostActiveGuilds(15);

        if (topGuilds.length === 0) {
            return ctx.reply({
                embeds: [client.embed().desc('No guild data available yet.')]
            });
        }

        const description = await Promise.all(
            topGuilds.map(async (g, i) => {
                const guild = await client.guilds.fetch(g.guildId).catch(() => null);
                const name = guild ? guild.name : `Unknown (${g.guildId})`;
                return `**${i + 1}. ${name}**\n` +
                    `${client.emoji.info1} Commands: \`${g.count}\`\n` +
                    `${client.emoji.info1} Last Active: <t:${Math.floor(g.lastSeen / 1000)}:R>`;
            })
        );

        const embed = client.embed()
            .setAuthor({ 
                name: '🌐 Most Active Guilds',
                iconURL: client.user.displayAvatarURL()
            })
            .desc(description.join('\n\n'));

        await ctx.reply({ embeds: [embed] });
    }

    async showUserInsights(client, ctx, userId) {
        userId = userId || ctx.author.id;
        const insights = client.analytics.getUserInsights(userId);

        if (!insights) {
            return ctx.reply({
                embeds: [client.embed().desc(`No data available for <@${userId}>.`)]
            });
        }

        const embed = client.embed()
            .setAuthor({ 
                name: `👤 User Insights: ${userId}`,
                iconURL: client.user.displayAvatarURL()
            })
            .desc(
                `**Usage Statistics**\n` +
                `${client.emoji.info1} Total Commands: \`${insights.totalCommands}\`\n` +
                `${client.emoji.info1} Session Duration: \`${insights.sessionDuration}\`\n` +
                `${client.emoji.info1} Commands/Hour: \`${insights.commandsPerHour.toFixed(2)}\`\n\n` +
                `**Activity Timeline**\n` +
                `${client.emoji.info1} First Seen: \`${insights.firstSeen}\`\n` +
                `${client.emoji.info1} Last Seen: \`${insights.lastSeen}\``
            );

        await ctx.reply({ embeds: [embed] });
    }

    async showGuildInsights(client, ctx, guildId) {
        guildId = guildId || ctx.guild.id;
        const insights = client.analytics.getGuildInsights(guildId);

        if (!insights) {
            return ctx.reply({
                embeds: [client.embed().desc(`No data available for guild \`${guildId}\`.`)]
            });
        }

        const guild = await client.guilds.fetch(guildId).catch(() => null);
        const name = guild ? guild.name : guildId;

        const embed = client.embed()
            .setAuthor({ 
                name: `🌐 Guild Insights: ${name}`,
                iconURL: guild?.iconURL() || client.user.displayAvatarURL()
            })
            .desc(
                `**Usage Statistics**\n` +
                `${client.emoji.info1} Total Commands: \`${insights.totalCommands}\`\n\n` +
                `**Activity Timeline**\n` +
                `${client.emoji.info1} First Seen: \`${insights.firstSeen}\`\n` +
                `${client.emoji.info1} Last Seen: \`${insights.lastSeen}\``
            );

        await ctx.reply({ embeds: [embed] });
    }

    async showSessionStats(client, ctx) {
        const stats = client.analytics.getSessionStats();

        const embed = client.embed()
            .setAuthor({ 
                name: '⏱️ Session Statistics',
                iconURL: client.user.displayAvatarURL()
            })
            .desc(
                `**Session Information**\n` +
                `${client.emoji.info1} Duration: \`${stats.duration.formatted}\`\n` +
                `${client.emoji.info1} Total Commands: \`${stats.totalCommands}\`\n` +
                `${client.emoji.info1} Unique Users: \`${stats.uniqueUsers}\`\n` +
                `${client.emoji.info1} Unique Guilds: \`${stats.uniqueGuilds}\`\n\n` +
                `**Performance Metrics**\n` +
                `${client.emoji.info1} Commands/Minute: \`${stats.commandsPerMinute.toFixed(2)}\`\n` +
                `${client.emoji.info1} Avg Commands/User: \`${stats.averageCommandsPerUser.toFixed(2)}\`\n\n` +
                `**Efficiency**\n` +
                `${client.emoji.info1} User Engagement: \`${stats.uniqueUsers > 0 ? ((stats.totalCommands / stats.uniqueUsers) * 100).toFixed(2) : 0}%\``
            );

        await ctx.reply({ embeds: [embed] });
    }
}

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
