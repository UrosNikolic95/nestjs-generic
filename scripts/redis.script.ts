import * as dotenv from 'dotenv';
dotenv.config();
import { getSyncData } from '../src/helpers/shared-data.helper';

function sleep(milliseconds: number) {
  return new Promise((res) => setInterval(res, milliseconds));
}

async function main() {
  const data = await getSyncData<{ [key: string]: string }>('data');

  await sleep(1000);
  data[process.env.pm_id] = 'HEY!';

  await sleep(1000);
  console.log(data);
}
main();
