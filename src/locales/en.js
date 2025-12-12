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
    page: 'Page',
    total: 'Total',
    duration: 'Duration',
    nowPlaying: 'Now Playing',
    upNext: 'Up next',
    alreadyPlayed: 'Already played',
    live: 'LIVE',
    loop: 'Loop',
    volume: 'Volume',
    off: 'Off',
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
    description: 'Set yourself as AFK',
    reasonPrompt: 'Reason for being AFK',
    activated: 'AFK Mode Activated',
    defaultReason: 'No reason provided',
    notifyOthers: 'I\'ll notify others when they mention you!',
    welcomeBack: 'Welcome back, {user}!',
    wasAfkFor: 'You were AFK for **{time}**',
    userAfk: '**{user}** is currently AFK',
    reason: '**Reason:** {reason}',
    durationLabel: '**Duration:** {time}',
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
    joined: 'Joined {channel}',
    left: 'Left the voice channel',
    alreadyConnected: 'I\'m already connected to a voice channel',
  },

  // Queue/Player
  queue: {
    title: '{bot}\'s Queue',
    description: 'Here\'s what\'s playing and coming up!',
    empty: 'The queue is empty.',
    nowPlaying: 'Now Playing',
    addedToQueue: 'Added to queue',
    position: 'Position',
    duration: 'Duration',
    requestedBy: 'Requested by',
    totalTracks: 'Currently in the queue: **{count} track{s}** with a total duration of **{duration}**!',
    pageInfo: 'Page {current}/{total} • Loop: {loop} • Volume: {volume}%',
    noMoreSongs: 'No more songs left in the queue to skip.',
    skipped: 'Skipped {title}.',
    cleared: 'Queue cleared successfully.',
    shuffled: 'Queue shuffled successfully.',
    paused: 'Paused the player.',
    resumed: 'Resumed the player.',
    stopped: 'Stopped the player and cleared the queue.',
    volumeSet: 'Volume set to {volume}%.',
    volumeInvalid: 'Volume must be between 0 and 200.',
    seeked: 'Seeked to {position}.',
    seekInvalid: 'Invalid seek position.',
    alreadyPaused: 'Player is already paused.',
    alreadyPlaying: 'Player is already playing.',
  },

  // Music Commands
  music: {
    autoplayEnabled: 'Autoplay enabled.',
    autoplayDisabled: 'Autoplay disabled.',
    enhanceEnabled: 'Audio enhancement enabled.',
    enhanceDisabled: 'Audio enhancement disabled.',
    noPrevious: 'There is no previous track.',
    playingPrevious: 'Playing previous track.',
    radioPlaying: 'Playing radio: {station}',
    radioInvalid: 'Invalid radio station.',
    similarPlaying: 'Playing similar songs to {title}.',
    similarNone: 'Could not find similar songs.',
    nowPlayingTitle: 'Now Playing',
    requestedBy: 'Requested by',
    position: '{current} / {total}',
    enabled247: '24/7 mode enabled.',
    disabled247: '24/7 mode disabled.',
  },

  // Likes Commands
  likes: {
    liked: 'Added **{title}** to your liked songs.',
    unliked: 'Removed **{title}** from your liked songs.',
    notLiked: 'This song is not in your liked songs.',
    cleared: 'Cleared all your liked songs.',
    noLiked: 'You have no liked songs.',
    likedList: 'Your Liked Songs',
    playing: 'Playing your liked songs.',
    total: 'Total: {count} song{s}',
  },

  // Info Commands
  info: {
    avatar: '**{user}**\'s Avatar',
    botInfo: 'Bot Information',
    stats: 'Statistics',
    invite: 'Invite Link',
    inviteDesc: 'Invite me to your server!',
    support: 'Support Server',
    uptime: 'Uptime',
    servers: 'Servers',
    users: 'Users',
    channels: 'Channels',
    memory: 'Memory',
    cpu: 'CPU',
    library: 'Library',
    nodeVersion: 'Node.js',
    profile: 'Profile',
    songsPlayed: 'Songs Played',
    commandsUsed: 'Commands Used',
    ignored: 'Added {target} to ignore list.',
    unignored: 'Removed {target} from ignore list.',
  },

  // Settings Commands
  settings: {
    prefix: 'Prefix Settings',
    prefixCurrent: 'Current Prefix: `{prefix}`',
    prefixChanged: 'Prefix Updated Successfully!',
    prefixNew: '**New Prefix:** `{prefix}`',
    prefixExample: '**Example:** `{prefix}play song name`',
    prefixTooLong: 'Prefix must be maximum 2 characters long!',
    prefixNoEmoji: 'Prefix cannot contain emojis!',
    prefixInvalid: 'Prefix must contain only letters, numbers, and symbols.',
    prefixUse: 'Use `{prefix}prefix <new_prefix>` to change it.',
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
    notPlaying: 'Nothing is currently playing.',
    notInVoice: 'You need to be in a voice channel.',
    notInSameVoice: 'You need to be in the same voice channel as me.',
    noPlayer: 'There is no active player.',
    error: 'An error occurred while executing this command.',
  },

  // Language Command
  language: {
    title: 'Language Settings',
    description: 'Change your bot language preference',
    current: 'Current language: **{lang}**',
    available: 'Available languages',
    changed: 'Language changed to **{lang}**',
    invalid: 'Invalid language. Available: {langs}',
    selectLanguage: 'Select a language',
  },
};
