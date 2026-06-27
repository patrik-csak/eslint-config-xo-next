import {defineConfig, globalIgnores} from 'eslint/config';
import xo from 'eslint-config-xo';
import packageJson from 'eslint-plugin-package-json/experimental';

export default defineConfig([
	globalIgnores(['index.d.ts', 'index.js', 'package-lock.json']),

	...xo(),

	{
		files: ['package.json'],
		extends: [packageJson.configs.recommended, packageJson.configs.stylistic],
	},
]);
