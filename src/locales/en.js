/**
 * English language translations
 * @default language
 */

export default {
  // Common
  common: {
    error: 'An error occurred',
    success: 'Success',
    loading: 'Loading...',
    cancel: 'Cancel',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    enabled: 'Enabled',
    disabled: 'Disabled',
    required: 'Required',
    optional: 'Optional',
  },

  // Help Command
  help: {
    title: 'Help',
    description: 'Displays the command list.',
    prefix: 'Prefix',
    commands: 'Commands',
    categories: 'categories',
    useGuide: 'Use `{prefix}<command> -guide` for command details',
    requireOptional: '`<>` = required | `[]` = optional',
    selectCategory: 'Select a category',
    home: 'Home',
    homeDesc: 'Main menu',
    allCommands: 'All Commands',
    allCommandsDesc: 'View all commands',
    totalCommands: 'Total: {count} commands',
    noCommands: 'No commands available',
    serversCount: '{count} servers',
  },

  // Ping Command
  ping: {
    title: 'Latency',
    checking: 'Checking latency...',
    websocket: 'WebSocket',
    database: 'Database',
    message: 'Message',
    requestedBy: 'Requested by {user}',
  },

  // Play Command
  play: {
    description: 'Play music using query',
    queryPrompt: 'what would you like to listen to ?',
    provideQuery: 'Please provide a query.',
    searching: 'Please wait while I search for relevant tracks.',
    noResults: 'No results found.',
    tooShort: 'Song/(s) of duration less than 30s cannot be played.',
    addedPlaylist: 'Added `{count}` from `{name}` to queue.',
    addedTrack: 'Added `{title}` to queue.',
  },

  // AFK System
  afk: {
    welcomeBack: 'Welcome back, {user}!',
    wasAfkFor: 'You were AFK for **{time}**',
    userAfk: '**{user}** is currently AFK',
    reason: '**Reason:** {reason}',
    duration: '**Duration:** {time}',
    lessThanMinute: 'less than a minute',
    setSuccess: 'Your AFK status has been set.',
    removed: 'Your AFK status has been removed.',
  },

  // Ticket System
  ticket: {
    title: 'Support Ticket',
    welcome: 'Welcome {user}, our team will assist you shortly.',
    closeFooter: 'Use the close command or button when your issue is resolved.',
    alreadyExists: 'You already have an open ticket: <#{id}>',
    created: 'Ticket created: <#{id}>',
    panelDeleted: 'This ticket panel no longer exists or was deleted.',
  },

  // Voice Channel
  voice: {
    notInVoice: 'You need to be in a voice channel.',
    notSameVoice: 'You need to be in the same voice channel as me.',
    noPlayer: 'There is no player in this server.',
  },

  // Queue/Player
  queue: {
    empty: 'The queue is empty.',
    nowPlaying: 'Now Playing',
    addedToQueue: 'Added to queue',
    position: 'Position',
    duration: 'Duration',
    requestedBy: 'Requested by',
  },

  // Errors
  errors: {
    noPermission: 'You do not have permission to use this command.',
    ownerOnly: 'This command is only available to bot owners.',
    cooldown: 'Please wait {time} before using this command again.',
    maintenance: 'The bot is currently under maintenance.',
    blacklisted: 'You are blacklisted from using this bot.',
    missingArgs: 'Missing required arguments.',
    invalidArgs: 'Invalid arguments provided.',
  },

  // Language Command
  language: {
    title: 'Language Settings',
    description: 'Change the bot language for this server',
    current: 'Current language: **{lang}**',
    available: 'Available languages',
    changed: 'Language changed to **{lang}**',
    invalid: 'Invalid language. Available: {langs}',
    selectLanguage: 'Select a language',
  },
};
