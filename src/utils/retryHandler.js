/**
 * Advanced Retry Handler with Exponential Backoff
 * @author NeroX Ultra Advanced System
 */

export class RetryHandler {
    constructor(options = {}) {
        this.maxRetries = options.maxRetries || 3;
        this.baseDelay = options.baseDelay || 1000;
        this.maxDelay = options.maxDelay || 30000;
        this.backoffMultiplier = options.backoffMultiplier || 2;
        this.jitter = options.jitter !== false; // Add randomness by default
    }

    /**
     * Execute function with retry logic
     * @param {Function} fn - Function to execute
     * @param {Object} options - Retry options
     * @returns {Promise<*>} Result of function
     */
    async execute(fn, options = {}) {
        const maxRetries = options.maxRetries || this.maxRetries;
        let lastError;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;

                // Don't retry if it's the last attempt
                if (attempt === maxRetries) {
                    break;
                }

                // Check if error is retryable
                if (options.shouldRetry && !options.shouldRetry(error)) {
                    throw error;
                }

                // Calculate delay with exponential backoff
                const delay = this.calculateDelay(attempt);
                await this.sleep(delay);
            }
        }

        throw lastError;
    }

    /**
     * Calculate delay for retry attempt
     * @param {number} attempt - Current attempt number
     * @returns {number} Delay in milliseconds
     */
    calculateDelay(attempt) {
        let delay = Math.min(
            this.baseDelay * Math.pow(this.backoffMultiplier, attempt),
            this.maxDelay
        );

        // Add jitter to prevent thundering herd
        if (this.jitter) {
            delay = delay * (0.5 + Math.random() * 0.5);
        }

        return Math.round(delay);
    }

    /**
     * Sleep for specified duration
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise<void>}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Create a retryable function
     * @param {Function} fn - Function to wrap
     * @param {Object} options - Retry options
     * @returns {Function} Wrapped function
     */
    wrap(fn, options = {}) {
        return async (...args) => {
            return this.execute(() => fn(...args), options);
        };
    }
}

/**
 * Predefined retry strategies
 */
export const RetryStrategies = {
    /**
     * Retry on network errors
     */
    networkErrors: (error) => {
        return error.code === 'ECONNRESET' ||
               error.code === 'ETIMEDOUT' ||
               error.code === 'ECONNREFUSED' ||
               error.message.includes('timeout') ||
               error.message.includes('network');
    },

    /**
     * Retry on rate limits
     */
    rateLimits: (error) => {
        return error.status === 429 ||
               error.code === 50013 ||
               error.message.includes('rate limit');
    },

    /**
     * Retry on server errors
     */
    serverErrors: (error) => {
        return error.status >= 500 && error.status < 600;
    },

    /**
     * Combine multiple strategies
     */
    combine: (...strategies) => {
        return (error) => strategies.some(strategy => strategy(error));
    },
};

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
