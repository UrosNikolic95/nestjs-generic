import * as dotenv from 'dotenv';
dotenv.config();
import { QueueHelper } from '../libs/generic/src/helpers/bull.helper';

class TestClass extends QueueHelper {
  async func1(str1: string, str2: string) {
    console.log('func1', '-', str1, '-', str2, '-', process.env.pm_id);
    return str1 + Date.now();
  }

  async func2(str1: string, str2: string) {
    console.log('func2', '-', str1, '-', str2, '-', process.env.pm_id);
    return str1 + Date.now();
  }
}

const test = new TestClass();
for (let i = 0; i < 10; i++) {
  test.func1('hey', process.env.pm_id);
  test.func2('f2', process.env.pm_id);
}
