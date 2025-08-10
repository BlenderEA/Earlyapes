import pino from 'pino';
import { LoggingConfig } from '../config/types.js';

export function createLogger(cfg: LoggingConfig) {
  return pino({ level: cfg.level, enabled: true });
}
