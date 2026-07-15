import {defineConfig, globalIgnores} from 'eslint/config';
import xo from 'eslint-config-xo';

export default defineConfig([
	globalIgnores(['index.d.ts', 'index.js', 'package-lock.json']),

	...xo(),
]);
