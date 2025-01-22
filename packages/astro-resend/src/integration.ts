import { addVirtualImports, defineIntegration } from "astro-integration-kit";
import { envField } from "astro/config";
import { name } from "../package.json";
import { AstroResendOptionsSchema as optionsSchema } from "./schema.ts";
import { loggerStrings } from "./strings.ts";
import Dts from "./stubs.ts";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const integration = defineIntegration({
  name,
  optionsSchema,
  setup({ options, options: { verbose, endpointPath, templates } }) {
    return {
      hooks: {
        "astro:config:setup": async (params) => {
          const {
            logger,
            updateConfig,
            injectRoute,
            config: astroConfig,
          } = params;

          verbose && logger.info(loggerStrings.setup);

          updateConfig({
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
          });

          verbose && logger.info(loggerStrings.virtualImports);

          // Generate templates module content
          const templatesContent = `
              ${Object.entries(templates)
                .map(([name, path]) => {
                  const resolvedPath = resolve(
                    fileURLToPath(astroConfig.root),
                    path
                  );
                  return `import ${name}Template from "${resolvedPath}";`;
                })
                .join("\n")}

              export const templates = {
              ${Object.keys(templates)
                .map((name) => `  ${name}: ${name}Template`)
                .join(",\n")}
              };
              export default templates;
        `;

          // Add virtual imports
          addVirtualImports(params, {
            name,
            imports: {
              "virtual:astro-resend/config": `export default ${JSON.stringify(
                options
              )}`,
              "virtual:astro-resend/templates": templatesContent,
            },
          });

          injectRoute({
            pattern: endpointPath,
            entrypoint: `${name}/server`,
            prerender: false,
          });
        },
        "astro:config:done": ({ injectTypes }) => {
          injectTypes(Dts.config);
        },
      },
    };
  },
});
