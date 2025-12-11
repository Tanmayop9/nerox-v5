# MongoDB Migration Guide

This project has been migrated from JoshDB (JSON file-based storage) to MongoDB for better scalability and performance.

## What Changed

### Database System
- **Old**: JoshDB with JSON file storage (`@joshdb/core`, `@joshdb/json`)
- **New**: MongoDB with Mongoose ODM (`mongoose`)

### Storage Location
- **Old**: Local files in `database-storage/` directory
- **New**: MongoDB database (local or cloud-based)

## Setup Instructions

### 1. Install MongoDB

#### Option A: Local MongoDB
1. Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Linux/Mac
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the MongoDB URI:

```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string:

```env
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/nerox

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nerox
```

### 3. Install Dependencies

```bash
npm install
```

This will install `mongoose` (MongoDB driver) and remove the old `@joshdb` packages.

### 4. Data Migration (Optional)

If you have existing data in the `database-storage/` directory, you can migrate it to MongoDB using the migration script:

```bash
node scripts/migrate-to-mongodb.js
```

**Note**: This script will be provided separately if needed.

### 5. Run the Bot

```bash
npm start
```

## API Compatibility

The MongoDB wrapper maintains **100% API compatibility** with the old JoshDB interface. All existing code works without changes:

```javascript
// These work exactly the same as before:
await client.db.blacklist.set(userId, data);
const value = await client.db.prefix.get(guildId);
await client.db.config.delete(key);
const has = await client.db.ignore.has(channelId);
const keys = await client.db.botstaff.keys;
const size = await client.db.twoFourSeven.size;
```

## Collections

The following MongoDB collections will be created automatically:

- `noPrefix` - Servers with no prefix requirement
- `ticket` - Ticket system data
- `botmods` - Bot moderators
- `giveaway` - Giveaway data
- `msgCount` - Message count statistics
- `botstaff` - Premium bot users
- `redeemCode` - Redeem codes
- `serverstaff` - Premium server data
- `ignore` - Ignored channels
- `bypass` - Bypass settings
- `blacklist` - Blacklisted users
- `config` - Bot configuration
- `prefix` - Custom guild prefixes
- `afk` - AFK status
- `spotify` - Spotify user data
- `likedSongs` - User liked songs
- `stats_songsPlayed` - Songs played statistics
- `stats_commandsUsed` - Commands used statistics
- `stats_friends` - Friends list
- `stats_linkfireStreaks` - Linkfire streak data
- `stats_lastLinkfire` - Last Linkfire timestamp
- `twoFourSeven` - 24/7 mode data
- `support_giveaways` - Support server giveaways
- `support_tickets` - Support tickets
- `support_ticketConfig` - Ticket configuration
- `support_ticketTranscripts` - Ticket transcripts
- `support_warnings` - User warnings
- `support_logs` - Moderation logs

## Benefits of MongoDB

1. **Scalability**: Handle millions of records efficiently
2. **Performance**: Faster queries with proper indexing
3. **Reliability**: ACID compliance and data durability
4. **Flexibility**: Easy to query and analyze data
5. **Cloud-ready**: Works with MongoDB Atlas for cloud deployment
6. **Backup**: Built-in backup and restore capabilities
7. **Concurrent Access**: Multiple processes can safely access the same database

## Troubleshooting

### Connection Issues

If you get connection errors:

1. Check if MongoDB is running:
   ```bash
   # Linux/Mac
   sudo systemctl status mongod
   
   # Windows
   sc query MongoDB
   ```

2. Verify your connection string in `.env`

3. Check firewall settings (MongoDB uses port 27017 by default)

### Authentication Issues

For MongoDB Atlas:
- Whitelist your IP address in Atlas dashboard
- Ensure username/password are correct in connection string
- Check database user permissions

### Data Not Showing

The database will be empty initially. Data will be created as the bot runs and users interact with it.

## Rollback (Emergency Only)

If you need to rollback to JoshDB:

1. Restore the old `package.json`
2. Run `npm install`
3. Restore the old `src/functions/josh.js`
4. Ensure `database-storage/` directory exists

**Note**: This is not recommended. Fix MongoDB issues instead.

## Support

For issues or questions about the MongoDB migration, please open an issue on GitHub.
