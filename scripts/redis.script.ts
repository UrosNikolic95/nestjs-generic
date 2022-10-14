import * as dotenv from 'dotenv';
dotenv.config();
import { getSyncData } from '../libs/generic/src/helpers/shared-data.helper';

function sleep(milliseconds: number) {
  return new Promise((res) => setInterval(res, milliseconds));
}

async function main() {
  const data = await getSyncData<{ [key: string]: string }>('data');

  data[process.env.pm_id] = 'HEY!';

  await sleep(2000);
  console.log(data);
}
main();
