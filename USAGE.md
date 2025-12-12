# Hybrid Database Usage Examples

## Setup

Add to your `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nerox?retryWrites=true&w=majority
```

If not provided, bot runs in local-only mode (ultra-fast).

## Basic Usage

The database API remains the same as before. All operations are instant:

```javascript
// Set data (instant, syncs to MongoDB in background)
await client.db.botstaff.set(userId, {
    premium: true,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
});

// Get data (instant from local)
const userData = await client.db.botstaff.get(userId);

// Delete data (instant, syncs to MongoDB in background)
await client.db.botstaff.delete(userId);

// Check if exists (instant)
const hasPremium = await client.db.botstaff.has(userId);

// Get all keys (instant)
const allUsers = await client.db.botstaff.keys;

// Increment counter (instant, syncs to MongoDB in background)
await client.db.stats.songsPlayed.inc(guildId);

// Push to array (instant, syncs to MongoDB in background)
await client.db.botmods.push(guildId, moderatorId);
```

## Monitoring

Check sync queue length to monitor pending operations:

```javascript
// Get pending sync operations count
const queueLength = client.db.botstaff.getSyncQueueLength();
console.log(`Pending MongoDB sync operations: ${queueLength}`);
```

## How It Works

1. **Write Operations**:
   - Data written to local JoshDB instantly (0ms)
   - Operation queued for MongoDB sync
   - Sync happens in background every 100ms

2. **Read Operations**:
   - Always read from local JoshDB (0ms)
   - Never waits for MongoDB

3. **Startup**:
   - MongoDB connection initiated (non-blocking)
   - After 2 seconds, sync worker starts
   - Missing data pulled from MongoDB to local
   - Bot ready immediately, sync happens in background

## Performance

- **Local operations**: 0ms (instant)
- **MongoDB sync**: Background, batched (50 ops per 100ms)
- **Queue size**: Max 10,000 operations (memory safe)
- **Resilience**: Bot works even if MongoDB is down

## Notes

- All database operations remain synchronous in your code
- No code changes needed (API compatible with original JoshDB)
- MongoDB sync is completely transparent
- No performance impact on bot operations
