import mailer from '@hbertoson/astro-mailer';
// @ts-check
import {defineConfig} from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	integrations: [
		mailer({
			verbose: true,
			smtp: {
				host: 'mail.smtp2go.com',
			},
			templates: {
				email: './src/components/Email.astro',
				email2: './src/components/Email2.astro',
			},
		}),
	],

	adapter: node({
		mode: 'standalone',
	}),
});
