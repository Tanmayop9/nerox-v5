/**
 * French language translations
 * @language fr
 */

export default {
  // Common
  common: {
    error: 'Une erreur s\'est produite',
    success: 'Succès',
    loading: 'Chargement...',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non',
    enabled: 'Activé',
    disabled: 'Désactivé',
    required: 'Requis',
    optional: 'Optionnel',
    page: 'Page',
    total: 'Total',
    duration: 'Durée',
    nowPlaying: 'En cours',
    upNext: 'À suivre',
    alreadyPlayed: 'Déjà joué',
    live: 'DIRECT',
    loop: 'Boucle',
    volume: 'Volume',
    off: 'Désactivé',
  },

  // Help Command
  help: {
    title: 'Aide',
    description: 'Affiche la liste des commandes.',
    prefix: 'Préfixe',
    commands: 'Commandes',
    categories: 'catégories',
    useGuide: 'Utilisez `{prefix}<commande> -guide` pour les détails',
    requireOptional: '`<>` = requis | `[]` = optionnel',
    selectCategory: 'Sélectionner une catégorie',
    home: 'Accueil',
    homeDesc: 'Menu principal',
    allCommands: 'Toutes les Commandes',
    allCommandsDesc: 'Voir toutes les commandes',
    totalCommands: 'Total : {count} commandes',
    noCommands: 'Aucune commande disponible',
    serversCount: '{count} serveurs',
  },

  // Ping Command
  ping: {
    title: 'Latence',
    checking: 'Vérification de la latence...',
    websocket: 'WebSocket',
    database: 'Base de données',
    message: 'Message',
    requestedBy: 'Demandé par {user}',
  },

  // Play Command
  play: {
    description: 'Jouer de la musique avec une requête',
    queryPrompt: 'qu\'aimeriez-vous écouter ?',
    provideQuery: 'Veuillez fournir une requête.',
    searching: 'Veuillez patienter pendant que je recherche des pistes pertinentes.',
    noResults: 'Aucun résultat trouvé.',
    tooShort: 'Les chansons de moins de 30s ne peuvent pas être jouées.',
    addedPlaylist: 'Ajouté `{count}` de `{name}` à la file d\'attente.',
    addedTrack: 'Ajouté `{title}` à la file d\'attente.',
  },

  // AFK System
  afk: {
    description: 'Définir votre statut AFK',
    reasonPrompt: 'Raison de l\'AFK',
    activated: 'Mode AFK Activé',
    defaultReason: 'Aucune raison fournie',
    notifyOthers: 'Je notifierai les autres quand ils vous mentionneront !',
    welcomeBack: 'Bon retour, {user} !',
    wasAfkFor: 'Vous étiez AFK pendant **{time}**',
    userAfk: '**{user}** est actuellement AFK',
    reason: '**Raison :** {reason}',
    durationLabel: '**Durée :** {time}',
    lessThanMinute: 'moins d\'une minute',
    setSuccess: 'Votre statut AFK a été défini.',
    removed: 'Votre statut AFK a été supprimé.',
  },

  // Ticket System
  ticket: {
    title: 'Ticket de Support',
    welcome: 'Bienvenue {user}, notre équipe vous assistera sous peu.',
    closeFooter: 'Utilisez la commande ou le bouton de fermeture lorsque votre problème est résolu.',
    alreadyExists: 'Vous avez déjà un ticket ouvert : <#{id}>',
    created: 'Ticket créé : <#{id}>',
    panelDeleted: 'Ce panneau de ticket n\'existe plus ou a été supprimé.',
  },

  // Voice Channel
  voice: {
    notInVoice: 'Vous devez être dans un canal vocal.',
    notSameVoice: 'Vous devez être dans le même canal vocal que moi.',
    noPlayer: 'Il n\'y a pas de lecteur dans ce serveur.',
    joined: 'Rejoint {channel}',
    left: 'A quitté le canal vocal',
    alreadyConnected: 'Je suis déjà connecté à un canal vocal',
  },

  // Queue/Player
  queue: {
    title: 'File d\'attente de {bot}',
    description: 'Voici ce qui joue et ce qui arrive !',
    empty: 'La file d\'attente est vide.',
    nowPlaying: 'En cours de lecture',
    addedToQueue: 'Ajouté à la file',
    position: 'Position',
    duration: 'Durée',
    requestedBy: 'Demandé par',
    totalTracks: 'Actuellement dans la file : **{count} piste{s}** avec une durée totale de **{duration}** !',
    pageInfo: 'Page {current}/{total} • Boucle : {loop} • Volume : {volume}%',
    noMoreSongs: 'Plus de chansons à passer dans la file.',
    skipped: '{title} passé.',
    cleared: 'File d\'attente vidée avec succès.',
    clearedFilters: 'Effacement de tous les filtres appliqués...',
    shuffled: 'File d\'attente mélangée avec succès.',
    paused: 'Lecteur mis en pause.',
    resumed: 'Lecteur repris.',
    stopped: 'Lecteur arrêté et file d\'attente vidée.',
    volumeSet: 'Volume défini à {volume}%.',
    volumeInvalid: 'Le volume doit être entre 0 et 150.',
    seeked: 'Recherché à {position}.',
    seekInvalid: 'Position de recherche invalide.',
    alreadyPaused: 'Le lecteur est déjà en pause.',
    alreadyPlaying: 'Le lecteur joue déjà.',
  },

  // Music Commands
  music: {
    autoplayEnabled: 'Lecture automatique activée.',
    autoplayDisabled: 'Lecture automatique désactivée.',
    enhanceEnabled: 'Amélioration audio activée.',
    enhanceDisabled: 'Amélioration audio désactivée.',
    noPrevious: 'Il n\'y a pas de piste précédente.',
    playingPrevious: 'Lecture de la piste précédente.',
    radioPlaying: 'Lecture de la radio : {station}',
    radioInvalid: 'Station de radio invalide.',
    similarPlaying: 'Lecture de chansons similaires à {title}.',
    similarNone: 'Impossible de trouver des chansons similaires.',
    nowPlayingTitle: 'En cours de lecture',
    requestedBy: 'Demandé par',
    position: '{current} / {total}',
    enabled247: 'Mode 24/7 activé.',
    disabled247: 'Mode 24/7 désactivé.',
  },

  // Likes Commands
  likes: {
    liked: '**{title}** ajouté à vos chansons aimées.',
    unliked: '**{title}** retiré de vos chansons aimées.',
    notLiked: 'Cette chanson n\'est pas dans vos chansons aimées.',
    cleared: 'Toutes vos chansons aimées ont été effacées.',
    noLiked: 'Vous n\'avez pas de chansons aimées.',
    likedList: 'Vos Chansons Aimées',
    playing: 'Lecture de vos chansons aimées.',
    total: 'Total : {count} chanson{s}',
  },

  // Info Commands
  info: {
    avatar: 'Avatar de **{user}**',
    botInfo: 'Informations sur le Bot',
    stats: 'Statistiques',
    invite: 'Lien d\'Invitation',
    inviteDesc: 'Invitez-moi sur votre serveur !',
    support: 'Serveur de Support',
    uptime: 'Temps de fonctionnement',
    servers: 'Serveurs',
    users: 'Utilisateurs',
    channels: 'Canaux',
    memory: 'Mémoire',
    cpu: 'CPU',
    library: 'Bibliothèque',
    nodeVersion: 'Node.js',
    profile: 'Profil',
    songsPlayed: 'Chansons Jouées',
    commandsUsed: 'Commandes Utilisées',
    ignored: '{target} ajouté à la liste d\'ignorés.',
    unignored: '{target} retiré de la liste d\'ignorés.',
  },

  // Settings Commands
  settings: {
    prefix: 'Paramètres de Préfixe',
    prefixCurrent: 'Préfixe Actuel : `{prefix}`',
    prefixChanged: 'Préfixe Mis à Jour Avec Succès !',
    prefixNew: '**Nouveau Préfixe :** `{prefix}`',
    prefixExample: '**Exemple :** `{prefix}play nom de la chanson`',
    prefixTooLong: 'Le préfixe doit faire maximum 2 caractères !',
    prefixNoEmoji: 'Le préfixe ne peut pas contenir d\'emojis !',
    prefixInvalid: 'Le préfixe doit contenir uniquement des lettres, chiffres et symboles.',
    prefixUse: 'Utilisez `{prefix}prefix <nouveau_préfixe>` pour le changer.',
  },

  // Errors
  errors: {
    noPermission: 'Vous n\'avez pas la permission d\'utiliser cette commande.',
    ownerOnly: 'Cette commande est uniquement disponible pour les propriétaires du bot.',
    cooldown: 'Veuillez attendre {time} avant d\'utiliser à nouveau cette commande.',
    maintenance: 'Le bot est actuellement en maintenance.',
    blacklisted: 'Vous êtes sur liste noire et ne pouvez pas utiliser ce bot.',
    missingArgs: 'Arguments requis manquants.',
    invalidArgs: 'Arguments invalides fournis.',
    notPlaying: 'Rien ne joue actuellement.',
    notInVoice: 'Vous devez être dans un canal vocal.',
    notInSameVoice: 'Vous devez être dans le même canal vocal que moi.',
    noPlayer: 'Il n\'y a pas de lecteur actif.',
    error: 'Une erreur s\'est produite lors de l\'exécution de cette commande.',
  },

  // Language Command
  language: {
    title: 'Paramètres de Langue',
    description: 'Changer votre langue du bot',
    current: 'Langue actuelle : **{lang}**',
    available: 'Langues disponibles',
    changed: 'Langue changée en **{lang}**',
    invalid: 'Langue invalide. Disponibles : {langs}',
    selectLanguage: 'Sélectionner une langue',
  },
};
