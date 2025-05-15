/// <reference types="astro/client" />

declare module 'astro:env/server' {
	export const FROM_EMAIL: string;
	export const SMTP_USER: string;
	export const SMTP_PASS: string;
}
