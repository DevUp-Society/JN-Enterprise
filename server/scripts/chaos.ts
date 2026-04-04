import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const API_URL = 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this-in-prod';

async function simulateRaceCondition() {
  console.log('🧪 INITIALIZING_CHAOS_SIMULATION: RACE_CONDITION_TEST');
  
  try {
    // 1. Identify Target Node
    const product = await prisma.product.findFirst({
      where: { stockQuantity: { gt: 1 } }
    });

    if (!product) {
      console.error('❌ FAILURE: No suitable product nodes with stock found for simulation.');
      return;
    }

    console.log(`📦 TARGET_NODE: ${product.name} (SKU: ${product.sku}) | STOCK: ${product.stockQuantity} | VERSION: ${product.version}`);

    // 2. Create Concurrent Fulfillment Tasks
    const worker = await prisma.user.findFirst({ where: { role: 'WORKER' } });
    if (!worker) throw new Error('No worker found in registry.');

    // Sign Auth Token
    const token = jwt.sign({ id: worker.id, role: worker.role }, JWT_SECRET, { expiresIn: '1h' });

    const task1 = await prisma.task.create({
      data: {
        title: 'CHAOS_SIG_1',
        productId: product.id,
        assigneeId: worker.id,
        status: 'PENDING'
      }
    });

    const task2 = await prisma.task.create({
      data: {
        title: 'CHAOS_SIG_2',
        productId: product.id,
        assigneeId: worker.id,
        status: 'PENDING'
      }
    });

    console.log('⚡ SIMULATING_CONCURRENT_FULFILLMENT_REQUESTS...');

    // 3. Execute Simultaneous PATCH requests with Auth Cookies
    const results = await Promise.allSettled([
      axios.patch(`${API_URL}/tasks/${task1.id}/complete`, {}, {
        headers: { Cookie: `token=${token}` }
      }),
      axios.patch(`${API_URL}/tasks/${task2.id}/complete`, {}, {
        headers: { Cookie: `token=${token}` }
      })
    ]);

    // 4. Analyze Protocol Responses
    results.forEach((res, index) => {
      if (res.status === 'fulfilled') {
        const val = res.value as any;
        console.log(`✅ REQUEST_${index + 1}: SUCCESS | Status: ${val.status} | Data: ${JSON.stringify(val.data)}`);
      } else {
        const error = res.reason;
        console.log(`⚠️ REQUEST_${index + 1}: REJECTED | Status: ${error.response?.status} | Message: ${error.response?.data?.message}`);
      }
    });

    // 5. Final State Verification
    const finalProduct = await prisma.product.findUnique({ where: { id: product.id } });
    console.log('--- FINAL_SYSTEM_STATE ---');
    console.log(`📦 STATUS: ${finalProduct?.stockQuantity === (product as any).stockQuantity - 1 ? 'INTEGRITY_VERIFIED' : 'INTEGRITY_FAILED'}`);
    console.log(`📊 FINAL_STOCK: ${finalProduct?.stockQuantity}`);
    console.log(`🔄 FINAL_VERSION: ${finalProduct?.version}`);

    // 6. Audit Log Verification
    const auditLogs = await (prisma as any).auditLog.findMany({
      where: { details: { path: ['taskId'], equals: task1.id } },
      orderBy: { timestamp: 'desc' }
    });
    
    const conflictLogs = await (prisma as any).auditLog.findMany({
       where: { action: 'CONFLICT_DETECTED' },
       orderBy: { timestamp: 'desc' },
       take: 5
    });

    console.log('--- AUDIT_PROTOCOL_METRICS ---');
    console.log(`📋 SUCCESS_LOGS: ${auditLogs.length}`);
    console.log(`🔥 CONFLICT_LOGS_DETECTED: ${conflictLogs.length}`);
    
    if (auditLogs.length > 0) {
       console.log(`🛠️ LATEST_AUDIT: ${JSON.stringify(auditLogs[0].details)}`);
    }

  } catch (error: any) {
    console.error('💥 SIMULATION_CRASH:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

simulateRaceCondition();
