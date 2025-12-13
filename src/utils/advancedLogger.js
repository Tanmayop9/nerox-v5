/**
 * Advanced Logging System with Log Levels and Rotation
 * @author NeroX Ultra Advanced System
 */

import { writeFile, mkdir, readdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export class AdvancedLogger {
    constructor(options = {}) {
        this.logDir = options.logDir || './logs';
        this.maxLogFiles = options.maxLogFiles || 7; // Keep last 7 days
        this.maxLogSize = options.maxLogSize || 10 * 1024 * 1024; // 10MB
        this.logLevel = options.logLevel || 'info';
        this.currentLogFile = null;
        this.currentLogSize = 0;
        this.buffer = [];
        this.bufferSize = options.bufferSize || 100;
        this.flushInterval = options.flushInterval || 5000; // 5 seconds
        
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3,
            trace: 4,
        };

        this.init();
    }

    /**
     * Initialize logger
     */
    async init() {
        try {
            if (!existsSync(this.logDir)) {
                await mkdir(this.logDir, { recursive: true });
            }
            await this.rotateIfNeeded();
            this.startFlushInterval();
        } catch (error) {
            console.error('Failed to initialize logger:', error);
        }
    }

    /**
     * Log message
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {Object} meta - Additional metadata
     */
    log(level, message, meta = {}) {
        if (this.levels[level] > this.levels[this.logLevel]) {
            return;
        }

        const entry = {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            ...meta,
        };

        this.buffer.push(entry);

        // Console output with colors
        this.consoleLog(entry);

        // Flush if buffer is full
        if (this.buffer.length >= this.bufferSize) {
            this.flush();
        }
    }

    /**
     * Console output with colors
     * @param {Object} entry - Log entry
     */
    consoleLog(entry) {
        const colors = {
            ERROR: '\x1b[31m', // Red
            WARN: '\x1b[33m',  // Yellow
            INFO: '\x1b[36m',  // Cyan
            DEBUG: '\x1b[35m', // Magenta
            TRACE: '\x1b[90m', // Gray
        };
        const reset = '\x1b[0m';
        const color = colors[entry.level] || '';
        
        console.log(`${color}[${entry.timestamp}] [${entry.level}]${reset} ${entry.message}`);
    }

    /**
     * Flush buffer to file
     */
    async flush() {
        if (this.buffer.length === 0) return;

        const entries = [...this.buffer];
        this.buffer = [];

        try {
            await this.rotateIfNeeded();
            
            const logData = entries.map(e => JSON.stringify(e)).join('\n') + '\n';
            await writeFile(this.currentLogFile, logData, { flag: 'a' });
            this.currentLogSize += Buffer.byteLength(logData);
        } catch (error) {
            console.error('Failed to flush logs:', error);
            // Put entries back in buffer
            this.buffer.unshift(...entries);
        }
    }

    /**
     * Start flush interval
     */
    startFlushInterval() {
        setInterval(() => this.flush(), this.flushInterval);
    }

    /**
     * Rotate log file if needed
     */
    async rotateIfNeeded() {
        const date = new Date().toISOString().split('T')[0];
        const filename = join(this.logDir, `nerox-${date}.log`);

        if (this.currentLogFile !== filename) {
            await this.flush();
            this.currentLogFile = filename;
            this.currentLogSize = 0;
            await this.cleanOldLogs();
        } else if (this.currentLogSize >= this.maxLogSize) {
            await this.flush();
            const timestamp = Date.now();
            this.currentLogFile = join(this.logDir, `nerox-${date}-${timestamp}.log`);
            this.currentLogSize = 0;
        }
    }

    /**
     * Clean old log files
     */
    async cleanOldLogs() {
        try {
            const files = await readdir(this.logDir);
            const logFiles = files
                .filter(f => f.startsWith('nerox-') && f.endsWith('.log'))
                .sort()
                .reverse();

            // Keep only the most recent files
            const filesToDelete = logFiles.slice(this.maxLogFiles);
            
            for (const file of filesToDelete) {
                await unlink(join(this.logDir, file));
            }
        } catch (error) {
            console.error('Failed to clean old logs:', error);
        }
    }

    /**
     * Convenience methods
     */
    error(message, meta) { this.log('error', message, meta); }
    warn(message, meta) { this.log('warn', message, meta); }
    info(message, meta) { this.log('info', message, meta); }
    debug(message, meta) { this.log('debug', message, meta); }
    trace(message, meta) { this.log('trace', message, meta); }
}

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
