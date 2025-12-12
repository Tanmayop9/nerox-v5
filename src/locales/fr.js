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
    welcomeBack: 'Bon retour, {user} !',
    wasAfkFor: 'Vous étiez AFK pendant **{time}**',
    userAfk: '**{user}** est actuellement AFK',
    reason: '**Raison :** {reason}',
    duration: '**Durée :** {time}',
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
  },

  // Queue/Player
  queue: {
    empty: 'La file d\'attente est vide.',
    nowPlaying: 'En cours de lecture',
    addedToQueue: 'Ajouté à la file',
    position: 'Position',
    duration: 'Durée',
    requestedBy: 'Demandé par',
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
