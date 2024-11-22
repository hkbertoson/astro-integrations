import {
	addVitePlugin,
	createResolver,
	defineIntegration,
} from 'astro-integration-kit';
import {AstroLottieOptionsSchema as optionsSchema} from './schema.ts';
import {name} from '../package.json';
import {loggerStrings} from './strings.ts';
import {existsSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import type {AstroIntegrationLogger} from 'astro';

export const integration = defineIntegration({
	name,
	optionsSchema,
	setup({options: {verbose, directory}}) {
		return {
			hooks: {
				'astro:config:setup': (params) => {
					// Destructure the params object
					const {logger, config} = params;

					const {resolve} = createResolver(config.root.pathname);

					// Log startup message
					verbose && logger.info(loggerStrings.setup);

					// Check if the animations directory exists
					verbose && logger.info(loggerStrings.checkingDirectory);
					ensureDir(resolve(`./${directory}`), logger);

					// Check if the Astro config has a 'site' property
					if (!config.site) {
						logger.warn(loggerStrings.configSiteMissing);
					}

					// Watch the animations directory for changes
					addVitePlugin(params, {
						plugin: {
							name: 'astro-lottie',
							configureServer({watcher, moduleGraph}) {
								watcher.add(resolve(`./${directory}/**/*.lottie`));
								watcher.on('change', async () => {
									moduleGraph.invalidateAll();
								});
							},
						},
					});
				},
			},
		};
	},
});

async function ensureDir(
	path: string,
	logger: AstroIntegrationLogger
): Promise<void> {
	if (!existsSync(path)) {
		try {
			logger.info(loggerStrings.dirMissing);
			await mkdir(path, {recursive: true});
		} catch {}
	}
}
