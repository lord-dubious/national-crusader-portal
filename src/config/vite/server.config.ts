
import type { ServerOptions } from 'vite';

export const serverConfig: ServerOptions = {
  host: "::",
  port: 8080,
  allowedHosts: true // Changed from 'all' to true to match the expected type
};
