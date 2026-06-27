# eslint-config-xo-next

ESLint [shareable config](http://eslint.org/docs/developer-guide/shareable-configs.html) for using [XO](https://github.com/xojs/xo) in [Next.js](https://nextjs.org) projects

## Features

- Eliminates ESLint plugin and parser conflicts that come up when attempting to use ESLint 10 with `eslint-config-next` and `eslint-config-xo-react`
- Combines the [`@next/next`](https://nextjs.org/docs/app/api-reference/config/eslint#rules) and `eslint-plugin-jsx-a11y` rules from `eslint-config-next` with the stricter `eslint-plugin-react`, and `eslint-plugin-react-hooks` rules from `eslint-config-xo-react`
- Allows you to use the more substantial `recommended` or `strict` configs from `eslint-plugin-jsx-a11y`

## Install

`eslint-config-xo-next` requires you to install `@next/eslint-plugin-next` as a direct dependency so its version can be kept in sync with your app’s other Next.js dependencies

> [!NOTE]
> `@eslint/compat` is necessary until `eslint-plugin-react` supports ESLint v10

```sh
npm install --save-dev \
	@eslint/compat \
	@next/eslint-plugin-next \
	eslint-config-xo-next
```

## Usage

Spread the config in your XO configuration file:

```js
// xo.config.js

import {fixupConfigRules} from '@eslint/compat';
import xoNext from 'eslint-config-xo-next';
import xoReact from 'eslint-config-xo-react';

const xoConfig = [
	...xoNext(),
	...fixupConfigRules(xoReact()),
];

export default xoConfig;
```

Or, if you’re using XO [without the `xo` CLI](https://github.com/xojs/xo#without-the-xo-cli), spread the config in your ESLint configuration file:

```js
// eslint.config.js

import {fixupConfigRules} from '@eslint/compat';
import xo from 'eslint-config-xo';
import xoNext from 'eslint-config-xo-next';
import xoReact from 'eslint-config-xo-react';
import {defineConfig} from 'eslint/config';

export default defineConfig([
	...xo(),
	...xoNext(),
	...fixupConfigRules(xoReact()),
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

#### jsxA11yConfig

Type: `'next' | 'recommended' | 'strict'`\
Default: `'next'`

Which `eslint-plugin-jsx-a11y` to use. Set to `'next'` to use the [`jsx-a11y` rules from `eslint-config-next`](https://github.com/vercel/next.js/blob/next-16-2/packages/eslint-config-next/src/index.ts#L72-L83). Set to `'recommended'` or `'strict'` to use an [`eslint-plugin-jsx-a11y` shareable config](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#shareable-configs).

```js
...xoNext({jsxA11yConfig: 'recommended'})
```

#### rootDir

Type: `string | string[]`

Where to find your Next.js application if Next.js isn’t installed in your root directory. See the [Next.js ESLint Plugin documentation](https://nextjs.org/docs/app/api-reference/config/eslint#specifying-a-root-directory-within-a-monorepo) for more information.

```js
...xoNext({rootDir: 'packages/my-app/'})
```

## Related

- [eslint-config-xo](https://github.com/xojs/eslint-config-xo) - ESLint shareable config for XO
- [eslint-config-xo-react](https://github.com/xojs/eslint-config-xo-react) - ESLint shareable config for React to be used with eslint-config-xo
- [XO](https://github.com/xojs/xo)
