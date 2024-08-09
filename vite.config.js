import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Export the configuration function
export default defineConfig(({ command, mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd());

  // Determine the base URL based on the mode
  const baseURL = mode === 'production'
    ? env.VITE_BASE_URL_PRODUCTION
    : env.VITE_BASE_URL_LOCAL || '/';

  return {
    plugins: [react()],
    base: baseURL,
    build: {
      minify: true,
      sourcemap: false,
      target: 'modules',
    },
    define: {
      // Optionally, define any global constants here
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    }
  };
});
