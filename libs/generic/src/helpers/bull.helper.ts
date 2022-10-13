import * as dotenv from 'dotenv';
dotenv.config();
import * as Queue from 'bull';
import { QueueOptions, Queue as IQueue } from 'bull';
import { getNonDefaultFunctionNames } from './handy.helpers';

const queueOptions = {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS,
  },
} as QueueOptions;

const alreadyMade = new Set<string>();
const queue = new Queue('default', queueOptions);

export function createQueueHelper(queue: IQueue) {
  class QueueHelper {
    constructor() {
      const functionNames = getNonDefaultFunctionNames(this);
      functionNames.forEach((functionName) => {
        const func = this[functionName] as Function;
        const className = this.constructor.name;
        const jobName = className + '.' + functionName;
        this[functionName] = (...args: any[]) => {
          queue.add(jobName, args);
        };
        if (!alreadyMade.has(jobName)) {
          queue.process(jobName, (job, done) => {
            func(...job.data);
            done();
          });
          alreadyMade.add(jobName);
        }
      });
    }
  }
  return QueueHelper;
}

export const QueueHelperClass = createQueueHelper(queue);
