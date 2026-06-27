/* eslint-disable
	jsdoc/require-description,
	jsdoc/require-param-description,
	jsdoc/require-returns-description,
	no-shadow,
	-- Decrease strictness for test file
*/
import assert from 'node:assert';
import {suite, test} from 'node:test';
import {fixupConfigRules} from '@eslint/compat';
import {ESLint} from 'eslint';
import configXoReact from 'eslint-config-xo-react';
import configXoNext from './index.js';

/** @typedef {import('eslint').Linter} Linter */

/**
 @param {string} code
 @param {Linter.Config[]} config
 */
async function runEslint(code, config) {
	const eslint = new ESLint({
		overrideConfigFile: true,
		overrideConfig: config,
	});

	const [firstResult] = await eslint.lintText(code);

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
	return [...configXoNext(options), ...fixupConfigRules(configXoReact())];
}

suite('options validation', () => {
	for (const [description, options] of [
		['bad config', {config: 'invalid'}],
		['bad jsxA11yConfig', {jsxA11yConfig: 'invalid'}],
		['bad rootDir', {rootDir: 123}],
		['unexpected option', {unknown: true}],
	]) {
		test(`rejects ${description}`, () => {
			assert.throws(
				() => {
					configXoNext(options);
				},
				{name: 'ArgumentError'},
			);
		});
	}
});

suite('jsx-a11y rules', () => {
	test('next config is default', async () => {
		const messages = await runEslint('<Image src="foo.jpg" />', config());

		assert.ok(hasMessage(messages, {
			ruleId: 'jsx-a11y/alt-text',
			severity: severity.warn,
		}));
	});

	suite('recommended config works', () => {
		test('existing rules are overridden', async () => {
			const messages = await runEslint(
				'<Image src="foo.jpg" />',
				config({jsxA11yConfig: 'recommended'}),
			);

			assert.ok(hasMessage(messages, {
				ruleId: 'jsx-a11y/alt-text',
				severity: severity.error,
			}));
		});

		test('new rules are applied', async () => {
			const messages = await runEslint(
				'<a />',
				config({jsxA11yConfig: 'recommended'}),
			);

			assert.ok(hasMessage(messages, {
				ruleId: 'jsx-a11y/anchor-has-content',
				severity: severity.error,
			}));
		});
	});

	test('strict config works', async () => {
		const messages = await runEslint(
			'<ul role="listbox" />',
			config({jsxA11yConfig: 'strict'}),
		);

		assert.ok(hasMessage(messages, {
			ruleId: 'jsx-a11y/no-noninteractive-element-to-interactive-role',
			severity: severity.error,
		}));
	});
});

suite('next.js rules', () => {
	const syncScriptFixture = '<script src="https://third-party-script.js" />';

	test('core-web-vitals config is default', async () => {
		const messages = await runEslint(syncScriptFixture, config());

		assert.ok(hasMessage(messages, {
			ruleId: '@next/next/no-sync-scripts',
			severity: severity.error,
		}));
	});

	test('recommended config works', async () => {
		const messages = await runEslint(
			syncScriptFixture,
			config({config: 'recommended'}),
		);

		assert.ok(hasMessage(messages, {
			ruleId: '@next/next/no-sync-scripts',
			severity: severity.warn,
		}));
	});
});
