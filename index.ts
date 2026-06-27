import nextPlugin from '@next/eslint-plugin-next';
import {type Linter} from 'eslint';
import jsxa11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import ow from 'ow';

export type Options = {
	/**
	Which of Next.js's ESLint configurations to use

	@default 'core-web-vitals'
	@see {@link https://nextjs.org/docs/app/api-reference/config/eslint}
	*/
	config?: 'core-web-vitals' | 'recommended';

	/**
	Which jsx-a11y configuration to use

	@see {@link https://github.com/vercel/next.js/blob/v16.2.10/packages/eslint-config-next/src/index.ts#L72-L83}
	@see {@link https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#supported-rules}

	@default 'next'
	*/
	jsxA11yConfig?: 'next' | 'recommended' | 'strict';

	/**
	The root directory of the Next.js application

	@see {@link https://nextjs.org/docs/app/api-reference/config/eslint#specifying-a-root-directory-within-a-monorepo}
	*/
	rootDir?: string | string[];
};

const jsxA11yConfigs: Record<
	'next' | 'recommended' | 'strict',
	Linter.Config['rules']
> = {
	next: {
		'jsx-a11y/alt-text': 'warn',
		'jsx-a11y/aria-props': 'warn',
		'jsx-a11y/aria-proptypes': 'warn',
		'jsx-a11y/aria-unsupported-elements': 'warn',
		'jsx-a11y/role-has-required-aria-props': 'warn',
		'jsx-a11y/role-supports-aria-props': 'warn',
	},
	recommended: jsxa11y.configs.recommended.rules,
	strict: jsxa11y.configs.strict.rules,
};

export default function eslintConfigXoNext(options?: Options): Linter.Config[] {
	ow(
		options as unknown,
		ow.optional.object.exactShape({
			config: ow.optional.string.oneOf(['core-web-vitals', 'recommended']),
			jsxA11yConfig: ow.optional.string.oneOf([
				'next',
				'recommended',
				'strict',
			]),
			// eslint-disable-next-line unicorn/max-nested-calls
			rootDir: ow.optional.any(ow.string, ow.array.ofType(ow.string)),
		}),
	);

	let jsxA11yRules: Linter.Config['rules'] = jsxA11yConfigs.next;

	if (options?.jsxA11yConfig === 'recommended') {
		jsxA11yRules = jsxA11yConfigs.recommended;
	} else if (options?.jsxA11yConfig === 'strict') {
		jsxA11yRules = jsxA11yConfigs.strict;
	}

	const config: Linter.Config[] = [
		// Our own version of eslint-config-next's 'next' config object:
		{
			name: 'eslint-config-xo-next',

			// Use next's files
			files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],

			plugins: {
				// - Omit next's react and react-hooks plugins to use xo-react's
				// - Omit next's import plugin to use xo's import-x plugin

				'@next/next': nextPlugin,
				'jsx-a11y': jsxa11y,
			},

			languageOptions: {
				// Omit next's parser (babel) to use xo's parser (default)

				globals: {
					// Set browser and node
					// - next sets browser and node
					// - xo sets one or the other based on the `browser` option
					// - xo-react doesn't set any
					...globals.browser,
					...globals.node,
				},
			},

			settings: {
				// Omit next's react and import/* settings

				'jsx-a11y': {
					components: {
						// eslint-config-next maps Image to img at the (jsx-a11y/alt-text)
						// rule level. We map it at the settings level so that it works with
						// all jsx-a11y rule configurations.
						// eslint-disable-next-line @typescript-eslint/naming-convention
						Image: 'img',
					},
				},
				next: {
					rootDir: options?.rootDir,
				},
			},

			rules: {
				// Omit next's import, react, and react-hooks rules to use xo-react's

				...nextPlugin.configs[options?.config ?? 'core-web-vitals'].rules,
				...jsxA11yRules,
			},
		},

		// Omit next's 'next/typescript' config object to use xo's TypeScript parsing

		// Use next's ignores
		{
			ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
		},
	];

	return config;
}
