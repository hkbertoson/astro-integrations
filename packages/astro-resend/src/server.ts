import { Resend } from "resend";
import { RESEND_API_KEY } from "astro:env/server";
import config from "virtual:astro-resend/config";
import type { APIRoute } from "astro";

const resend = new Resend(RESEND_API_KEY);

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	try {
		const data = await request.formData();
		// Get the email address from the form data
		const email = data.get("email");
		if (!email) {
			return new Response(JSON.stringify({ error: "Missing email address" }), {
				status: 400,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}

		// Send the email
		await resend.emails.send({
			from: config.fromEmail,
			to: email.toString(),
			subject: "Welcome to Resend!",
			html: `<p>Click <a href="https://resend.dev">here</a> to sign up for Resend!</p>`,
		});

		return new Response(JSON.stringify({ message: "Email sent!" }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		// Handle errors from the resend API
		console.error("Error sending email:", error);
		return new Response(JSON.stringify({ error: "Failed to send email" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
};
