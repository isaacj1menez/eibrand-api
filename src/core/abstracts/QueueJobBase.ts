import { Queue, Worker, Processor, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis();

type AugmentedQueue<T> = Queue<T> & {
    events: QueueEvents
}

type RegisteredQueue = {
    queue: Queue,
    queueEvents: QueueEvents,
    worker: Worker
}

declare global {
    var __registeredQueues:
        | Record<string, RegisteredQueue>
        | undefined;
}

const registeredQueues = global.__registeredQueues || (global.__registeredQueues = {});

export function registerQueue<T>(name: string, processor: Processor<T>) {
    if (!registeredQueues[name]) {
        const queue = new Queue(name, { connection });
        const queueEvents = new QueueEvents(name, {
            connection,
        })

        const worker = new Worker<T>(name, processor, {
            connection
        });

        registeredQueues[name] = {
            queue,
            queueEvents,
            worker,
        };
    }

    const queue = registeredQueues[name].queue as AugmentedQueue<T>;
    queue.events = registeredQueues[name].queueEvents;
    return queue;
}