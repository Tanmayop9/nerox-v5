# Hybrid Database System

This bot uses a hybrid database architecture that combines **JoshDB** (local JSON storage) with **MongoDB** (cloud backup).

## Architecture

### Local Database (JoshDB)
- **Ultra-fast**: 0ms response time for all operations
- **Primary storage**: All operations happen on local JoshDB first
- **Always available**: Bot works even without internet/MongoDB

### MongoDB Backup
- **Asynchronous sync**: Operations are queued and synced in background
- **Non-blocking**: MongoDB never slows down bot operations
- **Automatic backup**: All local data is automatically backed up to MongoDB
- **Bidirectional sync**: Data can be restored from MongoDB on startup

## How It Works

1. **Read Operations**: Always instant from local JoshDB
2. **Write Operations**: 
   - Instant write to local JoshDB
   - Queued for background sync to MongoDB
3. **Startup Sync**: Bot pulls data from MongoDB to local storage (only for missing data)
4. **Background Worker**: Processes sync queue every 100ms in batches of 50 operations

## Configuration

Add MongoDB connection string to your `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nerox?retryWrites=true&w=majority
```

If no MongoDB URI is provided, the bot runs in **local-only mode** (ultra-fast).

## Benefits

✅ **0ms Database Speed**: All operations are instant  
✅ **Automatic Backup**: Data is safely backed up to MongoDB  
✅ **Disaster Recovery**: Data can be restored from MongoDB  
✅ **No Downtime**: Works even if MongoDB is down  
✅ **Multi-Instance**: Multiple bot instances can share MongoDB data  

## Monitoring

Each database instance has a `getSyncQueueLength()` method to monitor pending sync operations:

```javascript
const queueLength = client.db.botstaff.getSyncQueueLength();
console.log(`Pending sync operations: ${queueLength}`);
```
