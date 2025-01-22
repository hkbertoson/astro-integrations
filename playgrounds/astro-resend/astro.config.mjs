import resend from "@hbertoson/astro-resend";
// @ts-check
import { defineConfig, envField } from "astro/config";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	output: "server",
	integrations: [
		resend({
			fromEmail: "noreply@hunterbertoson.tech",
			verbose: true,
			templates: {
				Email: "./src/components/Email.astro",
				Email2: "./src/components/Email2.astro",
			}
		}),
	],

	adapter: node({
		mode: "standalone",
	}),
});