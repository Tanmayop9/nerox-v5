/**
 * Advanced Rate Limiter with Tiered Limits
 * Supports different limits for different user tiers
 * @author NeroX Ultra Advanced System
 */

export class AdvancedRateLimiter {
    constructor(options = {}) {
        this.limits = new Map();
        this.tiers = {
            default: {
                requests: options.defaultRequests || 5,
                window: options.defaultWindow || 10000, // 10 seconds
            },
            premium: {
                requests: options.premiumRequests || 15,
                window: options.premiumWindow || 10000,
            },
            owner: {
                requests: options.ownerRequests || 100,
                window: options.ownerWindow || 10000,
            },
        };
    }

    /**
     * Get user tier
     * @param {Object} client - Bot client
     * @param {string} userId - User ID
     * @returns {string} User tier
     */
    async getUserTier(client, userId) {
        if (client.owners.includes(userId)) return 'owner';
        
        const isPremium = await client.db.botstaff.has(userId);
        return isPremium ? 'premium' : 'default';
    }

    /**
     * Check if user is rate limited
     * @param {Object} client - Bot client
     * @param {string} userId - User ID
     * @param {string} action - Action being performed
     * @returns {Object} Rate limit result
     */
    async check(client, userId, action = 'command') {
        const tier = await this.getUserTier(client, userId);
        const config = this.tiers[tier];
        const key = `${userId}:${action}`;
        
        const now = Date.now();
        let record = this.limits.get(key);

        // Clean up old records
        if (record && now - record.windowStart > config.window) {
            record = null;
        }

        if (!record) {
            record = {
                count: 0,
                windowStart: now,
                tier,
            };
            this.limits.set(key, record);
        }

        record.count++;

        const limited = record.count > config.requests;
        const remaining = Math.max(0, config.requests - record.count);
        const resetAt = record.windowStart + config.window;

        return {
            limited,
            remaining,
            resetAt,
            resetIn: Math.max(0, resetAt - now),
            tier,
            limit: config.requests,
        };
    }

    /**
     * Reset rate limit for a user
     * @param {string} userId - User ID
     * @param {string} action - Action to reset
     */
    reset(userId, action = 'command') {
        const key = `${userId}:${action}`;
        this.limits.delete(key);
    }

    /**
     * Cleanup old entries
     */
    cleanup() {
        const now = Date.now();
        for (const [key, record] of this.limits.entries()) {
            const tier = this.tiers[record.tier] || this.tiers.default;
            if (now - record.windowStart > tier.window * 2) {
                this.limits.delete(key);
            }
        }
    }

    /**
     * Get rate limit info for user
     * @param {Object} client - Bot client
     * @param {string} userId - User ID
     * @param {string} action - Action type
     * @returns {Object} Rate limit info
     */
    async getInfo(client, userId, action = 'command') {
        const tier = await this.getUserTier(client, userId);
        const config = this.tiers[tier];
        const key = `${userId}:${action}`;
        const record = this.limits.get(key);

        if (!record || Date.now() - record.windowStart > config.window) {
            return {
                tier,
                limit: config.requests,
                remaining: config.requests,
                used: 0,
            };
        }

        return {
            tier,
            limit: config.requests,
            remaining: Math.max(0, config.requests - record.count),
            used: record.count,
        };
    }

    /**
     * Get statistics
     * @returns {Object} Rate limiter stats
     */
    getStats() {
        const stats = {
            totalKeys: this.limits.size,
            byTier: { default: 0, premium: 0, owner: 0 },
        };

        for (const record of this.limits.values()) {
            stats.byTier[record.tier] = (stats.byTier[record.tier] || 0) + 1;
        }

        return stats;
    }
}

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
