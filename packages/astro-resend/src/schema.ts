import { z } from "astro/zod";

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

  if (!arg.startsWith("/"))
    ctx.addIssue({
      code,
      message: `${endpointErrorMessages.startsWith} Error: ${arg}`,
    });

  if (!/^[a-zA-Z0-9\-_\/]+$/.test(arg))
    ctx.addIssue({
      code,
      message: `${endpointErrorMessages.urlSafe} Error: ${arg}`,
    });

  if (arg.endsWith("/"))
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
    .regex(/\.astro$/, "Template path must end in .astro")
);

export const AstroResendOptionsSchema = z
  .object({
    /**
     * Enable verbose logging
     */
    verbose: z
      .boolean()
      .optional()
      .default(false)
      .describe("Enable verbose logging"),

    /**
     * Email templates configuration
     */
    templates: templatesSchema.describe(
      "Record of template names to their file paths (e.g., { welcome: './src/emails/welcome.astro' })"
    ),

    /**
     * Default from email
     */
    fromEmail: z
      .string()
      .email()
      .describe("Default email address to send from"),

    /**
     * API endpoint path
     */
    endpointPath: z
      .string()
      .optional()
      .default("/api/email")
      .superRefine(endpointPathSuperRefine)
      .describe("The API endpoint path"),

    /**
     * Email headers
     */
    headers: z
      .object({
        preventThreading: z
          .boolean()
          .optional()
          .default(false)
          .describe("Prevent email threading"),

        unsubscribeUrl: z.string().url().optional().describe("Unsubscribe URL"),
      })
      .optional()
      .default({}),
  })
  .strict();

export type AstroResendOptions = z.input<typeof AstroResendOptionsSchema>;
export type AstroResendConfig = z.infer<typeof AstroResendOptionsSchema>;
