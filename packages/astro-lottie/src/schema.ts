import {z} from 'astro/zod';

/**
 * Astro-Lottie configuration options schema.
 */
export const AstroLottieOptionsSchema = z
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
			.describe('Enable verbose logging. (default: false)'),
		/**
		 * The directory where the Lottie animations are stored.
		 *
		 *
		 * @type {string}
		 * @default 'src/animations'
		 * */
		directory: z
			.string()
			.optional()
			.default('src/animations')
			.describe(
				'The directory where the Lottie animations are stored. (default: "src/animations")'
			),
	})
	.optional()
	.default({});

/**
 * Astro-Lottie configuration options type.
 */
export type AstroLottieOptions = typeof AstroLottieOptionsSchema._input;

/**
 * Astro-Lottie configuration options type used by the `virtual:astro-lottie/config` module.
 */
export type AstroLottieConfig = z.infer<typeof AstroLottieOptionsSchema>;
