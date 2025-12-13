/**
 * Advanced Performance Monitoring System
 * Tracks metrics, timings, and system health
 * @author NeroX Ultra Advanced System
 */

import os from 'os';
import v8 from 'v8';

export class PerformanceMonitor {
    constructor(options = {}) {
        this.metricsWindow = options.metricsWindow || 60000; // 1 minute
        this.metrics = {
            commands: new Map(),
            events: new Map(),
            queries: new Map(),
            errors: new Map(),
        };
        this.timings = [];
        this.startTime = Date.now();
    }

    /**
     * Record command execution
     * @param {string} command - Command name
     * @param {number} duration - Execution time in ms
     * @param {boolean} success - Whether command succeeded
     */
    recordCommand(command, duration, success = true) {
        this.recordMetric('commands', command, duration, success);
    }

    /**
     * Record event execution
     * @param {string} event - Event name
     * @param {number} duration - Execution time in ms
     */
    recordEvent(event, duration) {
        this.recordMetric('events', event, duration, true);
    }

    /**
     * Record database query
     * @param {string} query - Query type
     * @param {number} duration - Query time in ms
     */
    recordQuery(query, duration) {
        this.recordMetric('queries', query, duration, true);
    }

    /**
     * Record error
     * @param {string} type - Error type
     * @param {Error} error - Error object
     */
    recordError(type, error) {
        const key = `${type}:${error.message}`;
        const current = this.metrics.errors.get(key) || { count: 0, lastSeen: 0 };
        this.metrics.errors.set(key, {
            count: current.count + 1,
            lastSeen: Date.now(),
            type,
            message: error.message,
        });
    }

    /**
     * Record metric
     * @param {string} category - Metric category
     * @param {string} name - Metric name
     * @param {number} duration - Duration in ms
     * @param {boolean} success - Success status
     */
    recordMetric(category, name, duration, success) {
        const metrics = this.metrics[category];
        const current = metrics.get(name) || {
            count: 0,
            totalDuration: 0,
            minDuration: Infinity,
            maxDuration: 0,
            failures: 0,
        };

        metrics.set(name, {
            count: current.count + 1,
            totalDuration: current.totalDuration + duration,
            minDuration: Math.min(current.minDuration, duration),
            maxDuration: Math.max(current.maxDuration, duration),
            failures: current.failures + (success ? 0 : 1),
            avgDuration: (current.totalDuration + duration) / (current.count + 1),
        });
    }

    /**
     * Start timing
     * @param {string} label - Timing label
     * @returns {Function} End function
     */
    startTiming(label) {
        const start = Date.now();
        return () => {
            const duration = Date.now() - start;
            this.timings.push({ label, duration, timestamp: Date.now() });
            // Clean old timings periodically (not on every call for performance)
            if (this.timings.length % 100 === 0) {
                this.cleanTimings();
            }
            return duration;
        };
    }

    /**
     * Clean old timing entries
     */
    cleanTimings() {
        const cutoff = Date.now() - this.metricsWindow;
        this.timings = this.timings.filter(t => t.timestamp > cutoff);
    }

    /**
     * Get system metrics
     * @returns {Object} System metrics
     */
    getSystemMetrics() {
        const uptime = Date.now() - this.startTime;
        const memUsage = process.memoryUsage();
        const heapStats = v8.getHeapStatistics();
        const cpuUsage = process.cpuUsage();

        return {
            uptime: {
                ms: uptime,
                formatted: this.formatDuration(uptime),
            },
            memory: {
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
                external: Math.round(memUsage.external / 1024 / 1024),
                rss: Math.round(memUsage.rss / 1024 / 1024),
                heapLimit: Math.round(heapStats.heap_size_limit / 1024 / 1024),
            },
            cpu: {
                user: Math.round(cpuUsage.user / 1000),
                system: Math.round(cpuUsage.system / 1000),
            },
            system: {
                loadAvg: os.loadavg(),
                freeMem: Math.round(os.freemem() / 1024 / 1024),
                totalMem: Math.round(os.totalmem() / 1024 / 1024),
                platform: os.platform(),
                arch: os.arch(),
            },
        };
    }

    /**
     * Get all metrics
     * @returns {Object} All metrics
     */
    getMetrics() {
        return {
            commands: Object.fromEntries(this.metrics.commands),
            events: Object.fromEntries(this.metrics.events),
            queries: Object.fromEntries(this.metrics.queries),
            errors: Object.fromEntries(this.metrics.errors),
            system: this.getSystemMetrics(),
        };
    }

    /**
     * Get top commands by usage
     * @param {number} limit - Number of commands to return
     * @returns {Array} Top commands
     */
    getTopCommands(limit = 10) {
        return Array.from(this.metrics.commands.entries())
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, limit)
            .map(([name, stats]) => ({ name, ...stats }));
    }

    /**
     * Get slow operations
     * @param {number} threshold - Threshold in ms
     * @returns {Array} Slow operations
     */
    getSlowOperations(threshold = 1000) {
        const slow = [];
        
        for (const [category, metrics] of Object.entries(this.metrics)) {
            if (category === 'errors') continue;
            
            for (const [name, stats] of metrics.entries()) {
                if (stats.maxDuration > threshold) {
                    slow.push({
                        category,
                        name,
                        maxDuration: stats.maxDuration,
                        avgDuration: Math.round(stats.avgDuration),
                    });
                }
            }
        }

        return slow.sort((a, b) => b.maxDuration - a.maxDuration);
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
     * Reset all metrics
     */
    reset() {
        this.metrics = {
            commands: new Map(),
            events: new Map(),
            queries: new Map(),
            errors: new Map(),
        };
        this.timings = [];
    }

    /**
     * Get health status
     * @returns {Object} Health status
     */
    getHealth() {
        const system = this.getSystemMetrics();
        const errorCount = Array.from(this.metrics.errors.values())
            .reduce((sum, e) => sum + e.count, 0);

        return {
            status: this.determineHealthStatus(system, errorCount),
            uptime: system.uptime.formatted,
            memoryUsage: Math.round((system.memory.heapUsed / system.memory.heapLimit) * 100),
            errorCount,
            timestamp: Date.now(),
        };
    }

    /**
     * Determine overall health status
     * @param {Object} system - System metrics
     * @param {number} errorCount - Error count
     * @returns {string} Health status
     */
    determineHealthStatus(system, errorCount) {
        const memUsagePercent = (system.memory.heapUsed / system.memory.heapLimit) * 100;
        
        if (errorCount > 100 || memUsagePercent > 90) return 'critical';
        if (errorCount > 50 || memUsagePercent > 75) return 'warning';
        return 'healthy';
    }
}

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
