// @ts-check
import {defineConfig} from 'astro/config';

import AstroLottie from '@hbertoson/astro-lottie';

// https://astro.build/config
export default defineConfig({
	integrations: [
		AstroLottie({
			verbose: true,
			directory: 'src/lottie',
		}),
	],
});
