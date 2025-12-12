/**
 * Language/Translation Manager
 * Handles multi-language support for the bot
 * Supports: English (default), French, Spanish
 */

import en from '../locales/en.js';
import fr from '../locales/fr.js';
import es from '../locales/es.js';

const languages = {
    en,
    fr,
    es,
};

const languageNames = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
};

const defaultLanguage = 'en';

/**
 * Get translation for a key
 * @param {string} lang - Language code (en, fr, es)
 * @param {string} key - Translation key in dot notation (e.g., 'help.title')
 * @param {Object} params - Parameters to replace in translation string
 * @returns {string} Translated string
 */
export function translate(lang, key, params = {}) {
    const language = languages[lang] || languages[defaultLanguage];
    
    // Navigate the translation object using dot notation
    const keys = key.split('.');
    let value = language;
    
    for (const k of keys) {
        if (value && typeof value === 'object') {
            value = value[k];
        } else {
            value = undefined;
            break;
        }
    }
    
    // Fallback to default language if key not found
    if (value === undefined && lang !== defaultLanguage) {
        value = languages[defaultLanguage];
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return key itself if not found even in default
            }
        }
    }
    
    if (typeof value !== 'string') {
        return key; // Return key if translation not found
    }
    
    // Replace parameters in the string
    let result = value;
    for (const [param, val] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), val);
    }
    
    return result;
}

/**
 * Get all available languages
 * @returns {Object} Language codes and names
 */
export function getLanguages() {
    return languageNames;
}

/**
 * Get language name from code
 * @param {string} code - Language code
 * @returns {string} Language name
 */
export function getLanguageName(code) {
    return languageNames[code] || languageNames[defaultLanguage];
}

/**
 * Check if language code is valid
 * @param {string} code - Language code
 * @returns {boolean} True if valid
 */
export function isValidLanguage(code) {
    return code in languages;
}

/**
 * Get default language
 * @returns {string} Default language code
 */
export function getDefaultLanguage() {
    return defaultLanguage;
}

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
