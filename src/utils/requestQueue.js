/**
 * Advanced Request Queue with Priority Support
 * Manages concurrent operations with configurable limits
 * @author NeroX Ultra Advanced System
 */

export class RequestQueue {
    constructor(options = {}) {
        this.concurrency = options.concurrency || 10;
        this.timeout = options.timeout || 30000; // 30 seconds
        this.queue = [];
        this.running = 0;
        this.stats = {
            processed: 0,
            failed: 0,
            timeout: 0,
            queued: 0,
        };
    }

    /**
     * Add request to queue
     * @param {Function} fn - Function to execute
     * @param {number} priority - Priority (higher = more important)
     * @returns {Promise<*>} Result of function
     */
    async add(fn, priority = 0) {
        return new Promise((resolve, reject) => {
            const request = {
                fn,
                priority,
                resolve,
                reject,
                addedAt: Date.now(),
            };

            // Insert based on priority
            const index = this.queue.findIndex(r => r.priority < priority);
            if (index === -1) {
                this.queue.push(request);
            } else {
                this.queue.splice(index, 0, request);
            }

            this.stats.queued++;
            this.process();
        });
    }

    /**
     * Process queue
     */
    async process() {
        if (this.running >= this.concurrency || this.queue.length === 0) {
            return;
        }

        const request = this.queue.shift();
        this.running++;

        const timeoutId = setTimeout(() => {
            this.stats.timeout++;
            request.reject(new Error('Request timeout'));
        }, this.timeout);

        try {
            const result = await request.fn();
            clearTimeout(timeoutId);
            this.stats.processed++;
            request.resolve(result);
        } catch (error) {
            clearTimeout(timeoutId);
            this.stats.failed++;
            request.reject(error);
        } finally {
            this.running--;
            this.process(); // Process next item
        }
    }

    /**
     * Get queue statistics
     * @returns {Object} Queue stats
     */
    getStats() {
        return {
            ...this.stats,
            queueLength: this.queue.length,
            running: this.running,
        };
    }

    /**
     * Clear queue
     */
    clear() {
        this.queue.forEach(req => req.reject(new Error('Queue cleared')));
        this.queue = [];
    }

    /**
     * Get average wait time
     * @returns {number} Average wait time in ms
     */
    getAverageWaitTime() {
        if (this.queue.length === 0) return 0;
        const now = Date.now();
        const totalWait = this.queue.reduce((sum, req) => sum + (now - req.addedAt), 0);
        return Math.round(totalWait / this.queue.length);
    }
}

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
