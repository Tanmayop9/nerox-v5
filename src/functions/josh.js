/**
 * Local JoshDB implementation using JSON provider
 * Simple key-value storage for bot data
 */

import { Josh } from '@joshdb/core';
import provider from '@joshdb/json';

/**
 * Factory function to create a Josh instance
 * @param {string} name - Collection name
 * @returns {Josh} Josh instance
 */
export const josh = (name) => {
    return new Josh({
        name: name,
        provider,
    });
};

/**@codeStyle - https://google.github.io/styleguide/tsguide.html */
