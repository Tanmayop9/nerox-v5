# Multi-Language Support (i18n)

This bot now supports multiple languages! Users can choose their preferred language for bot interactions.

## Supported Languages

- 🇬🇧 **English** (en) - Default
- 🇫🇷 **French** (fr) - Français
- 🇪🇸 **Spanish** (es) - Español

## Usage

### Changing Your Language

Use the language command to change your preferred language:

```
&language
```

This will display your current language and a dropdown menu to select a new one.

Or specify the language code directly:

```
&language en   # Switch to English
&language fr   # Switch to French
&language es   # Switch to Spanish
```

**Aliases:** `lang`, `langue`, `idioma`

### How It Works

- Language preferences are saved **per user**, not per server
- Your language preference will apply across all servers where the bot is present
- The bot will respond to you in your chosen language
- Default language is English for new users

## For Developers

### Adding New Translations

1. Add your translation strings to the language files in `src/locales/`:
   - `en.js` - English
   - `fr.js` - French  
   - `es.js` - Spanish

2. Use the translation function in your commands:

```javascript
// Get translated text for a user
const text = await client.t(userId, 'translation.key');

// With parameters
const text = await client.t(userId, 'translation.key', { 
    param1: 'value1',
    param2: 'value2'
});
```

### Translation Structure

Translations are organized by category:

```javascript
export default {
  common: {
    error: 'An error occurred',
    success: 'Success',
  },
  help: {
    title: 'Help',
    description: 'Shows command list',
  },
  // ... more categories
};
```

### Client Helper Methods

The client provides convenient methods for language handling:

```javascript
// Get user's language
const lang = await client.getUserLanguage(userId);

// Set user's language
await client.setUserLanguage(userId, 'fr');

// Translate text
const text = await client.t(userId, 'key.path', { params });
```

## Adding a New Language

To add support for a new language:

1. Create a new language file in `src/locales/` (e.g., `de.js` for German)
2. Copy the structure from `en.js` and translate all strings
3. Import and register the language in `src/functions/i18n.js`:

```javascript
import de from '../locales/de.js';

const languages = {
    en,
    fr,
    es,
    de,  // Add new language
};

const languageNames = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch',  // Add language name
};
```

4. Update the language command choices in `src/commands/settings/language.js`

## Technical Details

- **Storage:** User language preferences are stored using JoshDB in the `language` database
- **Fallback:** If a translation key is not found in the selected language, the system falls back to English
- **Performance:** Translations are loaded once at startup and cached in memory
- **Database:** Uses local JSON storage via @joshdb/json provider

## Migration from MongoDB

This implementation uses local JoshDB storage instead of MongoDB:
- No MongoDB connection required
- Data stored in `./database-storage/` directory
- Simpler setup and deployment
- Suitable for small to medium-sized bots
