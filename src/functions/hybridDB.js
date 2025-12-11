import JOSH from '@joshdb/core';
// @ts-expect-error no declaration file for the imported module
import provider from '@joshdb/json';
import { DataModel, isMongoConnected } from './mongodb.js';

/**
 * Hybrid database that uses JoshDB locally and syncs with MongoDB asynchronously
 * Local operations are instant (0ms), MongoDB sync happens in background
 */
class HybridDB {
    constructor(name, joshInstance) {
        this.name = name;
        this.josh = joshInstance;
        this.syncEnabled = false;
        this.syncQueue = [];
        this.isSyncing = false;
    }

    /**
     * Enable MongoDB sync
     */
    enableSync() {
        this.syncEnabled = isMongoConnected();
        if (this.syncEnabled) {
            this._startSyncWorker();
        }
        return this.syncEnabled;
    }

    /**
     * Start background sync worker
     */
    _startSyncWorker() {
        setInterval(() => {
            if (this.syncQueue.length > 0 && !this.isSyncing) {
                this._processSyncQueue();
            }
        }, 100); // Process queue every 100ms
    }

    /**
     * Process sync queue in background
     */
    async _processSyncQueue() {
        if (!this.syncEnabled || this.isSyncing || this.syncQueue.length === 0) return;
        
        this.isSyncing = true;
        const batch = this.syncQueue.splice(0, 50); // Process 50 operations at a time
        
        try {
            const operations = batch.map(({ type, key, value }) => {
                if (type === 'set') {
                    return DataModel.findOneAndUpdate(
                        { collection: this.name, key },
                        { 
                            collection: this.name, 
                            key, 
                            value,
                            updatedAt: new Date()
                        },
                        { upsert: true, new: true }
                    );
                } else if (type === 'delete') {
                    return DataModel.deleteOne({ collection: this.name, key });
                }
            });
            
            await Promise.all(operations);
        } catch (error) {
            // Silent fail - don't block operations
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Queue sync operation (non-blocking)
     */
    _queueSync(type, key, value = null) {
        if (!this.syncEnabled) return;
        this.syncQueue.push({ type, key, value, timestamp: Date.now() });
    }

    /**
     * Sync data from MongoDB to local JoshDB (only on startup)
     */
    async syncFromMongoDB() {
        if (!isMongoConnected()) return;

        try {
            const mongoData = await DataModel.find({ collection: this.name });
            
            for (const doc of mongoData) {
                const localValue = await this.josh.get(doc.key);
                
                // Only sync if data doesn't exist locally
                if (!localValue) {
                    await this.josh.set(doc.key, doc.value);
                }
            }
            
            console.log(`[HybridDB] Synced ${mongoData.length} entries from MongoDB to ${this.name}`);
        } catch (error) {
            console.error(`[HybridDB] Error syncing from MongoDB for ${this.name}:`, error.message);
        }
    }

    /**
     * Get value from local JoshDB (instant, 0ms)
     */
    async get(key) {
        return await this.josh.get(key);
    }

    /**
     * Set value in local JoshDB (instant) and queue MongoDB sync
     */
    async set(key, value) {
        await this.josh.set(key, value);
        this._queueSync('set', key, value);
        return value;
    }

    /**
     * Delete value from local JoshDB (instant) and queue MongoDB sync
     */
    async delete(key) {
        await this.josh.delete(key);
        this._queueSync('delete', key);
        return true;
    }

    /**
     * Check if key exists in local JoshDB (instant)
     */
    async has(key) {
        return await this.josh.has(key);
    }

    /**
     * Get all keys from local JoshDB (instant)
     */
    get keys() {
        return this.josh.keys;
    }

    /**
     * Get all values from local JoshDB (instant)
     */
    get values() {
        return this.josh.values;
    }

    /**
     * Get all entries from local JoshDB (instant)
     */
    get entries() {
        return this.josh.entries;
    }

    /**
     * Get size from local JoshDB (instant)
     */
    get size() {
        return this.josh.size;
    }

    /**
     * Clear all data from local JoshDB (instant) and queue MongoDB sync
     */
    async clear() {
        await this.josh.clear();
        
        // Queue clear operation for MongoDB
        if (this.syncEnabled) {
            setTimeout(async () => {
                try {
                    await DataModel.deleteMany({ collection: this.name });
                } catch (error) {
                    // Silent fail
                }
            }, 0);
        }
        
        return true;
    }

    /**
     * Push to array in local JoshDB (instant) and queue MongoDB sync
     */
    async push(key, value) {
        await this.josh.push(key, value);
        const newValue = await this.josh.get(key);
        this._queueSync('set', key, newValue);
        return newValue;
    }

    /**
     * Math operations on local JoshDB (instant) and queue MongoDB sync
     */
    async math(key, operation, operand) {
        await this.josh.math(key, operation, operand);
        const newValue = await this.josh.get(key);
        this._queueSync('set', key, newValue);
        return newValue;
    }

    /**
     * Increment value in local JoshDB (instant) and queue MongoDB sync
     */
    async inc(key) {
        await this.josh.inc(key);
        const newValue = await this.josh.get(key);
        this._queueSync('set', key, newValue);
        return newValue;
    }

    /**
     * Decrement value in local JoshDB (instant) and queue MongoDB sync
     */
    async dec(key) {
        await this.josh.dec(key);
        const newValue = await this.josh.get(key);
        this._queueSync('set', key, newValue);
        return newValue;
    }

    /**
     * Find entries in local JoshDB (instant)
     */
    async find(fn) {
        return await this.josh.find(fn);
    }

    /**
     * Filter entries in local JoshDB (instant)
     */
    async filter(fn) {
        return await this.josh.filter(fn);
    }

    /**
     * Map entries in local JoshDB (instant)
     */
    async map(fn) {
        return await this.josh.map(fn);
    }

    /**
     * Iterate over entries in local JoshDB (instant)
     */
    async forEach(fn) {
        return await this.josh.forEach(fn);
    }

    /**
     * Get sync queue length (for monitoring)
     */
    getSyncQueueLength() {
        return this.syncQueue.length;
    }
}

/**
 * Create a hybrid database instance
 * @param {string} name - Database name
 * @returns {HybridDB} - Hybrid database instance
 */
export const hybridDB = (name) => {
    const joshInstance = new JOSH({
        name,
        provider,
        providerOptions: {
            dataDir: `./database-storage/${name}`,
        },
    });
    
    return new HybridDB(name, joshInstance);
};

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
