# eslint-config-xo-next

ESLint [shareable config](http://eslint.org/docs/developer-guide/shareable-configs.html) for [Next.js](https://nextjs.org) to be used with [eslint-config-xo-react](https://github.com/xojs/eslint-config-xo-react)

## Features

- Eliminates ESLint plugin and parser conflicts from using ESLint 10 with `eslint-config-next` and `eslint-config-xo-react`
- Combines Next.js's [`@next/next`](https://nextjs.org/docs/app/api-reference/config/eslint#rules) rules with `eslint-config-xo-react`'s stricter [`eslint-plugin-jsx-a11y-x`](https://github.com/es-tooling/eslint-plugin-jsx-a11y-x), [`@eslint-react/eslint-plugin`](https://github.com/Rel1cx/eslint-react), and [`eslint-plugin-react-hooks`](https://github.com/react/react/tree/HEAD/packages/eslint-plugin-react-hooks) rules
- Supports Tailwind CSS syntax

## Install

```sh
npm install --save-dev \
	@next/eslint-plugin-next \
	eslint-config-xo \
	eslint-config-xo-react \
	eslint-config-xo-next
```

`eslint-config-xo-next` requires you to install `@next/eslint-plugin-next` as a direct dependency so its version can be kept in sync with your app’s other Next.js dependencies

## Usage

```js
// eslint.config.js
import eslintConfigXo from 'eslint-config-xo';
import eslintConfigXoNext from 'eslint-config-xo-next';
import eslintConfigXoReact from 'eslint-config-xo-react';
import {defineConfig} from 'eslint/config';

export default defineConfig([
	...eslintConfigXo(),
	...eslintConfigXoReact(),
	...eslintConfigXoNext(),
]);
```

### Options

#### config

Type: `'core-web-vitals' | 'recommended'`\
Default: `'core-web-vitals'`

Which of the [Next.js ESLint configurations](https://nextjs.org/docs/app/api-reference/config/eslint#setup-eslint) to use. See the [Next.js ESLint Plugin documentation](https://nextjs.org/docs/app/api-reference/config/eslint#setup-eslint) for more information.

```js
...xoNext({config: 'recommended'})
```

#### tailwind

Type: `3 | 4`

Enable support for Tailwind CSS v3 or v4 syntax

```js
...xoNext({tailwind: 4})
```

#### rootDir

Type: `string | string[]`

Where to find your Next.js application if Next.js isn’t installed in your root directory. See the [Next.js ESLint Plugin documentation](https://nextjs.org/docs/app/api-reference/config/eslint#specifying-a-root-directory-within-a-monorepo) for more information.

```js
...xoNext({rootDir: 'packages/my-app/'})
```

## Use with [XO](https://github.com/xojs/xo)

```sh
npm install --save-dev \
	@next/eslint-plugin-next \
	eslint-config-xo-react \
	eslint-config-xo-next
```

```js
// xo.config.js
import eslintConfigXoNext from 'eslint-config-xo-next';
import eslintConfigXoReact from 'eslint-config-xo-react';
import {defineConfig} from 'eslint/config';

const xoConfig = defineConfig([
	...eslintConfigXoReact(),
	...eslintConfigXoNext(),
]);
```

## FAQ

### How is this different from [eslint-config-xo-nextjs](https://github.com/tusbar/eslint-config-xo-nextjs)?

This config acts as a minimal compatibility layer between Next.js's and XO's configs instead of wrapping them. With this config, you install your own version of `@next/eslint-plugin-next` so that its version matches your project's `next` and `@next/*` dependencies, and you install your own versions of `eslint-config-xo` (or `xo`) and `eslint-config-xo-react` so that you can update them without waiting for this config to update them.
