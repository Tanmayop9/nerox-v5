/**
 * Advanced Command Execution Wrapper
 * Adds performance monitoring, retry logic, and error handling
 * @author NeroX Ultra Advanced System
 */

/**
 * Wrap command execution with advanced features
 * @param {Function} execute - Original execute function
 * @param {string} commandName - Command name
 * @returns {Function} Wrapped execute function
 */
export function wrapCommandExecution(execute, commandName) {
    return async function(client, ctx, args) {
        const endTiming = client.performanceMonitor.startTiming(`command:${commandName}`);
        const startTime = Date.now();
        let success = true;

        try {
            // Execute with request queue for rate limiting
            const result = await client.requestQueue.add(
                async () => {
                    // Execute with retry handler for resilience
                    return await client.retryHandler.execute(
                        async () => await execute.call(this, client, ctx, args),
                        {
                            maxRetries: 2,
                            shouldRetry: (error) => {
                                // Only retry on network/timeout errors
                                return error.code === 'ETIMEDOUT' ||
                                       error.code === 'ECONNRESET' ||
                                       error.message?.includes('timeout');
                            }
                        }
                    );
                },
                ctx.author.id === client.owners[0] ? 10 : 5 // Higher priority for owner
            );

            return result;
        } catch (error) {
            success = false;
            client.performanceMonitor.recordError('command', error);
            throw error;
        } finally {
            const duration = endTiming();
            client.performanceMonitor.recordCommand(commandName, duration, success);

            // Track command usage for analytics
            const statKey = `${ctx.author.id}:${commandName}`;
            client.cache.set(statKey, (client.cache.get(statKey) || 0) + 1, 3600000); // 1 hour
        }
    };
}

/**
 * Wrap event handler with performance monitoring
 * @param {Function} handler - Event handler function
 * @param {string} eventName - Event name
 * @returns {Function} Wrapped handler
 */
export function wrapEventHandler(handler, eventName) {
    return async function(client, ...args) {
        const endTiming = client.performanceMonitor.startTiming(`event:${eventName}`);

        try {
            return await handler.call(this, client, ...args);
        } catch (error) {
            client.performanceMonitor.recordError('event', error);
            client.log(`Event ${eventName} error: ${error.message}`, 'error');
        } finally {
            const duration = endTiming();
            client.performanceMonitor.recordEvent(eventName, duration);
        }
    };
}

/**
 * Create cached database operation
 * @param {Function} operation - Database operation
 * @param {string} cacheKey - Cache key
 * @param {number} ttl - Time to live
 * @returns {Function} Cached operation
 */
export function createCachedOperation(operation, cacheKey, ttl = 60000) {
    return async function(client, ...args) {
        const key = `${cacheKey}:${JSON.stringify(args)}`;
        
        // Check cache first
        const cached = client.cache.get(key);
        if (cached !== null) {
            return cached;
        }

        // Execute with circuit breaker
        const result = await client.circuitBreakers.database.execute(
            async () => await operation.call(this, client, ...args)
        );

        // Cache result
        client.cache.set(key, result, ttl);
        return result;
    };
}

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
