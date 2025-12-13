/**
 * Advanced Health Check System
 * Monitors bot health and provides status endpoints
 * @author NeroX Ultra Advanced System
 */

import { createServer } from 'http';

export class HealthCheck {
    constructor(client, options = {}) {
        this.client = client;
        this.port = options.port || 3000;
        this.checks = new Map();
        this.server = null;
    }

    /**
     * Register a health check
     * @param {string} name - Check name
     * @param {Function} checkFn - Check function (returns boolean or throws)
     */
    register(name, checkFn) {
        this.checks.set(name, checkFn);
    }

    /**
     * Run all health checks
     * @returns {Object} Health check results
     */
    async runChecks() {
        const results = {};
        const startTime = Date.now();

        for (const [name, checkFn] of this.checks.entries()) {
            try {
                const checkStart = Date.now();
                const result = await checkFn(this.client);
                results[name] = {
                    status: result ? 'healthy' : 'unhealthy',
                    duration: Date.now() - checkStart,
                };
            } catch (error) {
                results[name] = {
                    status: 'error',
                    error: error.message,
                    duration: Date.now() - checkStart,
                };
            }
        }

        const overallHealthy = Object.values(results).every(r => r.status === 'healthy');

        return {
            status: overallHealthy ? 'healthy' : 'unhealthy',
            checks: results,
            timestamp: new Date().toISOString(),
            duration: Date.now() - startTime,
        };
    }

    /**
     * Start health check server
     */
    start() {
        this.server = createServer(async (req, res) => {
            res.setHeader('Content-Type', 'application/json');

            if (req.url === '/health') {
                const health = await this.runChecks();
                res.statusCode = health.status === 'healthy' ? 200 : 503;
                res.end(JSON.stringify(health, null, 2));
            } else if (req.url === '/metrics') {
                const metrics = this.client.performanceMonitor.getMetrics();
                res.statusCode = 200;
                res.end(JSON.stringify(metrics, null, 2));
            } else if (req.url === '/stats') {
                const stats = {
                    cache: this.client.cache.getStats(),
                    queue: this.client.requestQueue.getStats(),
                    circuitBreakers: Object.fromEntries(
                        Object.entries(this.client.circuitBreakers).map(
                            ([name, cb]) => [name, cb.getStats()]
                        )
                    ),
                    performance: this.client.performanceMonitor.getHealth(),
                };
                res.statusCode = 200;
                res.end(JSON.stringify(stats, null, 2));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Not found' }));
            }
        });

        this.server.listen(this.port, () => {
            this.client.log(`Health check server running on port ${this.port}`, 'success');
        });
    }

    /**
     * Stop health check server
     */
    stop() {
        if (this.server) {
            this.server.close();
            this.server = null;
        }
    }
}

/**
 * Default health checks
 */
export const defaultHealthChecks = {
    /**
     * Check if bot is connected to Discord
     */
    discord: async (client) => {
        return client.ws.status === 0 && client.isReady();
    },

    /**
     * Check if Lavalink is connected
     */
    lavalink: async (client) => {
        const nodes = client.manager?.shoukaku?.nodes;
        if (!nodes) return false;
        return Array.from(nodes.values()).some(node => node.state === 2);
    },

    /**
     * Check database connectivity
     */
    database: async (client) => {
        try {
            await client.db.config.size;
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Check memory usage
     */
    memory: async (client) => {
        const usage = process.memoryUsage();
        const { default: v8 } = await import('v8');
        const heapLimit = v8.getHeapStatistics().heap_size_limit;
        return (usage.heapUsed / heapLimit) < 0.9; // Under 90%
    },

    /**
     * Check if circuit breakers are healthy
     */
    circuitBreakers: async (client) => {
        return Object.values(client.circuitBreakers)
            .every(cb => cb.getState() !== 'OPEN');
    },
};

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
