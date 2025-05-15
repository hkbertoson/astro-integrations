# Astro Mailer

**Astro Mailer** is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that enables you to send email notifications via **any SMTP service** using **Nodemailer**. This is perfect for handling form submissions, alerts, or transactional messages in your Astro project.

## Features

* Send email notifications from your Astro site using SMTP.
* Capture form data and pass it into customizable email templates.
* Supports custom headers such as `X-Entity-Ref-ID` and `List-Unsubscribe`.
* Compatible with Astro’s server-side routing and form handling.
* Flexible SMTP configuration for any provider (e.g., Gmail, SendGrid, Mailgun, etc).

## Prerequisites

You’ll need access to any SMTP server. For example:

* Gmail
* SendGrid
* Amazon SES
* Mailgun
* SMTP2GO
* Postmark
* Mailjet
* Zoho Mail
* Office 365
* Any other SMTP service

## Installation

Install via the Astro CLI:

```bash
pnpm astro add @hbertoson/astro-mailer
```

```bash
npm astro add @hbertoson/astro-mailer
```

```bash
yarn astro add @hbertoson/astro-mailer
```

Or manually:

1. Install dependencies:

```bash
pnpm add @hbertoson/astro-mailer
```

2. Add it to your Astro config:

```ts
import mailer from '@hbertoson/astro-mailer';

export default defineConfig({
  integrations: [
    mailer({
      smtp: {
        host: 'smtp.example.com',
      },
      templates: {
        welcome: './src/components/emails/WelcomeEmail.astro',
      },
    }),
  ],
});
```

### `.env` Setup

```env
SMTP_USER=your@email.com
SMTP_PASS=yourpassword
FROM_EMAIL=no-reply@yourdomain.com
```

## Configuration Options

| Option             | Type      | Required | Description                       |
| ------------------ | --------- | -------- | --------------------------------- |
| `fromEmail`        | `string`  | ✅        | Sender email address              |
| `smtp`             | `object`  | ✅        | SMTP configuration for Nodemailer |
| `templates`        | `object`  | ✅        | Named Astro components for emails |
| `preventThreading` | `boolean` | ❌        | Prevent Gmail threading           |
| `unsubscribeUrl`   | `string`  | ❌        | Add List-Unsubscribe header       |
| `verbose`          | `boolean` | ❌        | Enable debug logging              |

## Usage Example

```astro
<body>
  <h1>Astro Mailer</h1>
  <button>Send Email</button>
		<script>
			const button = document.querySelector('button') as HTMLButtonElement;
			button.addEventListener('click', async () => {
				const emailData: BaseEmailRequest = {
					to: 'dev@hunterbertoson.tech',
					subject: 'Test Email',
					templateName: 'email',
					props: {
						name: 'Hunter',
						content: 'This is a test email. From my Astro Mailer Integration',
					},
				};
				const res = await fetch('api/email', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(emailData),
				});
				if (res.ok) {
					const data = await res.json();
					console.log('Email sent successfully:', data);
				} else {
					console.error('Error sending email:', res.statusText);
				}
			});
		</script>
</body>
```

## Roadmap

* [ ] Add CC and BCC support
* [ ] Async form binding example
* [ ] File attachments
* [ ] Email queues with retry
* [ ] SMTP transport pool option

## Contributing

This repo is structured as a monorepo:

* `playground`: example Astro project to test the integration
* `package`: source code of the integration

Start developing:

```bash
pnpm i --frozen-lockfile
pnpm dev
```

## Acknowledgements

* [Astro](https://astro.build/)
* [Nodemailer](https://nodemailer.com/)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

