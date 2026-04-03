/**
 * advancedSearch.js
 * 
 * An In-Memory Inverted Index designed for rapid text search.
 * Extremely effective for multi-keyword searches over large product arrays (like SKUs, names, tags).
 */

class AdvancedSearchIndex {
    constructor() {
        this.index = new Map(); // Maps Words -> Set of Document IDs
        this.documents = new Map(); // Maps Document IDs -> full document object
    }

    /**
     * Simple tokenizer that normalizes text, removes punctuation, and splits by spaces.
     */
    _tokenize(text) {
        if (!text || typeof text !== 'string') return [];
        return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(word => word.length > 0);
    }

    /**
     * Adds a document to the index.
     * @param {string|number} id Unique identifier for the document
     * @param {Object} document Full document object
     * @param {Array<string>} indexFields Array of strings representing properties to index
     */
    addDocument(id, document, indexFields = []) {
        this.documents.set(id, document);

        indexFields.forEach(field => {
            const value = document[field];
            if (typeof value === 'string') {
                const tokens = this._tokenize(value);
                tokens.forEach(token => {
                    if (!this.index.has(token)) {
                        this.index.set(token, new Set());
                    }
                    this.index.get(token).add(id);
                });
            }
        });
    }

    /**
     * Search the index with a query string.
     * @param {string} query The search phrase
     * @returns {Array} Array of matched document objects
     */
    search(query) {
        const queryTokens = this._tokenize(query);
        if (queryTokens.length === 0) return [];

        let matchedDocIds = null;

        // Perform an intersection of sets for each query token (AND based search)
        for (const token of queryTokens) {
            let foundDocIds = new Set();

            // Allow partial matches (e.g., "shirt" matches "shirts")
            for (const [indexedToken, docIds] of this.index.entries()) {
                if (indexedToken.includes(token)) {
                    docIds.forEach(id => foundDocIds.add(id));
                }
            }

            if (!matchedDocIds) {
                matchedDocIds = foundDocIds;
            } else {
                // Intersect
                const intersection = new Set();
                matchedDocIds.forEach(id => {
                    if (foundDocIds.has(id)) {
                        intersection.add(id);
                    }
                });
                matchedDocIds = intersection;
            }

            if (matchedDocIds.size === 0) break; // early exit if any token fails to match entirely
        }

        if (!matchedDocIds || matchedDocIds.size === 0) return [];

        return Array.from(matchedDocIds).map(id => this.documents.get(id));
    }
}

module.exports = AdvancedSearchIndex;
