import { page } from '@vitest/browser/context';

it('main page looks correct', async () => {
	await page.screenshot();
});
