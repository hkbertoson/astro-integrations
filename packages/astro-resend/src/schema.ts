import { z } from "astro/zod";

/**
 * Astro-Resend configuration options schema.
 */
export const AstroResendOptionsSchema = z
	.object({
		/**
		 * Enable verbose logging.
		 * @type {boolean}
		 * @default false
		 */
		verbose: z
			.boolean()
			.optional()
			.default(false)
			.describe("Enable verbose logging. (default: false)"),
		/**
		 * From Email.
		 * @type {string}
		 * @default "Acme <onboarding@resend.dev>"
		 */
		fromEmail: z
			.string()
			.default("Acme <onboarding@resend.dev>")
			.describe(
				"Default email to use when sending emails (default: Acme <onboarding@resend.dev>)",
			),
		/**
		 * To Email.
		 * @type {string}
		 * @default "Acme <onboarding@resend.dev>"
		 */
		toEmail: z
			.string()
			.default("Acme <onboarding@resend.dev>")
			.describe("Recipient email address."),
		/**
		 * Prevent Threading on Gmail
		 * @type {boolean}
		 * @default false
		 */
		preventThreading: z
			.boolean()
			.optional()
			.default(false)
			.describe("Prevent threading on Gmail. (default: false)"),
		/**
		 * Unsubscribe URL header.
		 * @type {string}
		 */
		unsubscribeUrl: z.string().optional().describe("Unsubscribe URL header."),
	})
	.optional()
	.default({});

/**
 * Astro-Resend configuration options type.
 */
export type AstroResendOptions = typeof AstroResendOptionsSchema._input;

/**
 * Astro-Resend configuration options type used by the `virtual:astro-resend/config` module.
 */
export type AstroResendConfig = z.infer<typeof AstroResendOptionsSchema>;
