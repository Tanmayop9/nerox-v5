/**
 * @nerox Support Server Manager
 * @author Tanmay
 * @copyright 2024 NeroX Studios
 * 
 * This is a support server manager bot that shares the database
 * with the main NeroX bot. It handles giveaways, moderation,
 * and server management for the NeroX support server.
 */

import { config as loadEnv } from 'dotenv';
import { Client, GatewayIntentBits, Collection, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { hybridDB } from '../functions/hybridDB.js';
import { connectMongoDB } from '../functions/mongodb.js';
import { log } from '../logger.js';
import { readdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

loadEnv();

const __dirname = dirname(fileURLToPath(import.meta.url));

class SupportManager extends Client {
    constructor() {
        super({
            partials: [
                Partials.User,
                Partials.Channel,
                Partials.Message,
                Partials.Reaction,
                Partials.GuildMember,
            ],
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessageReactions,
            ],
            allowedMentions: {
                repliedUser: false,
                parse: ['users', 'roles'],
            },
        });

        // Shared database with main bot
        this.db = {
            noPrefix: hybridDB('noPrefix'),
            botstaff: hybridDB('botstaff'),
            serverstaff: hybridDB('serverstaff'),
            redeemCode: hybridDB('redeemCode'),
            blacklist: hybridDB('blacklist'),
            twoFourSeven: hybridDB('twoFourSeven'),
            giveaways: hybridDB('support/giveaways'),
            tickets: hybridDB('support/tickets'),
            ticketConfig: hybridDB('support/ticketConfig'),
            ticketTranscripts: hybridDB('support/ticketTranscripts'),
            warnings: hybridDB('support/warnings'),
            logs: hybridDB('support/logs'),
        };

        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.prefix = process.env.SUPPORT_PREFIX || '!';
        this.supportGuild = process.env.SUPPORT_GUILD_ID;
        this.owners = process.env.OWNER_IDS?.split(',') || [];

        this.colors = {
            primary: '#000000',
            success: '#000000',
            error: '#000000',
            warning: '#000000',
            info: '#000000',
        };

        this.emoji = {
    check: '<:neroxCheck:1446475406864683222>',
    cross: '<:NeroxNope:1446475361494765639>',
    info: '<:neroxinfo:1446475383481303052>',
    warn: '<:NeroxNope:1446475361494765639>',
    giveaway: '<:Giveaway:1447140003778920521>',
    premium: '<:neroxinfo:1446475383481303052>',
    noprefix: '<:neroxinfo:1446475383481303052>',
    ticket: '🎫',
    star: '<:neroxinfo:1446475383481303052>',
    heart: '<:neroxinfo:1446475383481303052>',
    sparkle: '<:neroxinfo:1446475383481303052>',
};
    }

    embed(color = this.colors.primary) {
        return new EmbedBuilder().setColor(color);
    }

    button() {
        return new ButtonBuilder();
    }

    async loadCommands() {
        const commandFiles = readdirSync(resolve(__dirname, './commands')).filter(f => f.endsWith('.js'));
        
        for (const file of commandFiles) {
            const command = (await import(`./commands/${file}`)).default;
            if (command.name) {
                this.commands.set(command.name, command);
                log(`[Support Manager] Loaded command: ${command.name}`, 'info');
            }
        }
    }

    async loadEvents() {
        const eventFiles = readdirSync(resolve(__dirname, './events')).filter(f => f.endsWith('.js'));
        
        for (const file of eventFiles) {
            const event = (await import(`./events/${file}`)).default;
            if (event.name) {
                if (event.once) {
                    this.once(event.name, (...args) => event.execute(this, ...args));
                } else {
                    this.on(event.name, (...args) => event.execute(this, ...args));
                }
                log(`[Support Manager] Loaded event: ${event.name}`, 'info');
            }
        }
    }

    async start() {
        await this.loadCommands();
        await this.loadEvents();
        
        // Initialize MongoDB connection asynchronously (non-blocking)
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (mongoUri) {
            connectMongoDB(mongoUri); // Fire and forget
            log('[Support Manager] MongoDB connection initiated (background process)', 'info');
            
            // Enable sync after a short delay to allow connection
            setTimeout(() => {
                // Enable sync for all databases
                Object.values(this.db).forEach(db => db.enableSync());
                
                // Sync from MongoDB to local in background
                log('[Support Manager] Syncing data from MongoDB to local storage (background)...', 'info');
                Promise.all(Object.values(this.db).map(db => db.syncFromMongoDB())).then(() => {
                    log('[Support Manager] Background MongoDB sync complete', 'success');
                }).catch(err => {
                    log('[Support Manager] MongoDB sync failed (continuing with local data): ' + err.message, 'warn');
                });
            }, 2000); // Wait 2 seconds for MongoDB to connect
        } else {
            log('[Support Manager] No MongoDB URI provided. Running in local-only mode (ultra-fast).', 'info');
        }
        
        await this.login(process.env.SUPPORT_BOT_TOKEN);
        log('[Support Manager] Bot started successfully!', 'info');
    }
}

// Export the client instance
const supportManager = new SupportManager();
export default supportManager;

// Start the bot if this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    supportManager.start();
}
