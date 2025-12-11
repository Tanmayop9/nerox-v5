#!/usr/bin/env node

/**
 * Migration Script: JoshDB JSON Files to MongoDB
 * 
 * This script migrates data from JoshDB JSON files to MongoDB.
 * 
 * Usage: node scripts/migrate-to-mongodb.js
 */

import { config } from 'dotenv';
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, basename } from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nerox';
const DATABASE_STORAGE_PATH = join(__dirname, '..', 'database-storage');

// Schema for key-value storage
const kvSchema = new mongoose.Schema({
    key: { type: String, required: true, index: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    strict: false,
    timestamps: true
});

kvSchema.index({ key: 1 }, { unique: true });

/**
 * Get or create a model for a collection
 */
function getModel(collectionName) {
    const modelName = collectionName.replace(/[^a-zA-Z0-9]/g, '_');
    try {
        return mongoose.model(modelName);
    } catch {
        return mongoose.model(modelName, kvSchema, collectionName);
    }
}

/**
 * Read JoshDB data from a directory
 */
function readJoshDBData(dbPath) {
    const data = {};
    
    if (!existsSync(dbPath)) {
        return data;
    }

    try {
        const files = readdirSync(dbPath);
        
        for (const file of files) {
            if (!file.endsWith('.json')) continue;
            
            const filePath = join(dbPath, file);
            const content = readFileSync(filePath, 'utf8');
            const json = JSON.parse(content);
            
            // JoshDB stores data as an object with keys
            if (typeof json === 'object' && json !== null) {
                Object.assign(data, json);
            }
        }
    } catch (error) {
        console.error(`Error reading ${dbPath}:`, error.message);
    }
    
    return data;
}

/**
 * Get all database directories
 */
function getDatabaseDirectories(basePath) {
    const databases = [];
    
    if (!existsSync(basePath)) {
        console.log(`Database storage path not found: ${basePath}`);
        return databases;
    }
    
    function traverse(currentPath, relativePath = '') {
        const items = readdirSync(currentPath);
        
        for (const item of items) {
            const itemPath = join(currentPath, item);
            const stat = statSync(itemPath);
            
            if (stat.isDirectory()) {
                const relPath = relativePath ? join(relativePath, item) : item;
                
                // Check if this directory contains JSON files (is a JoshDB database)
                const files = readdirSync(itemPath);
                const hasJsonFiles = files.some(f => f.endsWith('.json'));
                
                if (hasJsonFiles) {
                    databases.push({
                        name: relPath,
                        path: itemPath
                    });
                } else {
                    // Traverse subdirectories
                    traverse(itemPath, relPath);
                }
            }
        }
    }
    
    traverse(basePath);
    return databases;
}

/**
 * Migrate a single database
 */
async function migrateDatabase(dbName, dbPath) {
    console.log(`\nMigrating: ${dbName}`);
    console.log(`  Path: ${dbPath}`);
    
    // Read data from JoshDB
    const data = readJoshDBData(dbPath);
    const entries = Object.entries(data);
    
    if (entries.length === 0) {
        console.log(`  ⚠️  No data found`);
        return { name: dbName, count: 0, success: true };
    }
    
    console.log(`  📊 Found ${entries.length} entries`);
    
    try {
        // Get MongoDB model
        const model = getModel(dbName);
        
        // Prepare bulk operations
        const operations = entries.map(([key, value]) => ({
            updateOne: {
                filter: { key },
                update: { 
                    key, 
                    value, 
                    updatedAt: new Date() 
                },
                upsert: true
            }
        }));
        
        // Execute bulk write
        if (operations.length > 0) {
            const result = await model.bulkWrite(operations);
            console.log(`  ✅ Migrated ${result.upsertedCount + result.modifiedCount} entries`);
        }
        
        return { name: dbName, count: entries.length, success: true };
    } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        return { name: dbName, count: 0, success: false, error: error.message };
    }
}

/**
 * Main migration function
 */
async function migrate() {
    console.log('🚀 Starting JoshDB to MongoDB Migration\n');
    console.log(`MongoDB URI: ${MONGODB_URI}`);
    console.log(`Storage Path: ${DATABASE_STORAGE_PATH}\n`);
    
    try {
        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Connected to MongoDB\n');
        
        // Get all databases
        const databases = getDatabaseDirectories(DATABASE_STORAGE_PATH);
        
        if (databases.length === 0) {
            console.log('⚠️  No databases found to migrate');
            return;
        }
        
        console.log(`📦 Found ${databases.length} databases to migrate:`);
        databases.forEach(db => console.log(`   - ${db.name}`));
        
        // Migrate each database
        const results = [];
        for (const db of databases) {
            const result = await migrateDatabase(db.name, db.path);
            results.push(result);
        }
        
        // Print summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 Migration Summary');
        console.log('='.repeat(60));
        
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        const totalEntries = results.reduce((sum, r) => sum + r.count, 0);
        
        console.log(`\nDatabases processed: ${results.length}`);
        console.log(`  ✅ Successful: ${successful}`);
        console.log(`  ❌ Failed: ${failed}`);
        console.log(`\nTotal entries migrated: ${totalEntries}`);
        
        if (failed > 0) {
            console.log('\n⚠️  Failed migrations:');
            results.filter(r => !r.success).forEach(r => {
                console.log(`   - ${r.name}: ${r.error}`);
            });
        }
        
        console.log('\n✨ Migration completed!\n');
        
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
}

// Run migration
migrate().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
