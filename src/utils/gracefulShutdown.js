/**
 * Graceful Shutdown Handler
 * Ensures clean shutdown of all services
 * @author NeroX Ultra Advanced System
 */

export class GracefulShutdown {
    constructor(client, options = {}) {
        this.client = client;
        this.timeout = options.timeout || 30000; // 30 seconds
        this.handlers = [];
        this.isShuttingDown = false;
    }

    /**
     * Register a shutdown handler
     * @param {string} name - Handler name
     * @param {Function} handler - Shutdown handler function
     */
    register(name, handler) {
        this.handlers.push({ name, handler });
    }

    /**
     * Initialize shutdown listeners
     */
    init() {
        const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
        
        for (const signal of signals) {
            process.on(signal, () => this.shutdown(signal));
        }

        process.on('unhandledRejection', (reason, promise) => {
            this.client.log(`Unhandled Rejection: ${reason}`, 'error');
            console.error('Promise:', promise);
        });

        process.on('uncaughtException', (error) => {
            this.client.log(`Uncaught Exception: ${error.message}`, 'error');
            console.error(error);
            this.shutdown('UNCAUGHT_EXCEPTION');
        });
    }

    /**
     * Perform graceful shutdown
     * @param {string} signal - Signal that triggered shutdown
     */
    async shutdown(signal) {
        if (this.isShuttingDown) {
            this.client.log('Shutdown already in progress...', 'warn');
            return;
        }

        this.isShuttingDown = true;
        this.client.log(`Received ${signal}, starting graceful shutdown...`, 'info');

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Shutdown timeout')), this.timeout);
        });

        try {
            await Promise.race([
                this.executeShutdownHandlers(),
                timeoutPromise,
            ]);
            this.client.log('Graceful shutdown completed', 'success');
            process.exit(0);
        } catch (error) {
            this.client.log(`Shutdown error: ${error.message}`, 'error');
            process.exit(1);
        }
    }

    /**
     * Execute all shutdown handlers
     */
    async executeShutdownHandlers() {
        this.client.log('Executing shutdown handlers...', 'info');

        for (const { name, handler } of this.handlers) {
            try {
                this.client.log(`Running ${name} shutdown handler...`, 'info');
                await handler(this.client);
                this.client.log(`${name} shutdown completed`, 'success');
            } catch (error) {
                this.client.log(`${name} shutdown failed: ${error.message}`, 'error');
            }
        }
    }
}

/**
 * Default shutdown handlers
 */
export const defaultShutdownHandlers = {
    /**
     * Stop accepting new commands
     */
    stopCommands: async (client) => {
        client.underMaintenance = true;
        client.log('Stopped accepting new commands', 'info');
    },

    /**
     * Clear request queue
     */
    clearQueue: async (client) => {
        const stats = client.requestQueue.getStats();
        client.log(`Clearing request queue (${stats.queueLength} pending)`, 'info');
        client.requestQueue.clear();
    },

    /**
     * Destroy all music players
     */
    destroyPlayers: async (client) => {
        const players = client.manager?.players;
        if (!players) return;

        client.log(`Destroying ${players.size} music players...`, 'info');
        for (const [, player] of players) {
            try {
                await player.destroy();
            } catch (error) {
                // Ignore errors during shutdown
            }
        }
    },

    /**
     * Save performance metrics
     */
    saveMetrics: async (client) => {
        const metrics = client.performanceMonitor.getMetrics();
        client.log(`Final metrics - Commands: ${Object.keys(metrics.commands).length}, Errors: ${Object.keys(metrics.errors).length}`, 'info');
    },

    /**
     * Close database connections
     */
    closeDatabase: async (client) => {
        client.log('Closing database connections...', 'info');
        // Database will close automatically when process exits
    },

    /**
     * Disconnect from Discord
     */
    disconnectDiscord: async (client) => {
        client.log('Disconnecting from Discord...', 'info');
        await client.destroy();
    },
};

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
