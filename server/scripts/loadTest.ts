import axios from 'axios';

/**
 * @desc    Industrial Stress Test: Automated Concurrency Verification
 * fires 50 simultaneous product creation requests to test Prisma Singleton & Connection Pool
 */
const API_URL = 'http://localhost:5000/api/products';

async function runStressTest() {
  console.log('\n[!] INITIALIZING_INDUSTRIAL_STRESS_TEST...');
  console.log('--- TARGET: 50 CONCURRENT_NODE_SYNCHRONIZATIONS ---\n');
  
  const startTime = Date.now();

  const requests = Array.from({ length: 50 }).map((_, i) => {
    return axios.post(API_URL, {
      name: `PROD_HARDEN_TEST_${String(i).padStart(3, '0')}`,
      sku: `STR-HX-${Math.floor(100000 + Math.random() * 900000)}`,
      category: 'SYSTEM_STRESS',
      price: 249.99,
      stockQuantity: 500,
      description: 'Automated hardening verification payload. Verifying Prisma connection pool stability.'
    }).then(res => ({
      status: res.status,
      success: true
    })).catch(err => ({
      status: err.response?.status || 500,
      message: err.response?.data?.message || err.message,
      success: false
    }));
  });

  const results = await Promise.all(requests);
  const duration = Date.now() - startTime;

  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;

  console.log('--- SYSTEM_STRESS_REPORT ---');
  console.log(`STATUS: ${failed === 0 ? 'SYNCHRONIZED' : 'DEGRADED'}`);
  console.log(`TOTAL_REQUESTS: 50`);
  console.log(`SUCCESS_COUNT: ${successful}`);
  console.log(`FAILURE_COUNT: ${failed}`);
  console.log(`RESPONSE_TIME: ${duration}ms`);
  console.log(`AVR_LATENCY: ${Math.round(duration/50)}ms/req`);
  
  if (failed > 0) {
    console.log('\n[!] DETECTED_ANOMALIES:');
    results.filter(r => !r.success).slice(0, 3).forEach((err, i) => {
      console.log(`   ${i+1}. Error ${err.status}: ${err.message}`);
    });
  }

  console.log('\n[!] TEARDOWN: STRESS_TEST_COMPLETE.');
}

runStressTest().catch(err => {
  console.error('CRITICAL_STRESS_PROCESS_FAILURE:', err.message);
});
