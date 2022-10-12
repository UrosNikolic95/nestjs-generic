import * as dotenv from 'dotenv';
dotenv.config();
import * as Queue from 'bull';
import { QueueOptions } from 'bull';
import { getNonDefaultFunctionNames } from './handy.helpers';

const queueOptions = {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS,
  },
} as QueueOptions;

export class QueueHelper {
  constructor() {
    const functionNames = getNonDefaultFunctionNames(this);
    functionNames.forEach((functionName) => {
      const func = this[functionName] as Function;
      const queueName = this.constructor.name;
      const queue = new Queue(queueName, queueOptions);
      this[functionName] = (...args: any[]) => {
        queue.add(functionName, args);
      };
      queue.process(functionName, (job, done) => {
        func(...job.data);
        done();
      });
    });
  }
}
