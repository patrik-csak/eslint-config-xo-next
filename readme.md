# eslint-config-xo-next

ESLint [shareable config](http://eslint.org/docs/developer-guide/shareable-configs.html) for [Next.js](https://nextjs.org) to be used with [eslint-config-xo-react](https://github.com/xojs/eslint-config-xo-react)

## Features

- Eliminates plugin and parser conflicts between ESLint 10, `eslint-config-next`, and `eslint-config-xo-react`
- Allows you to combine [Next.js's rules](https://nextjs.org/docs/app/api-reference/config/eslint#rules) with XO's stricter React, accessibility, and hooks rules
- Allows you to use XO's maintained ESLint plugins instead of Next.js's unmaintained plugins[^1]
- Acts as a thin compatibility layer instead of depending on and wrapping Next.js or XO packages
	- Your app's `@next/eslint-plugin-next` version can be kept in sync with `next` and other `@next/*` packages using `next upgrade` or `@next/codemod upgrade`
	- You can update `eslint-config-xo` and `eslint-config-xo-react` without waiting for this config to update
- Supports Tailwind CSS

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

[^1]: `eslint-config-next` depends on `eslint-plugin-react` and `eslint-plugin-jsx-a11y`, which are unmaintained and incompatible with ESLint 10. `eslint-config-xo-react` uses `@eslint-react/eslint-plugin` and `eslint-plugin-jsx-a11y-x`.
