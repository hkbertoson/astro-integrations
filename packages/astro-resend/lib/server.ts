import { randomBytes } from "node:crypto";
import { RESEND_API_KEY } from "astro:env/server";
import config from "virtual:astro-resend/config";
import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(RESEND_API_KEY);

export const prerender = false;

interface EmailOptions {
	from: string;
	to: string;
	subject: string;
	html: string;
	headers?: Record<string, string>;
}

function generateUniqueId(): string {
	return randomBytes(16).toString("hex");
}

export const POST: APIRoute = async ({ request }) => {
	try {
		const data = await request.formData();

		// Convert FormData to an object
		const formDataObject: Record<string, string> = {};
		for (const [key, value] of data.entries()) {
			if (typeof value === "string") {
				formDataObject[key] = value;
			}
		}

		// Generate email content
		const htmlContent = generateEmailContent(formDataObject);
		const entityRefID = generateUniqueId();

		// Validate email config
		if (!config.toEmail || !config.fromEmail) {
			throw new Error("Recipient or sender email address not configured.");
		}

		// Prepare email options
		const emailOptions: EmailOptions = {
			from: config.fromEmail,
			to: config.toEmail,
			subject: "New Form Submission",
			html: htmlContent,
			headers: {
				...(config.preventThreading && { "X-Entity-Ref-ID": entityRefID }),
				...(config.unsubscribeUrl && {
					"List-Unsubscribe": `<${config.unsubscribeUrl}>`,
				}),
			},
		};

		// Send the email
		await resend.emails.send(emailOptions);

		return new Response(
			JSON.stringify({ message: "Form submission received and email sent!" }),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error processing form submission:", error);
		return new Response(
			JSON.stringify({ error: "Failed to process form submission" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};

function generateEmailContent(formData: Record<string, string>): string {
	let contentHtml = "<h1>New Form Submission</h1>";
	contentHtml += "<h2>Form Details:</h2><ul>";

	for (const [key, value] of Object.entries(formData)) {
		contentHtml += `<li><strong>${key}:</strong> ${value}</li>`;
	}

	contentHtml += "</ul>";

	return `
    <html>
      <body>
        ${contentHtml}
      </body>
    </html>
  `;
}

export const ALL: APIRoute = async () => {
	// Return a 405 error for all other requests than POST
	return new Response(
		JSON.stringify({ error: "Method not allowed" }, null, 2),
		{
			status: 405,
			statusText: "method not allowed",
			headers: {
				"content-type": "application/json",
			},
		},
	);
};
