import moment from "moment";
import { readdirSync } from "fs";
import { Manager } from "./manager.js";
import { fileURLToPath } from "node:url";
import { emoji } from "../assets/emoji.js";
import format from "moment-duration-format";
import { hybridDB } from "../functions/hybridDB.js";
import { connectMongoDB } from "../functions/mongodb.js";
import { log } from "../logger.js";
import { dirname, resolve } from "node:path";
import { ExtendedEmbedBuilder } from "./embed.js";
import { ExtendedButtonBuilder } from "./button.js";
import { OAuth2Scopes } from "discord-api-types/v10";
import { readyEvent } from "../functions/readyEvent.js";
import { Client, Partials, Collection, GatewayIntentBits, WebhookClient } from "discord.js";
import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { config } from "./config.js";  // 🔥 Now loads config directly

format(moment);
const __dirname = dirname(fileURLToPath(import.meta.url));

export class ExtendedClient extends Client {
  constructor() {
    super({
      partials: [
        Partials.User,
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildMember,
        Partials.ThreadMember,
        Partials.GuildScheduledEvent,
      ],
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
      ],
      failIfNotExists: false,
      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
      allowedMentions: {
        repliedUser: false,
        parse: ["users", "roles"],
      },
    });

    this.emoji = emoji;
    this.config = config;
    this.webhooks = {}; // Will be initialized in ready event
    this.manager = Manager.init(this);
    this.underMaintenance = false;
    this.prefix = config.prefix || "&";
    this.owners = config.owners;
    this.admins = config.admins;

this.db = {
  noPrefix: hybridDB("noPrefix"),
  ticket: hybridDB("ticket"),
  botmods: hybridDB("botmods"),
  giveaway: hybridDB("giveaway"),
  mc: hybridDB("msgCount"),
  botstaff: hybridDB("botstaff"), // Bot premium users
  redeemCode: hybridDB("redeemCode"),
  serverstaff: hybridDB("serverstaff"), // Server premium 
  ignore: hybridDB("ignore"),
  bypass: hybridDB("bypass"),
  blacklist: hybridDB("blacklist"),
  config: hybridDB("config"), // Bot configuration (webhooks, etc.)
  prefix: hybridDB("prefix"), // Guild-specific prefixes
  afk: hybridDB("afk"), // AFK status
  spotify: hybridDB("spotify"), // Spotify user data
  likedSongs: hybridDB("likedSongs"), // User liked songs
  
  stats: {
    songsPlayed: hybridDB("stats/songsPlayed"),  
    commandsUsed: hybridDB("stats/commandsUsed"),    
    friends: hybridDB("stats/friends"), // Friends list  
    linkfireStreaks: hybridDB("stats/linkfireStreaks"), // Stores streak count for each user   
    lastLinkfire: hybridDB("stats/lastLinkfire"), // Tracks the last Linkfire timestamp   
  },  
  twoFourSeven: hybridDB("twoFourSeven"),
};

    this.dokdo = null;

    this.invite = {
      admin: () =>
        this.generateInvite({
          scopes: [OAuth2Scopes.Bot],
          permissions: ["Administrator"],
        }),
      required: () =>
        this.generateInvite({
          scopes: [OAuth2Scopes.Bot],
          permissions: [
            "ViewChannel",
            "SendMessages",
            "EmbedLinks",
            "AttachFiles",
            "ReadMessageHistory",
            "AddReactions",
            "Connect",
            "Speak",
            "UseVAD",
          ],
        }),
    };

    this.cluster = new ClusterClient(this);
    this.commands = new Collection();
    this.categories = readdirSync(resolve(__dirname, "../commands"));
    this.cooldowns = new Collection();

    this.connectToGateway = async () => {
      // Initialize MongoDB connection asynchronously (non-blocking)
      if (config.mongoUri) {
        connectMongoDB(config.mongoUri); // Fire and forget
        this.log('MongoDB connection initiated (background process)', 'info');
        
        // Enable sync after a short delay to allow connection
        setTimeout(() => {
          // Enable sync for all databases
          Object.keys(this.db).forEach(key => {
            if (key === 'stats') {
              Object.values(this.db.stats).forEach(db => db.enableSync());
            } else {
              this.db[key].enableSync();
            }
          });
          
          // Sync from MongoDB to local in background
          this.log('Syncing data from MongoDB to local storage (background)...', 'info');
          Promise.all([
            ...Object.keys(this.db).filter(k => k !== 'stats').map(key => this.db[key].syncFromMongoDB()),
            ...Object.values(this.db.stats).map(db => db.syncFromMongoDB())
          ]).then(() => {
            this.log('Background MongoDB sync complete', 'success');
          }).catch(err => {
            this.log('MongoDB sync failed (continuing with local data): ' + err.message, 'warn');
          });
        }, 2000); // Wait 2 seconds for MongoDB to connect
      } else {
        this.log('No MongoDB URI provided. Running in local-only mode (ultra-fast).', 'info');
      }
      
      await this.login(config.token);
      return this;
    };

    this.log = (message, type) => void log(message, type);
    this.sleep = async (s) => void (await new Promise((resolve) => setTimeout(resolve, s * 1000)));

    this.button = () => new ExtendedButtonBuilder();
    this.embed = (color) => new ExtendedEmbedBuilder(color || "#00ADB5");

    this.formatBytes = (bytes) => {
      const power = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${parseFloat((bytes / Math.pow(1024, power)).toFixed(2))} ${
        ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][power]
      }`;
    };

    this.formatDuration = (duration) =>
      moment.duration(duration, "milliseconds").format("d[d] h[h] m[m] s[s]", 0, {
        trim: "all",
      });

    this.getPlayer = (ctx) => this.manager.players.get(ctx.guild.id);

    // Webhooks are initialized in ready event after setupWebhooks

    this.on("debug", (data) => this.log(data));
    this.on("ready", async () => await readyEvent(this));
    this.on("messageUpdate", (_, m) => (m.partial ? null : this.emit("messageCreate", m)));
  }
}