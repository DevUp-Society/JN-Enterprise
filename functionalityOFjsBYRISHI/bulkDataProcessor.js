/**
 * bulkDataProcessor.js
 * 
 * An asynchronous item processor designed to process large JSON/CSV datasets
 * without blocking the Node.js event loop.
 */

class BulkDataProcessor {
    /**
     * Processes a large array of data asynchronously in chunks.
     * @param {Array} data The full dataset to process
     * @param {Function} processFn The async function to apply to each item
     * @param {Object} options Configuration for chunk size and delays
     */
    static async processInChunks(data, processFn, options = {}) {
        const chunkSize = options.chunkSize || 100;
        const delayBetweenChunks = options.delayMs || 10;

        let processedCount = 0;
        let failedCount = 0;
        const errors = [];

        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);

            const chunkPromises = chunk.map(async (item) => {
                try {
                    await processFn(item);
                    processedCount++;
                } catch (err) {
                    failedCount++;
                    errors.push({ item, error: err.message });
                }
            });

            // Wait for the entire chunk to finish processing
            await Promise.all(chunkPromises);

            // Yield back to the event loop intentionally if delay exists
            if (delayBetweenChunks > 0 && i + chunkSize < data.length) {
                await new Promise(resolve => setTimeout(resolve, delayBetweenChunks));
            }
        }

        return {
            total: data.length,
            processed: processedCount,
            failed: failedCount,
            errors
        };
    }
}

module.exports = BulkDataProcessor;
