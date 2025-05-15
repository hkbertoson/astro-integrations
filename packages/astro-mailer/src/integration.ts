import {addVirtualImports, defineIntegration} from 'astro-integration-kit';
import {envField} from 'astro/config';
import {name} from '../package.json';
import {AstroMailerOptionsSchema as optionsSchema} from './schema.ts';
import {loggerStrings} from './strings.ts';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import Dts from './stubs.ts';

export const integration = defineIntegration({
	name,
	optionsSchema,
	setup({options, options: {verbose, endpointPath, templates}}) {
		return {
			name,
			hooks: {
				'astro:config:setup': (params) => {
					const {logger, updateConfig, injectRoute, config} = params;
					verbose && logger.info(loggerStrings.setup);

					updateConfig({
						env: {
							validateSecrets: true,
							schema: {
								SMTP_USER: envField.string({
									access: 'secret',
									context: 'server',
									optional: false,
								}),
								SMTP_PASS: envField.string({
									access: 'secret',
									context: 'server',
									optional: false,
								}),
								FROM_EMAIL: envField.string({
									access: 'secret',
									context: 'server',
									optional: false,
								}),
							},
						},
					});

					verbose && logger.info(loggerStrings.virtualImports);

					// Generate templates module content
					const templatesContent = `${Object.entries(templates)
						.map(([name, path]) => {
							const resolvedPath = resolve(fileURLToPath(config.root), path);
							return `import ${name}Template from "${resolvedPath}";`;
						})
						.join('\n')}
						export const templates = {
						${Object.keys(templates)
							.map((name) => `  ${name}: ${name}Template`)
							.join(',\n')}
						};
						export default templates;`;

					addVirtualImports(params, {
						name,
						imports: {
							'virtual:astro-mailer/templates': templatesContent,
						},
					});

					addVirtualImports(params, {
						name,
						imports: {
							'virtual:astro-mailer/config': `export default ${JSON.stringify(options)}`,
						},
					});

					injectRoute({
						pattern: endpointPath,
						entrypoint: `${name}/server`,
						prerender: false,
					});
				},
				'astro:config:done': ({injectTypes}) => {
					injectTypes(Dts.config);
				},
			},
		};
	},
});
