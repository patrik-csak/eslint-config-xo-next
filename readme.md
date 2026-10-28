# eslint-config-xo-next

ESLint [shareable config](http://eslint.org/docs/developer-guide/shareable-configs.html) for [Next.js](https://nextjs.org) to be used with [eslint-config-xo-react](https://github.com/xojs/eslint-config-xo-react)

## Features

- Allows you to use eslint-config-xo-react with eslint-config-next without ESLint config or plugin conflicts
- Works as a thin compatibility layer instead of depending on Next.js or XO packages
- Supports Tailwind CSS

## Install

```sh
npm uninstall eslint-config-next
npm install --save-dev \
	@next/eslint-plugin-next \
	eslint-config-xo \
	eslint-config-xo-react \
	eslint-config-xo-next
```

## Usage

```js
// eslint.config.js
import {defineConfig} from 'eslint/config';
import eslintConfigXo from 'eslint-config-xo';
import eslintConfigXoNext from 'eslint-config-xo-next';
import eslintConfigXoReact from 'eslint-config-xo-react';

export default defineConfig([
	...eslintConfigXo(),
	...eslintConfigXoReact(),
	...eslintConfigXoNext(),
]);
```

<details>
<summary>Use with <a href=https://github.com/xojs/xo>XO</a></summary>

```sh
npm uninstall eslint-config-next
npm install --save-dev \
	@next/eslint-plugin-next \
	eslint-config-xo-react \
	eslint-config-xo-next
```

```js
// xo.config.js
import {defineConfig} from 'eslint/config';
import eslintConfigXoNext from 'eslint-config-xo-next';
import eslintConfigXoReact from 'eslint-config-xo-react';

const xoConfig = defineConfig([
	...eslintConfigXoReact(),
	...eslintConfigXoNext(),
]);
```
</details>

### Options

#### config

Type: `'core-web-vitals' | 'recommended'`\
Default: `'core-web-vitals'`

Which of the Next.js ESLint configurations to use. See the [Next.js ESLint Plugin documentation](https://nextjs.org/docs/app/api-reference/config/eslint) for more information.

```js
eslintXoNext({config: 'recommended'})
```

#### tailwind

Type: `3 | 4`

Enable support for Tailwind CSS v3 or v4 syntax

```js
eslintXoNext({tailwind: 4})
```

#### rootDir

Type: `string | string[]`

Where to find your Next.js application if Next.js isn’t installed in your root directory. See the [Next.js ESLint Plugin documentation](https://nextjs.org/docs/app/api-reference/config/eslint#specifying-a-root-directory-within-a-monorepo) for more information.

```js
eslintXoNext({rootDir: 'packages/my-app/'})
```

## Comparison

Below is a comparison of the plugins and enabled rule counts between `eslint-config-next` and `eslint-config-xo-react`

| | `eslint-config-next` plugin | `eslint-config-next` rules | `eslint-config-xo-react` plugin | `eslint-config-xo-react` rules |
|---|---|--:|---|--:|
| **Next.js** | `@next/eslint-plugin-next` | 22 | `@next/eslint-plugin-next` | 22 |
| **React** | `eslint-plugin-react` (unmaintained) | 22 | **`@eslint-react/eslint-plugin`** | **69** |
| **Hooks** | `react-hooks` | 16 | `react-hooks` | **17** |
| **Accessibility** | `jsx-a11y` (unmaintained) | 6 | **`jsx-a11y-x`** | **28** |
| **TypeScript** | `@typescript-eslint` | 20 | `@typescript-eslint` | **94** |
| **Import** | `eslint-plugin-import` (unmaintained) | 1 | **`eslint-plugin-import-x`** | **23** |
| **Totals** | | 87 | | **253** |

<details>
<summary>Comparison package versions</summary>

- eslint-config-next: 16.4.3
- eslint-config-xo-react: 0.32.0
- eslint-config-xo: 7.0.0
</details>
