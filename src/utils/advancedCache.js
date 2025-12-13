/**
 * Advanced Caching System with TTL and LRU eviction
 * @author NeroX Ultra Advanced System
 */

export class AdvancedCache {
    constructor(options = {}) {
        this.maxSize = options.maxSize || 1000;
        this.defaultTTL = options.defaultTTL || 300000; // 5 minutes default
        this.cache = new Map();
        this.accessOrder = new Map(); // For LRU tracking
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            evictions: 0,
        };
    }

    /**
     * Get value from cache
     * @param {string} key - Cache key
     * @returns {*} Cached value or null
     */
    get(key) {
        const entry = this.cache.get(key);
        
        if (!entry) {
            this.stats.misses++;
            return null;
        }

        // Check if expired
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            this.accessOrder.delete(key);
            this.stats.misses++;
            return null;
        }

        // Update access time for LRU
        this.accessOrder.set(key, Date.now());
        this.stats.hits++;
        return entry.value;
    }

    /**
     * Set value in cache
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {number} ttl - Time to live in milliseconds
     */
    set(key, value, ttl = this.defaultTTL) {
        // Evict if at max size
        if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
            this.evictLRU();
        }

        const expiresAt = Date.now() + ttl;
        this.cache.set(key, { value, expiresAt });
        this.accessOrder.set(key, Date.now());
        this.stats.sets++;
    }

    /**
     * Evict least recently used item
     */
    evictLRU() {
        let oldestKey = null;
        let oldestTime = Infinity;

        for (const [key, time] of this.accessOrder.entries()) {
            if (time < oldestTime) {
                oldestTime = time;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.accessOrder.delete(oldestKey);
            this.stats.evictions++;
        }
    }

    /**
     * Delete key from cache
     * @param {string} key - Cache key
     */
    delete(key) {
        this.cache.delete(key);
        this.accessOrder.delete(key);
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
        this.accessOrder.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getStats() {
        const totalRequests = this.stats.hits + this.stats.misses;
        return {
            ...this.stats,
            size: this.cache.size,
            hitRate: totalRequests > 0 ? (this.stats.hits / totalRequests * 100).toFixed(2) + '%' : '0%',
        };
    }

    /**
     * Cleanup expired entries
     */
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
                this.accessOrder.delete(key);
            }
        }
    }
}

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
