import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	{
		test: {
			include: [
				'tests/unit/**/*.{test,spec}.ts',
				'tests/**/*.unit.{test,spec}.ts',
			],
			name: 'unit',
			environment: 'node',
			globals: true,
		},
	},
	{
		test: {
			include: [
				'tests/browser/**/*.{test,spec}.ts',
				'tests/**/*.browser.{test,spec}.ts',
			],
			name: 'browser',
			browser: {
				enabled: true,
				name: 'chromium',
				provider: 'playwright',
			},
			globals: true,
		},
	},
]);
