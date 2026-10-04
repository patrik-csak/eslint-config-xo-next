import nextPlugin from '@next/eslint-plugin-next';
import {type Linter} from 'eslint';
import globals from 'globals';
import ow from 'ow';
import {tailwind3, tailwind4} from 'tailwind-csstree';

export type Options = {
	/**
	Which of Next.js's ESLint configurations to use

	@default 'core-web-vitals'
	@see {@link https://nextjs.org/docs/app/api-reference/config/eslint}
	*/
	config?: 'core-web-vitals' | 'recommended';

	/**
	The root directory of the Next.js application

	@see {@link https://nextjs.org/docs/app/api-reference/config/eslint#specifying-a-root-directory-within-a-monorepo}
	*/
	rootDir?: string | string[];

	/**
	Enable Tailwind CSS v3 or v4 syntax
	*/
	tailwind?: 3 | 4;
};

export default function xoNext(options?: Options): Linter.Config[] {
	ow(
		options as unknown,
		ow.optional.object.exactShape({
			config: ow.optional.string.oneOf(['core-web-vitals', 'recommended']),
			// eslint-disable-next-line unicorn/max-nested-calls
			rootDir: ow.optional.any(ow.string, ow.array.ofType(ow.string)),
			tailwind: ow.optional.number.oneOf([3, 4]),
		}),
	);

	const config: Linter.Config[] = [
		// Our own version of eslint-config-next's 'next' config object:
		{
			name: 'xo-next/base',

			// Use next's files
			files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],

			plugins: {
				// - Omit next's react and react-hooks plugins to use xo-react's
				// - Omit next's import plugin to use xo's import-x plugin
				// - Omit next's jsx-a11y plugin to use xo-react's jsx-a11y-x plugin

				'@next/next': nextPlugin,
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

				'jsx-a11y-x': {
					components: {
						// eslint-config-next maps Image to img at the (jsx-a11y/alt-text)
						// rule level. We map it at the settings level so that it works with
						// all jsx-a11y-x rule configurations.
						// https://github.com/es-tooling/eslint-plugin-jsx-a11y-x/tree/v0.2.0#component-mapping
						// eslint-disable-next-line @typescript-eslint/naming-convention
						Image: 'img',
					},
				},
				next: {
					rootDir: options?.rootDir,
				},
			},

			rules: {
				// Omit next's a11y, import, react, and react-hooks rules to use xo-react's

				...nextPlugin.configs[options?.config ?? 'core-web-vitals'].rules,

				'n/file-extension-in-import': 'off',
			},
		},

		// Omit next's 'next/typescript' config object to use xo's TypeScript parsing

		// Use next's ignores
		{
			name: 'xo-next/ignores',
			ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
		},
	];

	if (options?.tailwind !== undefined) {
		config.push({
			name: 'xo-next/tailwind',
			files: ['**/*.css'],
			languageOptions: {
				customSyntax: options.tailwind === 3 ? tailwind3 : tailwind4,
			},
		});
	}

	return config;
}
