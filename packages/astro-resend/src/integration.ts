import { addVirtualImports, defineIntegration } from "astro-integration-kit";
import { envField } from "astro/config";
import { name } from "../package.json";
import { AstroResendOptionsSchema as optionsSchema } from "./schema.ts";
import { loggerStrings } from "./strings.ts";
import Dts from "./stubs.ts";

export const integration = defineIntegration({
	name,
	optionsSchema,
	setup({ options, options: { verbose } }) {
		return {
			hooks: {
				"astro:config:setup": (params) => {
					// Destructure the params object
					const { logger, updateConfig, injectRoute } = params;

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
										access: "secret",
										context: "server",
										optional: false,
									}),
								},
							},
						},
					});

					verbose && logger.info(loggerStrings.virtualImports);
					addVirtualImports(params, {
						name,
						imports: {
							"virtual:astro-resend/config": `export default ${JSON.stringify(options)}`,
						},
					});

					injectRoute({
						pattern: "/api",
						entrypoint: `${name}/server`,
					});
				},
				"astro:config:done": ({ injectTypes }) => {
					injectTypes(Dts.config);
				},
			},
		};
	},
});
