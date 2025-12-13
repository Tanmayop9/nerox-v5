
import moment from 'moment';

export const execute = async (ctx, command, args) => {
    if (!ctx || !ctx.guild || !ctx.channel || !ctx.author) {
        console.error("ctx is missing required properties!", ctx);
        return;
    }

    const { client } = ctx;

    try {
        if (!command || !command.execute) {
            console.error(`Command ${command?.name || 'Unknown'} is not executable.`);
            return;
        }

        // 🚀 Ultra Advanced: Rate limiting check
        const rateCheck = await client.rateLimiter.check(client, ctx.author.id, 'command');
        if (rateCheck.limited) {
            return ctx.reply({
                embeds: [
                    client.embed('#FF6B6B')
                        .desc(
                            `${client.emoji.cross} **Rate Limit Exceeded**\n\n` +
                            `You're sending commands too fast! Please slow down.\n` +
                            `Try again in **${Math.ceil(rateCheck.resetIn / 1000)}s**\n\n` +
                            `Your tier: \`${rateCheck.tier.toUpperCase()}\` (${rateCheck.limit} commands per 10s)`
                        )
                ]
            }).catch(() => {});
        }

        // 🚀 Ultra Advanced: Performance monitoring
        const endTiming = client.performanceMonitor.startTiming(`command:${command.name}`);
        const startTime = Date.now();
        let success = true;

        try {
            await command.execute(client, ctx, args);
        } catch (error) {
            success = false;
            client.performanceMonitor.recordError('command', error);
            throw error;
        } finally {
            const duration = endTiming();
            client.performanceMonitor.recordCommand(command.name, duration, success);
            
            // 🚀 Ultra Advanced: Track analytics
            client.analytics.trackCommand(ctx.author.id, ctx.guild.id, command.name);
        }

        const date = moment().tz('Asia/Kolkata').format('DD-MM-YYYY');

        await Promise.all([
            client.db.stats.commandsUsed.set(date, ((await client.db.stats.commandsUsed.get(date)) ?? 0) + 1),
            client.db.stats.commandsUsed.set('total', ((await client.db.stats.commandsUsed.get('total')) ?? 0) + 1),
            client.db.stats.commandsUsed.set(ctx.guild.id, ((await client.db.stats.commandsUsed.get(ctx.guild.id)) ?? 0) + 1),
            client.db.stats.commandsUsed.set(ctx.author.id, ((await client.db.stats.commandsUsed.get(ctx.author.id)) ?? 0) + 1),
        ]).catch((err) => console.error("Failed to update stats:", err));

        if (client.webhooks?.logs) {
            await client.webhooks.logs.send({
                username: `Command-logs`,
                avatarURL: client.user?.displayAvatarURL(),
                embeds: [
                    client.embed()
                        .desc(`${client.emoji.info} **Command \`${command.name}\` used**\n\n` +
                            `${client.emoji.info} **Content:** ${ctx.content}\n` +
                            `${client.emoji.info} **User:** ${ctx.author.tag} \`[${ctx.author.id}]\`\n` +
                            `${client.emoji.info} **Guild:** ${ctx.guild.name} \`[${ctx.guild.id}]\`\n` +
                            `${client.emoji.info} **Channel:** ${ctx.channel.name} \`[${ctx.channel.id}]\``),
                ],
            }).catch((err) => console.error("Failed to send command log:", err));
        } else {
            console.error("Webhook cmdLogs is undefined!");
        }
    } catch (err) {
        console.error(`Error executing command ${command?.name || 'Unknown'}:`, err);
    }
};

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */