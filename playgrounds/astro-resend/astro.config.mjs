import resend from "@hbertoson/astro-resend";
// @ts-check
import { defineConfig } from "astro/config";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	output: "server",
	integrations: [
		resend({
			fromEmail: "",
			toEmail: "",
			preventThreading: true,
			verbose: true,
		}),
	],

	adapter: node({
		mode: "standalone",
	}),
});
