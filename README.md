# NeroX v5 🎵

A feature-rich Discord music bot with **ultra-advanced** enterprise-grade features, premium capabilities, and comprehensive monitoring.

## 🚀 Features

### Core Features
- 🎵 High-quality music playback with multiple sources (Spotify, Apple Music, Deezer)
- 💎 Premium features for users and servers
- 🎫 Ticket system for support servers
- 🎁 Giveaway management
- 📊 Statistics tracking (songs played, commands used)
- ❤️ User liked songs
- 🔧 Customizable prefixes
- 🚫 Blacklist and moderation tools
- 📱 Web dashboard for database management
- ⚙️ 24/7 music mode

### 🚀 Ultra-Advanced Features
- **Advanced Caching System**: LRU cache with TTL for optimal performance
- **Circuit Breakers**: Prevents cascading failures in external services
- **Request Queue**: Manages concurrent operations with priority support
- **Retry Handler**: Exponential backoff for resilient operations
- **Performance Monitoring**: Real-time metrics and insights
- **Advanced Rate Limiting**: Tiered limits (default/premium/owner)
- **Health Check System**: HTTP endpoints for monitoring (port 3000)
- **Graceful Shutdown**: Ensures clean shutdown of all services
- **Analytics System**: Usage patterns and insights
- **Advanced Logging**: Log rotation and structured logging
- **Command Metrics**: Track performance and usage statistics

## 📦 Installation

### Prerequisites

- Node.js v20.x or higher
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/Tanmayop9/nerox-v5.git
cd nerox-v5
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Discord Bot Token
DISCORD_TOKEN=your_discord_bot_token

# Support Bot Token (for support server manager)
SUPPORT_BOT_TOKEN=your_support_bot_token

# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/nerox
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nerox

# Bot Configuration
OWNER_IDS=comma,separated,user,ids
SUPPORT_GUILD_ID=your_support_guild_id
SUPPORT_PREFIX=!
```

### 4. Set up MongoDB

**Option A: Local MongoDB**
1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use `mongodb://localhost:27017/nerox` as your connection string

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string and add it to `.env`

See [MONGODB_MIGRATION.md](MONGODB_MIGRATION.md) for detailed setup instructions.

### 5. Run the bot

```bash
# Start all services (main bot, support manager, dashboard)
npm start

# Or run individually:
npm run support      # Support server manager
npm run dashboard    # Web dashboard
```

## 🗄️ Database Migration

This project has been migrated from JoshDB (JSON files) to MongoDB. If you have existing data:

```bash
# Migrate existing JSON data to MongoDB
node scripts/migrate-to-mongodb.js
```

For more information, see [MONGODB_MIGRATION.md](MONGODB_MIGRATION.md).

## 🧪 Testing

Test the MongoDB connection:

```bash
node scripts/test-mongodb.js
```

## 📊 Dashboard

The web dashboard runs on port 20197 and provides:
- User interface for viewing database entries (no login required)
- Admin interface for managing all databases (requires login)
- Bulk operations (import, export, clear)

Access the dashboard at: `http://your-server-ip:20197`

Default admin credentials:
- Username: `admin`
- Password: `admin123`

**⚠️ Change these credentials in production!**

## 🔍 Monitoring & Health Checks

### Health Check Endpoints

The bot provides HTTP health check endpoints on port 3000 (configurable via `HEALTH_PORT` env variable):

- **`/health`** - Overall health status with component checks
- **`/metrics`** - Detailed performance metrics
- **`/stats`** - System statistics (cache, queue, circuit breakers)

Example:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/metrics
curl http://localhost:3000/stats
```

### Owner Commands for Monitoring

- **`metrics`** - View ultra-advanced system metrics
  - Subcommands: `cache`, `queue`, `circuit`, `performance`, `health`, `commands`, `slow`
  
- **`analytics`** - View usage analytics and insights
  - Subcommands: `summary`, `peak`, `users`, `guilds`, `user`, `guild`, `session`

Example usage:
```
&metrics cache         # View cache statistics
&metrics performance   # View performance metrics
&analytics summary     # View analytics summary
&analytics peak        # View peak usage hours
```

## 🏗️ Project Structure

```
nerox-v5/
├── src/
│   ├── classes/          # Bot classes (Client, Manager, etc.)
│   ├── commands/         # Command files
│   │   ├── information/  # Info commands
│   │   ├── likes/        # Liked songs commands
│   │   ├── mod/          # Moderation commands
│   │   ├── music/        # Music commands
│   │   ├── owner/        # Owner-only commands
│   │   └── settings/     # Settings commands
│   ├── events/           # Event handlers
│   ├── functions/        # Utility functions
│   │   ├── mongodb.js    # MongoDB connection
│   │   ├── mongoWrapper.js # MongoDB wrapper
│   │   └── josh.js       # Database interface
│   ├── dashboard/        # Web dashboard
│   ├── support-manager/  # Support server bot
│   └── utils/            # Utility modules
├── scripts/              # Migration and test scripts
├── .env.example          # Example environment variables
└── package.json          # Dependencies
```

## 🛠️ Technologies

### Core Technologies
- **Discord.js v14** - Discord bot framework
- **MongoDB & Mongoose** - Database and ODM
- **Express** - Web server for dashboard
- **Kazagumo** - Music system
- **Shoukaku** - Lavalink wrapper
- **Discord Hybrid Sharding** - Sharding support
- **EJS** - Templating engine

### Ultra-Advanced Systems
- **Advanced Caching** - LRU cache with TTL and statistics
- **Circuit Breakers** - Fault tolerance for external services
- **Request Queue** - Priority-based operation management
- **Retry Handler** - Exponential backoff with jitter
- **Performance Monitor** - Real-time metrics collection
- **Advanced Rate Limiter** - Tiered rate limiting system
- **Health Checks** - HTTP-based health monitoring
- **Graceful Shutdown** - Clean service termination
- **Analytics Engine** - Usage pattern tracking
- **Advanced Logger** - Structured logging with rotation

## 🔧 Development

### Build TypeScript

```bash
npm run build
```

### Lint code

```bash
npm run lint
```

### Format code

```bash
npm run format
```

### Development mode

```bash
npm run dev  # Lint, format, build, and start
```

## 📝 Commands

### Music Commands
- `play` - Play a song
- `pause/resume` - Pause/resume playback
- `skip` - Skip current song
- `queue` - View queue
- `nowplaying` - Current song info
- `volume` - Adjust volume
- `shuffle` - Shuffle queue
- `clear` - Clear queue
- `247` - Enable 24/7 mode
- And more...

### Likes Commands
- `like` - Like current song
- `unlike` - Unlike a song
- `showliked` - View liked songs
- `playliked` - Play liked songs
- `clearlikes` - Clear all likes

### Information Commands
- `help` - Command list
- `stats` - Bot statistics
- `ping` - Bot latency
- `profile` - User profile
- `config` - Server configuration
- `invite` - Invite link

### Moderation (Owner/Admin)
- `noPrefix` - Manage no-prefix servers
- `premium` - Manage premium users
- `serverpremium` - Manage premium servers
- `mod` - Bot moderator management
- `blacklist` - User blacklist

### Ultra-Advanced (Owner Only)
- `metrics` - View system performance metrics
  - Cache statistics, queue stats, circuit breakers
  - Performance data, health checks, command metrics
  - Slow operation detection
- `analytics` - View usage analytics
  - User and guild insights
  - Peak usage hours, session statistics
  - Command patterns and trends

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is for educational and demonstration purposes.

## 👨‍💻 Author

**Tanmay**

## 🐛 Issues

If you find any bugs or have feature requests, please open an issue on GitHub.

## 📧 Support

For support, email support@codes-for.fun.com or join our Discord support server.

---

Made with ❤️ by Tanmay
