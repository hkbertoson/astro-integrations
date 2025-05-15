import type {APIRoute} from 'astro';
import {experimental_AstroContainer} from 'astro/container';
import {randomBytes} from 'node:crypto';
import nodemailer from 'nodemailer';
import {templates} from 'virtual:astro-mailer/templates';
import config from 'virtual:astro-mailer/config';
import {transformToEmail} from '../src/utils/emailTransformer';
import type {AstroComponentFactory} from 'astro/runtime/server/index.js';
import type {BaseEmailRequest} from 'BaseEmailRequest';
import {FROM_EMAIL, SMTP_USER, SMTP_PASS} from 'astro:env/server';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export const prerender = false;

async function renderEmailTemplate(
	templateName: string,
	props: Record<string, unknown>
): Promise<string> {
	const template = templates[templateName];
	if (!template) {
		throw new Error(
			`Template "${templateName}" not found. Available templates: ${Object.keys(
				templates
			).join(', ')}`
		);
	}

	const container = await experimental_AstroContainer.create();
	const renderedHTML = await container.renderToString(
		template as AstroComponentFactory,
		{
			props: {
				...props,
			},
		}
	);

	const hasInlineStyles = renderedHTML.includes('style=');

	return transformToEmail(renderedHTML, {
		width: 600,
		backgroundColor: '#f6f9fc',
		inlineCss: hasInlineStyles,
		preserveInlineStyles: hasInlineStyles,
	});
}

function generateUniqueId(): string {
	return randomBytes(16).toString('hex');
}

const SMTP_CONFIG: SMTPTransport.Options = {
	host: config.smtp.host,
	port: config.smtp.port,
	secure: config.smtp.secure,
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS,
	},
};

const transporter = nodemailer.createTransport(SMTP_CONFIG);

export const POST: APIRoute = async ({request}) => {
	try {
		const {to, subject, templateName, props, headers} =
			(await request.json()) as BaseEmailRequest;

		if (!to || !subject || !templateName) {
			throw new Error(
				"Missing required fields: 'to', 'subject', and 'templateName' are required"
			);
		}

		const entityRefID = generateUniqueId();
		const html = await renderEmailTemplate(templateName, props || {});

		await transporter.sendMail({
			from: FROM_EMAIL,
			to,
			subject,
			html,
			headers: {
				'X-Entity-Ref-ID': entityRefID,
				...(config.preventThreading && {
					'X-Entity-Ref-ID': entityRefID,
				}),
				...(config.unsubscribeUrl && {
					'List-Unsubscribe': `<${config.unsubscribeUrl}>`,
				}),
				...headers,
			},
		});

		return new Response(
			JSON.stringify({success: true, message: 'Email sent successfully'}),
			{status: 200, headers: {'Content-Type': 'application/json'}}
		);
	} catch (error) {
		console.error('Email error:', error);
		return new Response(
			JSON.stringify({
				success: false,
				error:
					error instanceof Error ? error.message : 'An unknown error occurred',
			}),
			{status: 500, headers: {'Content-Type': 'application/json'}}
		);
	}
};

export const GET: APIRoute = async ({url}) => {
	try {
		const templateName = url.searchParams.get('template');
		if (!templateName) {
			throw new Error('Template name is required as a query parameter');
		}

		const html = await renderEmailTemplate(templateName, {
			name: 'Test User',
			content: 'This is a test email',
		});

		console.log(SMTP_CONFIG);

		return new Response(html, {
			status: 200,
			headers: {'Content-Type': 'text/html'},
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				error:
					error instanceof Error ? error.message : 'Failed to render template',
			}),
			{status: 500, headers: {'Content-Type': 'application/json'}}
		);
	}
};
