import {z} from 'astro/zod';

const endpointErrorMessages = {
	startsWith:
		"The endpoint path must start with a forward slash. (e.g. '/api/email')",
	urlSafe:
		"The endpoint path must only contain URL-safe characters. (e.g. '/api/email')",
	endsWith:
		"The endpoint path must not end with a forward slash. (e.g. '/api/email')",
};

function endpointPathSuperRefine(arg: string, ctx: z.RefinementCtx): void {
	const code = z.ZodIssueCode.custom;

	if (!arg.startsWith('/'))
		ctx.addIssue({
			code,
			message: `${endpointErrorMessages.startsWith} Error: ${arg}`,
		});

	if (!/^[a-zA-Z0-9\-_\/]+$/.test(arg))
		ctx.addIssue({
			code,
			message: `${endpointErrorMessages.urlSafe} Error: ${arg}`,
		});

	if (arg.endsWith('/'))
		ctx.addIssue({
			code,
			message: `${endpointErrorMessages.endsWith} Error: ${arg}`,
		});
}

// Schema for template paths
const templatesSchema = z.record(
	z.string().min(1),
	z
		.string()
		.min(1)
		.regex(/\.astro$/, 'Template path must end in .astro')
);

// SMTP configuration schema
const smtpSchema = z.object({
	host: z.string().min(1, 'SMTP host is required'),
	port: z
		.union([z.literal(587), z.literal(465)])
		.default(587)
		.describe('Allowed SMTP ports (587 or 465)'),
	secure: z
		.boolean()
		.optional()
		.default(false)
		.describe('Use secure connection (true for port 465, false for others)'),
});

export const AstroMailerOptionsSchema = z
	.object({
		verbose: z
			.boolean()
			.optional()
			.default(false)
			.describe('Enable verbose logging'),

		gmail: z
			.boolean()
			.optional()
			.default(false)
			.describe('Use Gmail OAuth2 for sending email'),

		smtp: smtpSchema.optional().describe('SMTP configuration'),

		templates: templatesSchema.describe(
			"Record of email template keys mapped to .astro file paths (e.g., { welcome: './src/emails/welcome.astro' })"
		),

		endpointPath: z
			.string()
			.optional()
			.default('/api/email')
			.superRefine(endpointPathSuperRefine)
			.describe('The API endpoint path'),

		headers: z
			.object({
				preventThreading: z.boolean().optional().default(false),
				unsubscribeUrl: z.string().url().optional(),
			})
			.optional()
			.default({}),
	})
	.strict();

export type AstroMailerOptions = z.input<typeof AstroMailerOptionsSchema>;
export type AstroMailerConfig = z.infer<typeof AstroMailerOptionsSchema>;
