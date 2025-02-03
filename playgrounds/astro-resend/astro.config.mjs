import resend from "@hbertoson/astro-resend";
// @ts-check
import { defineConfig } from "astro/config";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	output: "server",
	integrations: [
		resend({
			fromEmail: "noreply@hunterbertoson.tech",
			verbose: true,
			templates: {
				email: "./src/components/Email.astro",
				email2: "./src/components/Email2.astro",
			},
			headers: {
				preventThreading: true,
			}
		}),
	],

	adapter: node({
		mode: "standalone",
	}),
});