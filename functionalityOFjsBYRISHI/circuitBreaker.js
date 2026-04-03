/**
 * circuitBreaker.js
 * 
 * Implements the Circuit Breaker pattern for robust external API requests.
 * It prevents an application from repeatedly trying to execute an operation that's likely to fail,
 * allowing it to fail fast and recover gracefully.
 */

class CircuitBreaker {
    constructor(requestFunction, options = {}) {
        this.requestFunction = requestFunction;
        this.state = 'CLOSED'; // 'CLOSED', 'OPEN', 'HALF-OPEN'
        this.failureThreshold = options.failureThreshold || 3;
        this.recoveryTimeout = options.recoveryTimeout || 5000; // time in ms before attempting recovery

        this.failureCount = 0;
        this.nextAttempt = Date.now();
    }

    async fire(...args) {
        if (this.state === 'OPEN') {
            if (Date.now() > this.nextAttempt) {
                this.state = 'HALF-OPEN';
            } else {
                throw new Error('CircuitBreaker is OPEN. Request blocked to prevent cascading failure.');
            }
        }

        try {
            const response = await this.requestFunction(...args);
            this.success();
            return response;
        } catch (error) {
            this.failure();
            throw error;
        }
    }

    success() {
        this.failureCount = 0;
        if (this.state === 'HALF-OPEN') {
            this.state = 'CLOSED';
            console.log('CircuitBreaker: Service recovered, state set to CLOSED.');
        }
    }

    failure() {
        this.failureCount++;
        console.log(`CircuitBreaker: Failure count at ${this.failureCount}`);

        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.recoveryTimeout;
            console.warn(`CircuitBreaker: Threshold reached. State set to OPEN for ${this.recoveryTimeout}ms.`);
        }
    }
}

module.exports = CircuitBreaker;
