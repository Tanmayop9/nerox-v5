/**
 * Spanish language translations
 * @language es
 */

export default {
  // Common
  common: {
    error: 'Ocurrió un error',
    success: 'Éxito',
    loading: 'Cargando...',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    yes: 'Sí',
    no: 'No',
    enabled: 'Habilitado',
    disabled: 'Deshabilitado',
    required: 'Requerido',
    optional: 'Opcional',
    page: 'Página',
    total: 'Total',
    duration: 'Duración',
    nowPlaying: 'Reproduciendo',
    upNext: 'Siguiente',
    alreadyPlayed: 'Ya reproducido',
    live: 'EN VIVO',
    loop: 'Repetir',
    volume: 'Volumen',
    off: 'Desactivado',
  },

  // Help Command
  help: {
    title: 'Ayuda',
    description: 'Muestra la lista de comandos.',
    prefix: 'Prefijo',
    commands: 'Comandos',
    categories: 'categorías',
    useGuide: 'Use `{prefix}<comando> -guide` para detalles del comando',
    requireOptional: '`<>` = requerido | `[]` = opcional',
    selectCategory: 'Seleccionar una categoría',
    home: 'Inicio',
    homeDesc: 'Menú principal',
    allCommands: 'Todos los Comandos',
    allCommandsDesc: 'Ver todos los comandos',
    totalCommands: 'Total: {count} comandos',
    noCommands: 'No hay comandos disponibles',
    serversCount: '{count} servidores',
  },

  // Ping Command
  ping: {
    title: 'Latencia',
    checking: 'Verificando latencia...',
    websocket: 'WebSocket',
    database: 'Base de datos',
    message: 'Mensaje',
    requestedBy: 'Solicitado por {user}',
  },

  // Play Command
  play: {
    description: 'Reproducir música usando consulta',
    queryPrompt: '¿qué te gustaría escuchar?',
    provideQuery: 'Por favor proporciona una consulta.',
    searching: 'Por favor espera mientras busco pistas relevantes.',
    noResults: 'No se encontraron resultados.',
    tooShort: 'Canciones de menos de 30s no se pueden reproducir.',
    addedPlaylist: 'Agregado `{count}` de `{name}` a la cola.',
    addedTrack: 'Agregado `{title}` a la cola.',
  },

  // AFK System
  afk: {
    description: 'Establecer tu estado AFK',
    reasonPrompt: 'Razón para estar AFK',
    activated: 'Modo AFK Activado',
    defaultReason: 'Sin razón proporcionada',
    notifyOthers: '¡Notificaré a otros cuando te mencionen!',
    welcomeBack: '¡Bienvenido de nuevo, {user}!',
    wasAfkFor: 'Estuviste AFK por **{time}**',
    userAfk: '**{user}** está actualmente AFK',
    reason: '**Razón:** {reason}',
    durationLabel: '**Duración:** {time}',
    lessThanMinute: 'menos de un minuto',
    setSuccess: 'Tu estado AFK ha sido establecido.',
    removed: 'Tu estado AFK ha sido eliminado.',
  },

  // Ticket System
  ticket: {
    title: 'Ticket de Soporte',
    welcome: 'Bienvenido {user}, nuestro equipo te ayudará pronto.',
    closeFooter: 'Usa el comando o botón de cerrar cuando tu problema esté resuelto.',
    alreadyExists: 'Ya tienes un ticket abierto: <#{id}>',
    created: 'Ticket creado: <#{id}>',
    panelDeleted: 'Este panel de tickets ya no existe o fue eliminado.',
  },

  // Voice Channel
  voice: {
    notInVoice: 'Necesitas estar en un canal de voz.',
    notSameVoice: 'Necesitas estar en el mismo canal de voz que yo.',
    noPlayer: 'No hay reproductor en este servidor.',
    joined: 'Unido a {channel}',
    left: 'Salió del canal de voz',
    alreadyConnected: 'Ya estoy conectado a un canal de voz',
  },

  // Queue/Player
  queue: {
    title: 'Cola de {bot}',
    description: '¡Aquí está lo que se está reproduciendo y lo que viene!',
    empty: 'La cola está vacía.',
    nowPlaying: 'Reproduciendo Ahora',
    addedToQueue: 'Agregado a la cola',
    position: 'Posición',
    duration: 'Duración',
    requestedBy: 'Solicitado por',
    totalTracks: 'Actualmente en la cola: **{count} pista{s}** con una duración total de **{duration}**!',
    pageInfo: 'Página {current}/{total} • Repetir: {loop} • Volumen: {volume}%',
    noMoreSongs: 'No hay más canciones en la cola para saltar.',
    skipped: 'Saltado {title}.',
    cleared: 'Cola limpiada exitosamente.',
    shuffled: 'Cola mezclada exitosamente.',
    paused: 'Reproductor pausado.',
    resumed: 'Reproductor reanudado.',
    stopped: 'Reproductor detenido y cola limpiada.',
    volumeSet: 'Volumen establecido en {volume}%.',
    volumeInvalid: 'El volumen debe estar entre 0 y 200.',
    seeked: 'Buscado a {position}.',
    seekInvalid: 'Posición de búsqueda inválida.',
    alreadyPaused: 'El reproductor ya está pausado.',
    alreadyPlaying: 'El reproductor ya está reproduciendo.',
  },

  // Music Commands
  music: {
    autoplayEnabled: 'Reproducción automática habilitada.',
    autoplayDisabled: 'Reproducción automática deshabilitada.',
    enhanceEnabled: 'Mejora de audio habilitada.',
    enhanceDisabled: 'Mejora de audio deshabilitada.',
    noPrevious: 'No hay pista anterior.',
    playingPrevious: 'Reproduciendo pista anterior.',
    radioPlaying: 'Reproduciendo radio: {station}',
    radioInvalid: 'Estación de radio inválida.',
    similarPlaying: 'Reproduciendo canciones similares a {title}.',
    similarNone: 'No se pudieron encontrar canciones similares.',
    nowPlayingTitle: 'Reproduciendo Ahora',
    requestedBy: 'Solicitado por',
    position: '{current} / {total}',
    enabled247: 'Modo 24/7 habilitado.',
    disabled247: 'Modo 24/7 deshabilitado.',
  },

  // Likes Commands
  likes: {
    liked: '**{title}** agregado a tus canciones favoritas.',
    unliked: '**{title}** eliminado de tus canciones favoritas.',
    notLiked: 'Esta canción no está en tus canciones favoritas.',
    cleared: 'Todas tus canciones favoritas han sido eliminadas.',
    noLiked: 'No tienes canciones favoritas.',
    likedList: 'Tus Canciones Favoritas',
    playing: 'Reproduciendo tus canciones favoritas.',
    total: 'Total: {count} canción{s}',
  },

  // Info Commands
  info: {
    avatar: 'Avatar de **{user}**',
    botInfo: 'Información del Bot',
    stats: 'Estadísticas',
    invite: 'Enlace de Invitación',
    inviteDesc: '¡Invítame a tu servidor!',
    support: 'Servidor de Soporte',
    uptime: 'Tiempo en línea',
    servers: 'Servidores',
    users: 'Usuarios',
    channels: 'Canales',
    memory: 'Memoria',
    cpu: 'CPU',
    library: 'Librería',
    nodeVersion: 'Node.js',
    profile: 'Perfil',
    songsPlayed: 'Canciones Reproducidas',
    commandsUsed: 'Comandos Usados',
    ignored: '{target} agregado a la lista de ignorados.',
    unignored: '{target} eliminado de la lista de ignorados.',
  },

  // Settings Commands
  settings: {
    prefix: 'Configuración de Prefijo',
    prefixCurrent: 'Prefijo Actual: `{prefix}`',
    prefixChanged: '¡Prefijo Actualizado Exitosamente!',
    prefixNew: '**Nuevo Prefijo:** `{prefix}`',
    prefixExample: '**Ejemplo:** `{prefix}play nombre de canción`',
    prefixTooLong: '¡El prefijo debe tener máximo 2 caracteres!',
    prefixNoEmoji: '¡El prefijo no puede contener emojis!',
    prefixInvalid: 'El prefijo debe contener solo letras, números y símbolos.',
    prefixUse: 'Usa `{prefix}prefix <nuevo_prefijo>` para cambiarlo.',
  },

  // Errors
  errors: {
    noPermission: 'No tienes permiso para usar este comando.',
    ownerOnly: 'Este comando solo está disponible para los propietarios del bot.',
    cooldown: 'Por favor espera {time} antes de usar este comando nuevamente.',
    maintenance: 'El bot está actualmente en mantenimiento.',
    blacklisted: 'Estás en la lista negra de este bot.',
    missingArgs: 'Faltan argumentos requeridos.',
    invalidArgs: 'Argumentos inválidos proporcionados.',
    notPlaying: 'No se está reproduciendo nada actualmente.',
    notInVoice: 'Necesitas estar en un canal de voz.',
    notInSameVoice: 'Necesitas estar en el mismo canal de voz que yo.',
    noPlayer: 'No hay reproductor activo.',
    error: 'Ocurrió un error al ejecutar este comando.',
  },

  // Language Command
  language: {
    title: 'Configuración de Idioma',
    description: 'Cambiar tu idioma del bot',
    current: 'Idioma actual: **{lang}**',
    available: 'Idiomas disponibles',
    changed: 'Idioma cambiado a **{lang}**',
    invalid: 'Idioma inválido. Disponibles: {langs}',
    selectLanguage: 'Seleccionar un idioma',
  },
};
