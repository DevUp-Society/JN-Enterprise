/**
 * rateLimiter.js
 * 
 * Implements a Token Bucket algorithm for API Rate Limiting.
 * Allows a certain burst of traffic but maintains an average rate over time.
 */

class TokenBucketRateLimiter {
    constructor(capacity, refillRatePerSecond) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillRate = refillRatePerSecond;
        this.lastRefillTime = Date.now();
    }

    _refill() {
        const now = Date.now();
        const timePassedMs = now - this.lastRefillTime;
        const tokensToAdd = (timePassedMs / 1000) * this.refillRate;

        if (tokensToAdd > 0) {
            this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
            this.lastRefillTime = now;
        }
    }

    /**
     * Attempts to consume a specified number of tokens.
     * @param {number} count Number of tokens to consume.
     * @returns {boolean} True if successfully consumed, false if rate limited.
     */
    consume(count = 1) {
        this._refill();

        if (this.tokens >= count) {
            this.tokens -= count;
            return true;
        }
        return false;
    }
}

module.exports = TokenBucketRateLimiter;
