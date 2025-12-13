/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures in external service calls
 * @author NeroX Ultra Advanced System
 */

export class CircuitBreaker {
    constructor(options = {}) {
        this.failureThreshold = options.failureThreshold || 5;
        this.successThreshold = options.successThreshold || 2;
        this.timeout = options.timeout || 60000; // 1 minute
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.failureCount = 0;
        this.successCount = 0;
        this.nextAttempt = Date.now();
        this.stats = {
            totalCalls: 0,
            successfulCalls: 0,
            failedCalls: 0,
            rejectedCalls: 0,
        };
    }

    /**
     * Execute function with circuit breaker protection
     * @param {Function} fn - Function to execute
     * @returns {Promise<*>} Result of function
     */
    async execute(fn) {
        this.stats.totalCalls++;

        if (this.state === 'OPEN') {
            if (Date.now() < this.nextAttempt) {
                this.stats.rejectedCalls++;
                throw new Error('Circuit breaker is OPEN - service unavailable');
            }
            // Try transitioning to half-open
            this.state = 'HALF_OPEN';
            this.successCount = 0;
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    /**
     * Handle successful execution
     */
    onSuccess() {
        this.stats.successfulCalls++;
        this.failureCount = 0;

        if (this.state === 'HALF_OPEN') {
            this.successCount++;
            if (this.successCount >= this.successThreshold) {
                this.state = 'CLOSED';
            }
        }
    }

    /**
     * Handle failed execution
     */
    onFailure() {
        this.stats.failedCalls++;
        this.failureCount++;
        this.successCount = 0;

        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.timeout;
        }
    }

    /**
     * Get current state
     * @returns {string} Current circuit state
     */
    getState() {
        return this.state;
    }

    /**
     * Get statistics
     * @returns {Object} Circuit breaker stats
     */
    getStats() {
        return {
            ...this.stats,
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
        };
    }

    /**
     * Reset circuit breaker
     */
    reset() {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.successCount = 0;
        this.nextAttempt = Date.now();
    }
}

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
