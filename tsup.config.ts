import { defineConfig } from 'tsup';

export default defineConfig({
  format: 'esm',
  entry: ['./src'],
  skipNodeModulesBundle: true,
  clean: true
});
