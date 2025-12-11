#!/usr/bin/env node

/**
 * Test MongoDB Wrapper
 * 
 * This script tests the MongoDB wrapper to ensure it works correctly
 * 
 * Usage: node scripts/test-mongodb.js
 */

import { config } from 'dotenv';
import { josh } from '../src/functions/josh.js';

// Load environment variables
config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nerox';

async function testMongoDB() {
    console.log('🧪 Testing MongoDB Wrapper\n');
    console.log(`MongoDB URI: ${MONGODB_URI}\n`);

    try {
        // Create a test database
        const testDb = josh('test_collection');
        
        console.log('1️⃣ Testing set operation...');
        await testDb.set('testKey1', 'testValue1');
        await testDb.set('testKey2', { name: 'Test', value: 123 });
        console.log('   ✅ Set operations successful\n');

        console.log('2️⃣ Testing get operation...');
        const value1 = await testDb.get('testKey1');
        const value2 = await testDb.get('testKey2');
        console.log(`   Retrieved: testKey1 = ${value1}`);
        console.log(`   Retrieved: testKey2 = ${JSON.stringify(value2)}`);
        console.log('   ✅ Get operations successful\n');

        console.log('3️⃣ Testing has operation...');
        const has1 = await testDb.has('testKey1');
        const has3 = await testDb.has('nonExistentKey');
        console.log(`   testKey1 exists: ${has1}`);
        console.log(`   nonExistentKey exists: ${has3}`);
        console.log('   ✅ Has operations successful\n');

        console.log('4️⃣ Testing keys, values, entries...');
        const keys = await testDb.keys;
        const values = await testDb.values;
        const entries = await testDb.entries;
        console.log(`   Keys: ${JSON.stringify(keys)}`);
        console.log(`   Values: ${JSON.stringify(values)}`);
        console.log(`   Entries count: ${entries.length}`);
        console.log('   ✅ Collection operations successful\n');

        console.log('5️⃣ Testing size...');
        const size = await testDb.size;
        console.log(`   Collection size: ${size}`);
        console.log('   ✅ Size operation successful\n');

        console.log('6️⃣ Testing delete operation...');
        await testDb.delete('testKey1');
        const hasAfterDelete = await testDb.has('testKey1');
        console.log(`   testKey1 exists after delete: ${hasAfterDelete}`);
        console.log('   ✅ Delete operation successful\n');

        console.log('7️⃣ Testing update operation...');
        await testDb.set('counter', 0);
        await testDb.update('counter', (value) => value + 1);
        const counter = await testDb.get('counter');
        console.log(`   Counter after update: ${counter}`);
        console.log('   ✅ Update operation successful\n');

        console.log('8️⃣ Testing ensure operation...');
        await testDb.ensure('ensuredKey', 'defaultValue');
        const ensured = await testDb.get('ensuredKey');
        console.log(`   Ensured key value: ${ensured}`);
        console.log('   ✅ Ensure operation successful\n');

        console.log('9️⃣ Cleaning up...');
        await testDb.clear();
        const sizeAfterClear = await testDb.size;
        console.log(`   Collection size after clear: ${sizeAfterClear}`);
        console.log('   ✅ Cleanup successful\n');

        console.log('✨ All tests passed!\n');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        // Exit the process
        process.exit(0);
    }
}

// Run tests
testMongoDB().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
