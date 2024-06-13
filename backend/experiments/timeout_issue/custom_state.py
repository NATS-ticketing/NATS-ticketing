import os
import time
import asyncio
import json
from nats.aio.client import Client as NATS

config = {
    'vus': 100,
    'vu_messages': 1,
}

metrics = {
    'checks': {'passed': 0, 'failed': 0},
    'data_received': 0,
    'data_sent': 0,
    'iteration_durations': [],
    'iterations': 0,
}

async def run():
    async def request_response(worker_id, num_messages):
        nc = NATS()
        await nc.connect(servers=[f"nats://{os.getenv('NATS_IP')}:4222"])

        for _ in range(num_messages):
            start_time = time.time()
            metrics['iterations'] += 1
            try:
                payload = b""
                msg = await nc.request('ticketing.1.state', payload, timeout=10)
                if json.loads(msg.data.decode())['state']['status'] != "success":
                    raise Exception("Response status is not success")
                elapsed = time.time() - start_time
                metrics['iteration_durations'].append(elapsed)
                metrics['data_received'] += len(msg.data)
                metrics['data_sent'] += len(payload)
                metrics['checks']['passed'] += 1
            except Exception as e:
                metrics['checks']['failed'] += 1
                print(f"Worker {worker_id}: {e}")
            finally:
                elapsed = time.time() - start_time
                print(f"Worker {worker_id}: Received response in {elapsed:.2f}s")

        await nc.drain()
        await nc.close()

    num_workers = config['vus']
    num_messages = config['vu_messages']

    tasks = []
    for i in range(num_workers):
        tasks.append(request_response(i, num_messages))

    await asyncio.gather(*tasks)
    print_metrics()

def calculate_percentile(arr, p):
    if len(arr) == 0:
        return 0
    arr.sort()
    index = int(p * len(arr))
    return arr[index]

def print_metrics():
    if metrics['iteration_durations']:
        avg_duration = sum(metrics['iteration_durations']) / len(metrics['iteration_durations'])
        min_duration = min(metrics['iteration_durations'])
        max_duration = max(metrics['iteration_durations'])
        med_duration = calculate_percentile(metrics['iteration_durations'], 0.5)
        p90_duration = calculate_percentile(metrics['iteration_durations'], 0.9)
        p95_duration = calculate_percentile(metrics['iteration_durations'], 0.95)
    else:
        avg_duration = min_duration = max_duration = med_duration = p90_duration = p95_duration = 0

    passed_percent = (metrics['checks']['passed'] / metrics['iterations']) * 100 if metrics['iterations'] > 0 else 0

    print(f"checks................: {passed_percent:.2f}%  (✓ {metrics['checks']['passed']} ✗ {metrics['checks']['failed']})")
    print(f"data_received.........: {metrics['data_received']} B")
    print(f"data_sent.............: {metrics['data_sent']} B")
    print(f"iteration_duration....: avg={avg_duration:.2f}s min={min_duration:.2f}s med={med_duration:.2f}s max={max_duration:.2f}s p(90)={p90_duration:.2f}s p(95)={p95_duration:.2f}s")
    print(f"iterations............: {metrics['iterations']}")
    print(f"vus...................: {config['vus']}")
    print(f"vu_messages...........: {config['vu_messages']}")

if __name__ == '__main__':
    asyncio.run(run())
