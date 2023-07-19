import * as dotenv from 'dotenv';
dotenv.config();
import * as Queue from 'bull';
import { QueueOptions, Queue as IQueue } from 'bull';
import { getNonDefaultFunctionNames } from './handy.helpers';
import { Type } from '@nestjs/common';
import { envConfig } from '../config';

const queueOptions = {
  redis: {
    host: envConfig.REDIS_HOST,
    port: Number(envConfig.REDIS_PORT),
    password: envConfig.REDIS_PASS,
  },
} as QueueOptions;

const alreadyMade = new Set<string>();
const queue = new Queue('default', queueOptions);

export function createQueueHelper(queue: IQueue): Type {
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
export async function closeBull() {
  await queue.close();
}
