import {defineIntegration} from 'astro-integration-kit';
import {name} from '../package.json';

export const astroLottie = defineIntegration({
	name,
	setup({options: {verbose}}) {
		return {
			hooks: {
				'astro:config:setup': (params) => {
					console.log(params);
				},
			},
		};
	},
});

export default astroLottie;
