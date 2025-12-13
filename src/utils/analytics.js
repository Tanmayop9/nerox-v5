/**
 * Advanced Analytics System
 * Tracks usage patterns and provides insights
 * @author NeroX Ultra Advanced System
 */

export class Analytics {
    constructor(client) {
        this.client = client;
        this.sessionStart = Date.now();
        this.commandPatterns = new Map();
        this.userActivity = new Map();
        this.guildActivity = new Map();
    }

    /**
     * Track command usage
     * @param {string} userId - User ID
     * @param {string} guildId - Guild ID
     * @param {string} commandName - Command name
     */
    trackCommand(userId, guildId, commandName) {
        const hour = new Date().getHours();
        const key = `${hour}:${commandName}`;
        
        // Command patterns by hour
        const current = this.commandPatterns.get(key) || 0;
        this.commandPatterns.set(key, current + 1);

        // User activity
        this.updateActivityMap(this.userActivity, userId);
        
        // Guild activity
        this.updateActivityMap(this.guildActivity, guildId);
    }

    /**
     * Update activity map
     * @param {Map} map - Activity map
     * @param {string} id - ID to update
     */
    updateActivityMap(map, id) {
        const activity = map.get(id) || {
            count: 0,
            lastSeen: Date.now(),
            firstSeen: Date.now(),
        };
        
        activity.count++;
        activity.lastSeen = Date.now();
        map.set(id, activity);
    }

    /**
     * Get peak usage hours
     * @returns {Array} Peak hours with command counts
     */
    getPeakHours() {
        const hourlyStats = new Map();
        
        for (const [key, count] of this.commandPatterns.entries()) {
            const hour = parseInt(key.split(':')[0]);
            hourlyStats.set(hour, (hourlyStats.get(hour) || 0) + count);
        }

        return Array.from(hourlyStats.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([hour, count]) => ({ hour, count }));
    }

    /**
     * Get most popular commands by hour
     * @param {number} hour - Hour (0-23)
     * @returns {Array} Popular commands
     */
    getPopularCommandsByHour(hour) {
        const commands = new Map();
        
        for (const [key, count] of this.commandPatterns.entries()) {
            const [h, cmd] = key.split(':');
            if (parseInt(h) === hour) {
                commands.set(cmd, count);
            }
        }

        return Array.from(commands.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, count]) => ({ name, count }));
    }

    /**
     * Get active users
     * @param {number} limit - Number of users to return
     * @returns {Array} Active users
     */
    getMostActiveUsers(limit = 10) {
        return Array.from(this.userActivity.entries())
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, limit)
            .map(([userId, data]) => ({ userId, ...data }));
    }

    /**
     * Get active guilds
     * @param {number} limit - Number of guilds to return
     * @returns {Array} Active guilds
     */
    getMostActiveGuilds(limit = 10) {
        return Array.from(this.guildActivity.entries())
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, limit)
            .map(([guildId, data]) => ({ guildId, ...data }));
    }

    /**
     * Get session statistics
     * @returns {Object} Session stats
     */
    getSessionStats() {
        const now = Date.now();
        const duration = now - this.sessionStart;
        
        const totalCommands = Array.from(this.commandPatterns.values())
            .reduce((sum, count) => sum + count, 0);

        return {
            duration: {
                ms: duration,
                formatted: this.formatDuration(duration),
            },
            totalCommands,
            uniqueUsers: this.userActivity.size,
            uniqueGuilds: this.guildActivity.size,
            commandsPerMinute: totalCommands / (duration / 60000),
            averageCommandsPerUser: totalCommands / this.userActivity.size || 0,
        };
    }

    /**
     * Get user insights
     * @param {string} userId - User ID
     * @returns {Object} User insights
     */
    getUserInsights(userId) {
        const activity = this.userActivity.get(userId);
        if (!activity) return null;

        const duration = activity.lastSeen - activity.firstSeen;
        
        return {
            totalCommands: activity.count,
            firstSeen: new Date(activity.firstSeen).toISOString(),
            lastSeen: new Date(activity.lastSeen).toISOString(),
            sessionDuration: this.formatDuration(duration),
            commandsPerHour: duration > 0 ? (activity.count / (duration / 3600000)) : 0,
        };
    }

    /**
     * Get guild insights
     * @param {string} guildId - Guild ID
     * @returns {Object} Guild insights
     */
    getGuildInsights(guildId) {
        const activity = this.guildActivity.get(guildId);
        if (!activity) return null;

        return {
            totalCommands: activity.count,
            firstSeen: new Date(activity.firstSeen).toISOString(),
            lastSeen: new Date(activity.lastSeen).toISOString(),
        };
    }

    /**
     * Format duration
     * @param {number} ms - Milliseconds
     * @returns {string} Formatted duration
     */
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    /**
     * Reset analytics
     */
    reset() {
        this.sessionStart = Date.now();
        this.commandPatterns.clear();
        this.userActivity.clear();
        this.guildActivity.clear();
    }

    /**
     * Get analytics summary
     * @returns {Object} Analytics summary
     */
    getSummary() {
        return {
            session: this.getSessionStats(),
            peakHours: this.getPeakHours().slice(0, 5),
            topUsers: this.getMostActiveUsers(5),
            topGuilds: this.getMostActiveGuilds(5),
        };
    }
}

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
