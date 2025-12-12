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
    welcomeBack: '¡Bienvenido de nuevo, {user}!',
    wasAfkFor: 'Estuviste AFK por **{time}**',
    userAfk: '**{user}** está actualmente AFK',
    reason: '**Razón:** {reason}',
    duration: '**Duración:** {time}',
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
  },

  // Queue/Player
  queue: {
    empty: 'La cola está vacía.',
    nowPlaying: 'Reproduciendo Ahora',
    addedToQueue: 'Agregado a la cola',
    position: 'Posición',
    duration: 'Duración',
    requestedBy: 'Solicitado por',
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
