declare module 'virtual:astro-mailer/templates' {
	export const templates: Record<string, any>;
}

declare module 'virtual:astro-mailer/config' {
	import type {AstroMailerConfig} from '@hbertoson/astro-mailer/schema';
	export default AstroMailerConfig as Config;
}
declare module 'BaseEmailRequest' {
	export interface BaseEmailRequest {
		to: string | string[];
		subject: string;
		templateName: string;
		props: Record<string, unknown>;
		headers?: Record<string, string>;
	}
}
