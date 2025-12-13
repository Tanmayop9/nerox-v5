import { Command } from '../../classes/abstract/command.js';

export default class Metrics extends Command {
    constructor() {
        super(...arguments);
        this.aliases = ['perf', 'performance', 'stats-advanced'];
        this.description = 'View ultra-advanced system metrics and performance data';
        this.owner = true;
    }

    async execute(client, ctx, args) {
        const subcommand = args[0]?.toLowerCase();

        switch (subcommand) {
            case 'cache':
                return this.showCacheStats(client, ctx);
            case 'queue':
                return this.showQueueStats(client, ctx);
            case 'circuit':
                return this.showCircuitBreakerStats(client, ctx);
            case 'performance':
            case 'perf':
                return this.showPerformanceStats(client, ctx);
            case 'health':
                return this.showHealth(client, ctx);
            case 'commands':
                return this.showTopCommands(client, ctx);
            case 'slow':
                return this.showSlowOperations(client, ctx);
            default:
                return this.showOverview(client, ctx);
        }
    }

    async showOverview(client, ctx) {
        const cache = client.cache.getStats();
        const queue = client.requestQueue.getStats();
        const health = client.performanceMonitor.getHealth();
        const system = client.performanceMonitor.getSystemMetrics();

        const embed = client.embed()
            .setAuthor({ 
                name: '🚀 Ultra Advanced System Metrics',
                iconURL: client.user.displayAvatarURL()
            })
            .desc(
                `**System Health:** ${this.getHealthEmoji(health.status)} \`${health.status.toUpperCase()}\`\n` +
                `**Uptime:** ${system.uptime.formatted}\n\n` +
                `**Cache Statistics**\n` +
                `${client.emoji.info1} Size: \`${cache.size}\` / \`5000\`\n` +
                `${client.emoji.info1} Hit Rate: \`${cache.hitRate}\`\n` +
                `${client.emoji.info1} Hits: \`${cache.hits}\` | Misses: \`${cache.misses}\`\n\n` +
                `**Request Queue**\n` +
                `${client.emoji.info1} Queue Length: \`${queue.queueLength}\`\n` +
                `${client.emoji.info1} Running: \`${queue.running}\` / \`50\`\n` +
                `${client.emoji.info1} Processed: \`${queue.processed}\`\n\n` +
                `**Memory Usage**\n` +
                `${client.emoji.info1} Heap: \`${system.memory.heapUsed}MB\` / \`${system.memory.heapLimit}MB\` (${health.memoryUsage}%)\n` +
                `${client.emoji.info1} RSS: \`${system.memory.rss}MB\`\n\n` +
                `**Commands Available:**\n` +
                `\`cache\`, \`queue\`, \`circuit\`, \`performance\`, \`health\`, \`commands\`, \`slow\`\n\n` +
                `Usage: \`${client.prefix}metrics <command>\``
            )
            .footer({ text: `Error Count: ${health.errorCount}` });

        await ctx.reply({ embeds: [embed] });
    }

    async showCacheStats(client, ctx) {
        const stats = client.cache.getStats();
        const rateLimiterStats = client.rateLimiter.getStats();

        const embed = client.embed()
            .setAuthor({ name: '📦 Cache Statistics', iconURL: client.user.displayAvatarURL() })
            .desc(
                `**Advanced Cache System**\n` +
                `${client.emoji.info1} Size: \`${stats.size}\` / \`5000\` entries\n` +
                `${client.emoji.info1} Hit Rate: \`${stats.hitRate}\`\n` +
                `${client.emoji.info1} Total Requests: \`${stats.hits + stats.misses}\`\n` +
                `${client.emoji.info1} Cache Hits: \`${stats.hits}\`\n` +
                `${client.emoji.info1} Cache Misses: \`${stats.misses}\`\n` +
                `${client.emoji.info1} Sets: \`${stats.sets}\`\n` +
                `${client.emoji.info1} Evictions: \`${stats.evictions}\`\n\n` +
                `**Rate Limiter**\n` +
                `${client.emoji.info1} Total Keys: \`${rateLimiterStats.totalKeys}\`\n` +
                `${client.emoji.info1} Default Tier: \`${rateLimiterStats.byTier.default}\`\n` +
                `${client.emoji.info1} Premium Tier: \`${rateLimiterStats.byTier.premium}\`\n` +
                `${client.emoji.info1} Owner Tier: \`${rateLimiterStats.byTier.owner}\``
            );

        await ctx.reply({ embeds: [embed] });
    }

    async showQueueStats(client, ctx) {
        const stats = client.requestQueue.getStats();
        const avgWaitTime = client.requestQueue.getAverageWaitTime();

        const embed = client.embed()
            .setAuthor({ name: '⏱️ Request Queue Statistics', iconURL: client.user.displayAvatarURL() })
            .desc(
                `**Queue Status**\n` +
                `${client.emoji.info1} Queue Length: \`${stats.queueLength}\` requests\n` +
                `${client.emoji.info1} Running: \`${stats.running}\` / \`50\` concurrent\n` +
                `${client.emoji.info1} Avg Wait Time: \`${avgWaitTime}ms\`\n\n` +
                `**Statistics**\n` +
                `${client.emoji.info1} Total Queued: \`${stats.queued}\`\n` +
                `${client.emoji.info1} Processed: \`${stats.processed}\`\n` +
                `${client.emoji.info1} Failed: \`${stats.failed}\`\n` +
                `${client.emoji.info1} Timeouts: \`${stats.timeout}\`\n\n` +
                `**Success Rate:** \`${stats.processed > 0 ? ((stats.processed / (stats.processed + stats.failed)) * 100).toFixed(2) : 100}%\``
            );

        await ctx.reply({ embeds: [embed] });
    }

    async showCircuitBreakerStats(client, ctx) {
        const breakers = {};
        for (const [name, cb] of Object.entries(client.circuitBreakers)) {
            breakers[name] = cb.getStats();
        }

        const fields = Object.entries(breakers).map(([name, stats]) => ({
            name: `${this.getCircuitEmoji(stats.state)} ${name.toUpperCase()}`,
            value: 
                `State: \`${stats.state}\`\n` +
                `Total Calls: \`${stats.totalCalls}\`\n` +
                `Successful: \`${stats.successfulCalls}\`\n` +
                `Failed: \`${stats.failedCalls}\`\n` +
                `Rejected: \`${stats.rejectedCalls}\``,
            inline: true,
        }));

        const embed = client.embed()
            .setAuthor({ name: '🔌 Circuit Breaker Status', iconURL: client.user.displayAvatarURL() })
            .desc('Circuit breakers prevent cascading failures by temporarily stopping requests to failing services.')
            .addFields(fields);

        await ctx.reply({ embeds: [embed] });
    }

    async showPerformanceStats(client, ctx) {
        const metrics = client.performanceMonitor.getMetrics();
        const system = metrics.system;

        const embed = client.embed()
            .setAuthor({ name: '⚡ Performance Metrics', iconURL: client.user.displayAvatarURL() })
            .desc(
                `**System Information**\n` +
                `${client.emoji.info1} Platform: \`${system.system.platform}\` (\`${system.system.arch}\`)\n` +
                `${client.emoji.info1} Uptime: \`${system.uptime.formatted}\`\n\n` +
                `**Memory Usage**\n` +
                `${client.emoji.info1} Heap Used: \`${system.memory.heapUsed}MB\`\n` +
                `${client.emoji.info1} Heap Total: \`${system.memory.heapTotal}MB\`\n` +
                `${client.emoji.info1} Heap Limit: \`${system.memory.heapLimit}MB\`\n` +
                `${client.emoji.info1} RSS: \`${system.memory.rss}MB\`\n` +
                `${client.emoji.info1} External: \`${system.memory.external}MB\`\n\n` +
                `**System Resources**\n` +
                `${client.emoji.info1} Free Memory: \`${system.system.freeMem}MB\` / \`${system.system.totalMem}MB\`\n` +
                `${client.emoji.info1} CPU User: \`${system.cpu.user}ms\`\n` +
                `${client.emoji.info1} CPU System: \`${system.cpu.system}ms\`\n` +
                `${client.emoji.info1} Load Avg: \`${system.system.loadAvg.map(l => l.toFixed(2)).join(', ')}\``
            );

        await ctx.reply({ embeds: [embed] });
    }

    async showHealth(client, ctx) {
        const health = await client.healthCheck.runChecks();

        const fields = Object.entries(health.checks).map(([name, check]) => ({
            name: `${this.getHealthEmoji(check.status)} ${name.toUpperCase()}`,
            value: check.error || `\`${check.status}\` (${check.duration}ms)`,
            inline: true,
        }));

        const embed = client.embed()
            .setAuthor({ name: '💚 Health Check Status', iconURL: client.user.displayAvatarURL() })
            .desc(`**Overall Status:** ${this.getHealthEmoji(health.status)} \`${health.status.toUpperCase()}\``)
            .addFields(fields)
            .footer({ text: `Checked at ${health.timestamp} (${health.duration}ms)` });

        await ctx.reply({ embeds: [embed] });
    }

    async showTopCommands(client, ctx) {
        const topCommands = client.performanceMonitor.getTopCommands(15);

        if (topCommands.length === 0) {
            return ctx.reply({
                embeds: [client.embed().desc('No command data available yet.')]
            });
        }

        const description = topCommands.map((cmd, i) => 
            `**${i + 1}.** \`${cmd.name}\`\n` +
            `${client.emoji.info1} Uses: \`${cmd.count}\` | Avg: \`${Math.round(cmd.avgDuration)}ms\`\n` +
            `${client.emoji.info1} Min: \`${cmd.minDuration}ms\` | Max: \`${cmd.maxDuration}ms\`\n` +
            `${client.emoji.info1} Failures: \`${cmd.failures}\``
        ).join('\n\n');

        const embed = client.embed()
            .setAuthor({ name: '🏆 Top Commands', iconURL: client.user.displayAvatarURL() })
            .desc(description);

        await ctx.reply({ embeds: [embed] });
    }

    async showSlowOperations(client, ctx) {
        const slowOps = client.performanceMonitor.getSlowOperations(500);

        if (slowOps.length === 0) {
            return ctx.reply({
                embeds: [client.embed().desc('No slow operations detected (threshold: 500ms).')]
            });
        }

        const description = slowOps.slice(0, 10).map((op, i) => 
            `**${i + 1}.** \`${op.category}/${op.name}\`\n` +
            `${client.emoji.info1} Max Duration: \`${op.maxDuration}ms\`\n` +
            `${client.emoji.info1} Avg Duration: \`${op.avgDuration}ms\``
        ).join('\n\n');

        const embed = client.embed()
            .setAuthor({ name: '🐌 Slow Operations', iconURL: client.user.displayAvatarURL() })
            .desc(description)
            .footer({ text: `Showing top ${Math.min(10, slowOps.length)} of ${slowOps.length} slow operations` });

        await ctx.reply({ embeds: [embed] });
    }

    getHealthEmoji(status) {
        switch (status.toLowerCase()) {
            case 'healthy': return '✅';
            case 'warning': return '⚠️';
            case 'critical': return '🔴';
            case 'unhealthy': return '❌';
            case 'error': return '❌';
            default: return '❓';
        }
    }

    getCircuitEmoji(state) {
        switch (state) {
            case 'CLOSED': return '✅';
            case 'HALF_OPEN': return '⚠️';
            case 'OPEN': return '🔴';
            default: return '❓';
        }
    }
}

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
