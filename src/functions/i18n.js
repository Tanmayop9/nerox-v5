/**
 * English Text Manager
 * Simplified version - English only for performance
 */

import en from '../locales/en.js';

/**
 * Get translation for a key - English only
 * @param {string} key - Translation key in dot notation (e.g., 'help.title')
 * @param {Object} params - Parameters to replace in translation string
 * @returns {string} Translated string
 */
export function translate(key, params = {}) {
    // Navigate the translation object using dot notation
    const keys = key.split('.');
    let value = en;
    
    for (const k of keys) {
        if (value && typeof value === 'object') {
            value = value[k];
        } else {
            value = undefined;
            break;
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
 * Get default language (always English)
 * @returns {string} Default language code
 */
export function getDefaultLanguage() {
    return 'en';
}

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
