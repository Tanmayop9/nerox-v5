/**
 * MongoDB Wrapper with JoshDB-compatible API
 * Provides a simple key-value store interface using MongoDB
 */

import mongoose from 'mongoose';
import { connectMongoDB } from './mongodb.js';

// Generic schema for key-value storage
const kvSchema = new mongoose.Schema({
    key: { type: String, required: true, index: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    strict: false,
    timestamps: true
});

// Create a unique index on key field within each collection
// Note: Each model uses a separate MongoDB collection, so the unique constraint
// is scoped per collection, not across all collections
kvSchema.index({ key: 1 }, { unique: true });

// Store models by collection name
const models = new Map();

/**
 * Get or create a model for a collection
 * @param {string} collectionName - Name of the collection
 * @returns {mongoose.Model}
 */
function getModel(collectionName) {
    if (!models.has(collectionName)) {
        // Create a unique model name by replacing special characters
        const modelName = collectionName.replace(/[^a-zA-Z0-9]/g, '_');
        try {
            // Try to get existing model
            models.set(collectionName, mongoose.model(modelName));
        } catch {
            // Create new model if it doesn't exist
            const model = mongoose.model(modelName, kvSchema, collectionName);
            models.set(collectionName, model);
        }
    }
    return models.get(collectionName);
}

/**
 * MongoDB wrapper class with JoshDB-compatible API
 */
class MongoDBWrapper {
    constructor(name) {
        this.name = name;
        this.model = null;
        this._initialized = false;
        this._initPromise = null;
    }

    /**
     * Initialize the wrapper (connect to MongoDB and get model)
     * @returns {Promise<void>}
     */
    async _init() {
        if (this._initialized) return;
        if (this._initPromise) return this._initPromise;

        this._initPromise = (async () => {
            try {
                await connectMongoDB();
                this.model = getModel(this.name);
                this._initialized = true;
            } catch (error) {
                console.error(`Failed to initialize MongoDB wrapper for ${this.name}:`, error);
                throw error;
            }
        })();

        return this._initPromise;
    }

    /**
     * Get a value by key
     * @param {string} key - The key to retrieve
     * @returns {Promise<any>} The value or undefined if not found
     */
    async get(key) {
        await this._init();
        const doc = await this.model.findOne({ key });
        return doc ? doc.value : undefined;
    }

    /**
     * Set a value for a key
     * @param {string} key - The key to set
     * @param {any} value - The value to store
     * @returns {Promise<any>} The value that was set
     */
    async set(key, value) {
        await this._init();
        await this.model.findOneAndUpdate(
            { key },
            { key, value, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        return value;
    }

    /**
     * Delete a key-value pair
     * @param {string} key - The key to delete
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async delete(key) {
        await this._init();
        const result = await this.model.deleteOne({ key });
        return result.deletedCount > 0;
    }

    /**
     * Check if a key exists
     * @param {string} key - The key to check
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    async has(key) {
        await this._init();
        const count = await this.model.countDocuments({ key });
        return count > 0;
    }

    /**
     * Get all keys
     * @returns {Promise<string[]>} Array of all keys
     */
    get keys() {
        return (async () => {
            await this._init();
            const docs = await this.model.find({}, { key: 1, _id: 0 });
            return docs.map(doc => doc.key);
        })();
    }

    /**
     * Get all values
     * @returns {Promise<any[]>} Array of all values
     */
    get values() {
        return (async () => {
            await this._init();
            const docs = await this.model.find({}, { value: 1, _id: 0 });
            return docs.map(doc => doc.value);
        })();
    }

    /**
     * Get all entries as [key, value] pairs
     * @returns {Promise<Array<[string, any]>>} Array of [key, value] pairs
     */
    get entries() {
        return (async () => {
            await this._init();
            const docs = await this.model.find({}, { key: 1, value: 1, _id: 0 });
            return docs.map(doc => [doc.key, doc.value]);
        })();
    }

    /**
     * Get the number of entries
     * @returns {Promise<number>} Number of entries
     */
    get size() {
        return (async () => {
            await this._init();
            return await this.model.countDocuments();
        })();
    }

    /**
     * Clear all entries in this collection
     * @returns {Promise<void>}
     */
    async clear() {
        await this._init();
        await this.model.deleteMany({});
    }

    /**
     * Execute a function for each entry
     * @param {Function} callback - Function to execute for each entry (value, key)
     * @returns {Promise<void>}
     */
    async forEach(callback) {
        await this._init();
        const docs = await this.model.find({});
        for (const doc of docs) {
            await callback(doc.value, doc.key);
        }
    }

    /**
     * Get multiple values by keys
     * @param {string[]} keys - Array of keys to retrieve
     * @returns {Promise<any[]>} Array of values
     */
    async getMany(keys) {
        await this._init();
        const docs = await this.model.find({ key: { $in: keys } });
        const valueMap = new Map(docs.map(doc => [doc.key, doc.value]));
        return keys.map(key => valueMap.get(key));
    }

    /**
     * Set multiple key-value pairs
     * @param {Array<[string, any]>} entries - Array of [key, value] pairs
     * @returns {Promise<void>}
     */
    async setMany(entries) {
        await this._init();
        const operations = entries.map(([key, value]) => ({
            updateOne: {
                filter: { key },
                update: { key, value, updatedAt: new Date() },
                upsert: true
            }
        }));
        
        if (operations.length > 0) {
            await this.model.bulkWrite(operations);
        }
    }

    /**
     * Find entries matching a filter
     * @param {Function} predicate - Filter function (value, key) => boolean
     * @returns {Promise<Array<[string, any]>>} Matching entries
     */
    async filter(predicate) {
        await this._init();
        const docs = await this.model.find({});
        const results = [];
        for (const doc of docs) {
            if (await predicate(doc.value, doc.key)) {
                results.push([doc.key, doc.value]);
            }
        }
        return results;
    }

    /**
     * Find first entry matching a filter
     * @param {Function} predicate - Filter function (value, key) => boolean
     * @returns {Promise<[string, any] | undefined>} First matching entry or undefined
     */
    async find(predicate) {
        await this._init();
        const docs = await this.model.find({});
        for (const doc of docs) {
            if (await predicate(doc.value, doc.key)) {
                return [doc.key, doc.value];
            }
        }
        return undefined;
    }

    /**
     * Map over all entries
     * @param {Function} mapper - Map function (value, key) => any
     * @returns {Promise<any[]>} Array of mapped values
     */
    async map(mapper) {
        await this._init();
        const docs = await this.model.find({});
        const results = [];
        for (const doc of docs) {
            results.push(await mapper(doc.value, doc.key));
        }
        return results;
    }

    /**
     * Check if some entries match a condition
     * @param {Function} predicate - Test function (value, key) => boolean
     * @returns {Promise<boolean>} True if at least one entry matches
     */
    async some(predicate) {
        await this._init();
        const docs = await this.model.find({});
        for (const doc of docs) {
            if (await predicate(doc.value, doc.key)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if all entries match a condition
     * @param {Function} predicate - Test function (value, key) => boolean
     * @returns {Promise<boolean>} True if all entries match
     */
    async every(predicate) {
        await this._init();
        const docs = await this.model.find({});
        for (const doc of docs) {
            if (!(await predicate(doc.value, doc.key))) {
                return false;
            }
        }
        return true;
    }

    /**
     * Update a value using a function
     * @param {string} key - The key to update
     * @param {Function} updater - Function that takes current value and returns new value
     * @returns {Promise<any>} The new value
     */
    async update(key, updater) {
        await this._init();
        const current = await this.get(key);
        const newValue = await updater(current);
        await this.set(key, newValue);
        return newValue;
    }

    /**
     * Ensure a key exists with a default value
     * @param {string} key - The key to check
     * @param {any} defaultValue - Default value to set if key doesn't exist
     * @returns {Promise<any>} The existing or newly set value
     */
    async ensure(key, defaultValue) {
        await this._init();
        const exists = await this.has(key);
        if (!exists) {
            await this.set(key, defaultValue);
            return defaultValue;
        }
        return await this.get(key);
    }
}

/**
 * Factory function to create a MongoDB wrapper (JoshDB-compatible)
 * @param {string} name - Collection name
 * @returns {MongoDBWrapper} MongoDB wrapper instance
 */
export const josh = (name) => {
    return new MongoDBWrapper(name);
};

export default MongoDBWrapper;
