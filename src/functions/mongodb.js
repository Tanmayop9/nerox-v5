import mongoose from 'mongoose';

let isConnected = false;

/**
 * Connect to MongoDB asynchronously (non-blocking)
 * @param {string} uri - MongoDB connection URI
 * @returns {Promise<boolean>} - Returns true if connected successfully
 */
export async function connectMongoDB(uri) {
    if (isConnected) {
        return true;
    }

    if (!uri) {
        console.warn('[MongoDB] No MongoDB URI provided. Running in local-only mode.');
        return false;
    }

    // Connect asynchronously without blocking
    mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
    }).then(() => {
        isConnected = true;
        console.log('[MongoDB] Connected successfully');
    }).catch((error) => {
        console.error('[MongoDB] Connection failed:', error.message);
        isConnected = false;
    });
    
    mongoose.connection.on('error', (err) => {
        console.error('[MongoDB] Connection error:', err);
        isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
        console.warn('[MongoDB] Disconnected');
        isConnected = false;
    });
    
    // Return immediately, don't wait for connection
    return true;
}

/**
 * Check if MongoDB is connected
 * @returns {boolean}
 */
export function isMongoConnected() {
    return isConnected && mongoose.connection.readyState === 1;
}

// Define a flexible schema that can store any key-value pair
const dataSchema = new mongoose.Schema({
    collection: { type: String, required: true, index: true },
    key: { type: String, required: true, index: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Compound index for efficient queries
dataSchema.index({ collection: 1, key: 1 }, { unique: true });

export const DataModel = mongoose.model('Data', dataSchema);
