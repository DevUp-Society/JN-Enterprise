const CircuitBreaker = require('./circuitBreaker');
const TokenBucketRateLimiter = require('./rateLimiter');
const BulkProcessor = require('./bulkDataProcessor');
const AdvancedSearch = require('./advancedSearch');

async function runTests() {
    console.log('--- JN Enterprise: JavaScript Utilities Test Runner ---');

    console.log('\n▶ Testing AdvancedSearchIndex...');
    const searchIndex = new AdvancedSearch();
    searchIndex.addDocument(1, { title: 'Blue Cotton Shirt', category: 'Apparel' }, ['title', 'category']);
    searchIndex.addDocument(2, { title: 'Red Wool Sweater', category: 'Apparel' }, ['title', 'category']);
    console.log('Search for "cotton shirt":', searchIndex.search('cotton shirt'));

    console.log('\n▶ Testing TokenBucketRateLimiter...');
    // 5 tokens capacity, 2 tokens refill per second
    const limiter = new TokenBucketRateLimiter(5, 2);
    let passed = 0;
    for (let i = 0; i < 8; i++) {
        if (limiter.consume()) passed++;
    }
    console.log(`Allowed ${passed} out of 8 rapid requests.`);

    console.log('\n▶ Testing BulkDataProcessor...');
    const mockData = Array.from({ length: 250 }, (_, i) => ({ id: i }));
    const results = await BulkProcessor.processInChunks(mockData, async (item) => {
        // Simulate async work
        if (item.id === 50) throw new Error('Simulated failure');
    }, { chunkSize: 50, delayMs: 1 });
    console.log(`Processed ${results.processed}, Failed: ${results.failed}`);

    console.log('\n▶ Testing CircuitBreaker...');
    let apiFails = true;
    const mockApiCall = async () => {
        if (apiFails) throw new Error('API Offline');
        return 'Success Data';
    };
    const breaker = new CircuitBreaker(mockApiCall, { failureThreshold: 2, recoveryTimeout: 100 });

    try { await breaker.fire(); } catch (e) { } // 1st failure
    try { await breaker.fire(); } catch (e) { } // 2nd failure - Opens circuit
    try { await breaker.fire(); } catch (e) { console.log('3rd call immediately rejected:', e.message); }

    console.log('Waiting for recovery timeout...');
    setTimeout(async () => {
        apiFails = false; // service restored
        try {
            const res = await breaker.fire();
            console.log('Service Recovered. API Response:', res);
        } catch (e) { }
    }, 150);
}

runTests();
