import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs'],
  entry: ['./src'],
  skipNodeModulesBundle: true,
  clean: true
});
