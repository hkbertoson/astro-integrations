import {defineIntegration} from 'astro-integration-kit';
import {envField} from 'astro/config';
import {name} from '../package.json';
import {loggerStrings} from './strings.ts';

export const astroS3 = defineIntegration({
	name,
	setup({options: {verbose}}) {
		return {
			hooks: {
				'astro:config:setup': (params) => {
					const {logger, updateConfig, config} = params;
					verbose && logger.info(loggerStrings.setup);

					// Update the User's Astro config ('astro:env') with the required S3 environment variables
					verbose && logger.info(loggerStrings.updateConfig);
					updateConfig({
						experimental: {
							env: {
								validateSecrets: true,
								schema: {
									S3_BUCKET: envField.string({
										access: 'secret',
										context: 'server',
										optional: true,
									}),
									region: envField.string({
										access: 'secret',
										context: 'server',
										optional: true,
									}),
									S3_ACCESS_KEY: envField.string({
										access: 'secret',
										context: 'server',
										optional: true,
									}),
									S3_SECRET_KEY: envField.string({
										access: 'secret',
										context: 'server',
										optional: true,
									}),
								},
							},
						},
					});

					// Check if the Astro config has a 'site' property
					if (!config.site) {
						logger.warn(loggerStrings.configSiteMissing);
					}
				},
			},
		};
	},
});

export default astroS3;
