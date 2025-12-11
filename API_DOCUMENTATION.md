# MongoDB Wrapper API Documentation

This document describes the MongoDB wrapper API that maintains 100% compatibility with the previous JoshDB API.

## Overview

The MongoDB wrapper provides a simple key-value store interface using MongoDB as the backend. It maintains complete API compatibility with JoshDB, so no code changes are required in existing commands or features.

## Creating a Database Instance

```javascript
import { josh } from './functions/josh.js';

// Create a database instance
const db = josh('collectionName');
```

## Core Methods

### `get(key)`
Retrieve a value by key.

```javascript
const value = await db.get('userId');
// Returns: undefined if not found, or the stored value
```

### `set(key, value)`
Store a value for a key.

```javascript
await db.set('userId', { name: 'John', score: 100 });
// Returns: the value that was set
```

### `delete(key)`
Remove a key-value pair.

```javascript
const deleted = await db.delete('userId');
// Returns: true if deleted, false if not found
```

### `has(key)`
Check if a key exists.

```javascript
const exists = await db.has('userId');
// Returns: true or false
```

## Collection Properties

These are properties (not methods), so use them with `await`:

### `keys`
Get all keys in the collection.

```javascript
const keys = await db.keys;
// Returns: ['key1', 'key2', 'key3']
```

### `values`
Get all values in the collection.

```javascript
const values = await db.values;
// Returns: [value1, value2, value3]
```

### `entries`
Get all key-value pairs.

```javascript
const entries = await db.entries;
// Returns: [['key1', value1], ['key2', value2]]
```

### `size`
Get the number of entries.

```javascript
const size = await db.size;
// Returns: number of entries
```

## Advanced Methods

### `clear()`
Remove all entries from the collection.

```javascript
await db.clear();
```

### `forEach(callback)`
Execute a function for each entry.

```javascript
await db.forEach((value, key) => {
    console.log(`${key}: ${value}`);
});
```

### `getMany(keys)`
Get multiple values at once.

```javascript
const values = await db.getMany(['key1', 'key2', 'key3']);
// Returns: [value1, value2, value3]
```

### `setMany(entries)`
Set multiple key-value pairs at once.

```javascript
await db.setMany([
    ['key1', value1],
    ['key2', value2],
    ['key3', value3]
]);
```

### `filter(predicate)`
Find entries matching a condition.

```javascript
const matches = await db.filter((value, key) => {
    return value.score > 100;
});
// Returns: [['key1', value1], ['key2', value2]]
```

### `find(predicate)`
Find first entry matching a condition.

```javascript
const match = await db.find((value, key) => {
    return value.name === 'John';
});
// Returns: ['key', value] or undefined
```

### `map(mapper)`
Transform all entries.

```javascript
const scores = await db.map((value, key) => {
    return value.score;
});
// Returns: [100, 200, 300]
```

### `some(predicate)`
Check if any entry matches a condition.

```javascript
const hasHighScore = await db.some((value, key) => {
    return value.score > 1000;
});
// Returns: true or false
```

### `every(predicate)`
Check if all entries match a condition.

```javascript
const allValid = await db.every((value, key) => {
    return value.score >= 0;
});
// Returns: true or false
```

### `update(key, updater)`
Update a value using a function.

```javascript
await db.update('counter', (current) => (current || 0) + 1);
// Returns: the new value
```

### `ensure(key, defaultValue)`
Ensure a key exists with a default value.

```javascript
const value = await db.ensure('userId', { score: 0 });
// Returns: existing value or newly set default value
```

## Usage Examples

### Example 1: User Settings

```javascript
const settings = josh('userSettings');

// Set user settings
await settings.set(userId, {
    notifications: true,
    language: 'en',
    theme: 'dark'
});

// Get user settings
const userSettings = await settings.get(userId);

// Update a specific setting
await settings.update(userId, (current) => ({
    ...current,
    notifications: false
}));
```

### Example 2: Blacklist Management

```javascript
const blacklist = josh('blacklist');

// Add user to blacklist
await blacklist.set(userId, {
    reason: 'Spam',
    blacklistedBy: adminId,
    blacklistedAt: Date.now()
});

// Check if user is blacklisted
const isBlacklisted = await blacklist.has(userId);

// Get blacklist info
const info = await blacklist.get(userId);

// Remove from blacklist
await blacklist.delete(userId);

// Get all blacklisted users
const blacklistedUsers = await blacklist.keys;
```

### Example 3: Server Prefixes

```javascript
const prefixes = josh('prefix');

// Set custom prefix for a server
await prefixes.set(guildId, '!');

// Get server prefix or use default
const prefix = await prefixes.ensure(guildId, '&');

// Get all servers with custom prefixes
const allPrefixes = await prefixes.entries;
```

### Example 4: Statistics

```javascript
const stats = josh('stats/songsPlayed');

// Increment song count for a user
await stats.ensure(userId, 0);
await stats.update(userId, (count) => count + 1);

// Get total songs played by user
const songsPlayed = await stats.get(userId);

// Find top users
const allStats = await stats.entries;
const topUsers = allStats
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
```

### Example 5: Liked Songs

```javascript
const likedSongs = josh('likedSongs');

// Add a liked song
const userLikes = await likedSongs.ensure(userId, []);
userLikes.push({
    title: 'Song Name',
    artist: 'Artist Name',
    uri: 'spotify:track:...',
    addedAt: Date.now()
});
await likedSongs.set(userId, userLikes);

// Remove a liked song
const likes = await likedSongs.get(userId) || [];
const filtered = likes.filter(song => song.uri !== songUri);
await likedSongs.set(userId, filtered);

// Get all liked songs
const allLikes = await likedSongs.get(userId) || [];
```

## Migration from JoshDB

No code changes are required! The MongoDB wrapper provides the exact same API as JoshDB:

```javascript
// Old JoshDB code - still works!
const value = await client.db.prefix.get(guildId);
await client.db.blacklist.set(userId, data);
const keys = await client.db.twoFourSeven.keys;
const has = await client.db.ignore.has(channelId);
```

## Performance Considerations

1. **Batch Operations**: Use `setMany()` and `getMany()` for bulk operations
2. **Indexing**: MongoDB automatically indexes the `key` field for fast lookups
3. **Connections**: The wrapper reuses a single MongoDB connection
4. **Lazy Initialization**: Database connections are created on first use

## Error Handling

All methods are async and may throw errors. Always use try-catch:

```javascript
try {
    const value = await db.get('key');
    console.log(value);
} catch (error) {
    console.error('Database error:', error);
}
```

## Data Types

The wrapper supports all JSON-compatible data types:

- Strings
- Numbers
- Booleans
- Arrays
- Objects
- null

Complex nested objects are fully supported:

```javascript
await db.set('user', {
    profile: {
        name: 'John',
        settings: {
            notifications: true,
            privacy: {
                showEmail: false
            }
        }
    },
    stats: {
        level: 10,
        xp: 1500
    }
});
```

## Thread Safety

The MongoDB wrapper is safe for concurrent access from multiple processes or shards. MongoDB handles locking and consistency automatically.

## Backup and Restore

MongoDB provides built-in backup tools:

```bash
# Backup
mongodump --uri="mongodb://localhost:27017/nerox" --out=/backup/

# Restore
mongorestore --uri="mongodb://localhost:27017/nerox" /backup/nerox/
```

For MongoDB Atlas, use the web interface for automated backups.

## Monitoring

Check database stats:

```javascript
import mongoose from 'mongoose';

const stats = await mongoose.connection.db.stats();
console.log('Database size:', stats.dataSize);
console.log('Collections:', stats.collections);
console.log('Indexes:', stats.indexes);
```

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
