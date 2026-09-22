/*
eslint-disable
jsdoc/require-description,
jsdoc/require-param-description,
jsdoc/require-returns-description,
no-shadow,
-- Decrease strictness for test file
*/
import assert from 'node:assert';
import {suite, test} from 'node:test';
import {ESLint} from 'eslint';
import xo from 'eslint-config-xo';
import xoReact from 'eslint-config-xo-react';
import xoNext from './index.js';

/**
@typedef {import('eslint').Linter} Linter
*/

/**
@param {object} params
@param {string} params.code
@param {Linter.Config[]} params.config
@param {string} [params.filePath]
*/
async function runEslint({code, config, filePath}) {
	const eslint = new ESLint({
		overrideConfigFile: true,
		overrideConfig: config,
	});

	const [firstResult] = await eslint.lintText(code, {filePath});

	return firstResult.messages;
}

/**
@param {Linter.LintMessage[]} messages
@param {Partial<Linter.LintMessage>} expected
@returns {boolean}
*/
function hasMessage(messages, expected) {
	return messages.some(message =>
		Object.entries(expected).every(([key, value]) => message[key] === value));
}

const severity = {
	off: 0,
	warn: 1,
	error: 2,
};

/**
 @param {import('./index.js').Options} [options]
 @returns {Linter.Config[]}
 */
function config(options) {
	return [...xo(), ...xoReact(), ...xoNext(options)];
}

suite('options validation', () => {
	for (const [description, options] of [
		['bad config', {config: 'invalid'}],
		['bad rootDir', {rootDir: 123}],
		['bad tailwind', {tailwind: true}],
		['unexpected option', {unknown: true}],
	]) {
		test(`rejects ${description}`, () => {
			assert.throws(
				() => {
					xoNext(options);
				},
				{name: 'ArgumentError'},
			);
		});
	}
});

suite('xo rules', () => {
	test('file extensions in imports are not required', async () => {
		const code = 'import index from "./index"';
		const messages = await runEslint({code, config: config()});

		assert.ok(!hasMessage(messages, {
			ruleId: 'n/file-extension-in-import',
			severity: severity.error,
		}));
	});
});

suite('jsx-a11y-x rules', () => {
	test('next component mapping works', async () => {
		const messages = await runEslint({
			code: '<Image src="foo.jpg" />',
			config: config(),
		});

		assert.ok(hasMessage(messages, {
			ruleId: 'jsx-a11y-x/alt-text',
			severity: severity.error,
		}));
	});
});

suite('next.js rules', () => {
	const syncScriptCode = '<script src="https://third-party-script.js" />';

	test('core-web-vitals config is default', async () => {
		const messages = await runEslint({
			code: syncScriptCode,
			config: config(),
		});

		assert.ok(hasMessage(messages, {
			ruleId: '@next/next/no-sync-scripts',
			severity: severity.error,
		}));
	});

	test('recommended config works', async () => {
		const messages = await runEslint({
			code: syncScriptCode,
			config: config({config: 'recommended'}),
		});

		assert.ok(hasMessage(messages, {
			ruleId: '@next/next/no-sync-scripts',
			severity: severity.warn,
		}));
	});
});

suite('tailwind css syntax', () => {
	const tailwind4Code = '@theme { --color-brand: #123456; }';

	test('unsupported by default', async () => {
		const messages = await runEslint({
			code: tailwind4Code,
			config: config(),
			filePath: 'styles.css',
		});

		assert.ok(hasMessage(messages, {
			ruleId: 'css/no-invalid-at-rules',
			severity: severity.error,
		}));
	});

	test('supports tailwind 4 syntax', async () => {
		const messages = await runEslint({
			code: tailwind4Code,
			config: config({tailwind: 4}),
			filePath: 'styles.css',
		});

		assert.ok(!hasMessage(messages, {
			ruleId: 'css/no-invalid-at-rules',
			severity: severity.error,
		}));
	});

	test('supports tailwind 3 syntax', async () => {
		const messages = await runEslint({
			code: '@tailwind base',
			config: config({tailwind: 3}),
			filePath: 'styles.css',
		});

		assert.ok(!hasMessage(messages, {
			ruleId: 'css/no-invalid-at-rules',
			severity: severity.error,
		}));
	});
});
