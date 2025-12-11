/**
 * MongoDB Connection Manager
 * Handles connection to MongoDB database
 */

import mongoose from 'mongoose';
import { log } from '../logger.js';

let isConnected = false;

/**
 * Connect to MongoDB
 * @returns {Promise<void>}
 */
export async function connectMongoDB() {
    if (isConnected) {
        log('MongoDB already connected', 'info');
        return;
    }

    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nerox';

    try {
        await mongoose.connect(MONGODB_URI, {
            // These options are no longer needed in newer versions of mongoose
            // but we'll keep them for compatibility
            serverSelectionTimeoutMS: 5000,
        });

        isConnected = true;
        log('MongoDB connected successfully', 'success');
        
        mongoose.connection.on('error', (err) => {
            log(`MongoDB error: ${err.message}`, 'error');
        });

        mongoose.connection.on('disconnected', () => {
            log('MongoDB disconnected', 'warn');
            isConnected = false;
        });

    } catch (error) {
        log(`MongoDB connection failed: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
export async function disconnectMongoDB() {
    if (!isConnected) {
        return;
    }

    try {
        await mongoose.disconnect();
        isConnected = false;
        log('MongoDB disconnected successfully', 'info');
    } catch (error) {
        log(`MongoDB disconnect error: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * Get MongoDB connection status
 * @returns {boolean}
 */
export function isMongoDBConnected() {
    return isConnected && mongoose.connection.readyState === 1;
}

export default mongoose;
