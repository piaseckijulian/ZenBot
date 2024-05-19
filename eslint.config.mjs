import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/**/*'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: globals.node } }
];
