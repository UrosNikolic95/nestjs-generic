import * as dotenv from 'dotenv';
dotenv.config();
import { QueueHelper } from '../libs/generic/src/helpers/bull.helper';

class TestClass extends QueueHelper {
  async func1(str: string) {
    console.log(str);
    return str + Date.now();
  }
}

const test = new TestClass();
test.func1('q1');
test.func1('q2');
test.func1('q3');
test.func1('q4');
test.func1('q5');
