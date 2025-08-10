import { config as load } from 'dotenv';

export function loadEnv(path = '.env') {
  load({ path });
}
