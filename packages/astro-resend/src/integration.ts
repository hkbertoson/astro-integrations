import {addVirtualImports, defineIntegration} from 'astro-integration-kit';
import {AstroResendOptionsSchema as optionsSchema} from './schema.ts';
import {envField} from 'astro/config';
import {loggerStrings} from './strings.ts';

export const integration = defineIntegration({
	name: 'astro-resend',
	optionsSchema,
	setup({name,options: {verbose}}) {
		return {
			hooks: {
				'astro:config:setup': (params) => {
					// Destructure the params object
					const {logger, updateConfig} = params;

					// Log startup message
					verbose && logger.info(loggerStrings.setup);

					// Update the User's Astro config ('astro:env') with the required Resend
					// environment variables and Set the 'checkOrigin' security option to true
					verbose && logger.info(loggerStrings.updateConfig);
					updateConfig({
						security: {
							checkOrigin: true,
						},
						experimental: {
							env: {
								validateSecrets: true,
								schema: {
									RESEND_API_KEY: envField.string({
										access: 'secret',
										context: 'server',
										optional: false,
									}),
								},
							},
						},
					});

					addVirtualImports(params, {
						name,
						imports: {
							'astro-resend:components': `export * from '${name}/components';`,
						}
					})
				},
			},
		};
	},
});
