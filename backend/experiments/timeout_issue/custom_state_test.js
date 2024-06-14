// Usage:
// > NATS_IP=OUR_NATS_IP_HERE node custom_state_test.js

import { connect } from "nats";

const config = {
    vus: 50,
    vu_messages: 1,
    runs: 10,
}

const metrics = {
    checks: { passed: 0, failed: 0 },
    data_received: 0,
    data_sent: 0,
    iteration_durations: [],
    iterations: 0,
};

async function run() {

    async function requestResponse(workerId, numMessages) {
        const nc = await connect({ servers: `nats://${process.env.NATS_IP}:4222` });

        for (let i = 0; i < numMessages; i++) {
            
            const startTime = new Date();
            metrics.iterations++;
            try {
                const payload = "";
                const msg = await nc.request('ticketing.1.state', payload, { timeout: 10000 });
                if(JSON.parse(msg.data.toString()).state.status != "success") {
                    throw new Error("Response status is not success");
                }
                const elapsed = (new Date() - startTime) / 1000.0;
                metrics.iteration_durations.push(elapsed);
                metrics.data_received += msg.data.length;
                metrics.data_sent += payload.length;
                metrics.checks.passed++;
            } catch (err) {
                metrics.checks.failed++;
                console.error(`Worker ${workerId}: ${err.message}`);
            } finally {
                const elapsed = (new Date() - startTime) / 1000;
                console.log(`Worker ${workerId}: Received response in ${elapsed}s`);

            }
        }
        await nc.drain();
        await nc.close();
    }


    const numWorkers = config.vus;
    const numMessages = config.vu_messages;

    const promises = [];
    for(let k = 0; k < config.runs; k++) {
        for (let i = 0; i < numWorkers; i++) {
            promises.push(requestResponse(i, numMessages));
        }
        await new Promise(r => setTimeout(r, 2000));

    }


    await Promise.all(promises);


    printMetrics();
}

function percent(arr, p) {
    if (arr.length === 0) return 0;
    arr.sort((a, b) => a - b);
    const index = Math.ceil(p * arr.length) - 1;
    return arr[index];
}

function printMetrics() {
    const avgDuration = metrics.iteration_durations.length ? (metrics.iteration_durations.reduce((a, b) => a + b, 0) / metrics.iteration_durations.length) : 0;
    const minDuration = metrics.iteration_durations.length ? Math.min(...metrics.iteration_durations) : 0;
    const maxDuration = metrics.iteration_durations.length ? Math.max(...metrics.iteration_durations) : 0;
    const medDuration = metrics.iteration_durations.length ? percent(metrics.iteration_durations, 0.5) : 0;
    const p90Duration = metrics.iteration_durations.length ? percent(metrics.iteration_durations, 0.90) : 0;
    const p95Duration = metrics.iteration_durations.length ? percent(metrics.iteration_durations, 0.95) : 0;
    const passedPercent = metrics.checks.passed / metrics.iterations * 100;
    console.log(`checks................: ${passedPercent}%  (✓ ${metrics.checks.passed} ✗ ${metrics.checks.failed})`);
    console.log(`data_received.........: ${metrics.data_received} B`);
    console.log(`data_sent.............: ${metrics.data_sent} B`);
    console.log(`iteration_duration....: avg=${avgDuration.toFixed(2)}s min=${minDuration.toFixed(2)}s med=${medDuration.toFixed(2)}s max=${maxDuration.toFixed(2)}s p(90)=${p90Duration.toFixed(2)}s p(95)=${p95Duration.toFixed(2)}s`);
    console.log(`iterations............: ${metrics.iterations}`);
    console.log(`runs..................: ${config.runs}`);
    console.log(`vus...................: ${config.vus}`);
    console.log(`vu_messages...........: ${config.vu_messages}`);
}

run().catch(err => {
    console.error(`Error: ${err.message}`);
});
