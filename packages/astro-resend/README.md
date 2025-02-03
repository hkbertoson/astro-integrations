# Astro Resend

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that allows you to easily send email notifications for form submissions using Resend in an Astro project. The integration captures form data, generates an HTML email, and sends it to a specified recipient using Resend's API.



## Features

- Capture form submissions and send email notifications.
- Generate unique identifiers for each form submission.
- Supports custom headers such as X-Entity-Ref-ID and List-Unsubscribe.
- Customizable email template with all submitted form fields.
- Compatible with Astro's server-side routing and form handling.


## Prerequisites

Before you can use this integration, you need to have a Resend account. You can sign up for a free account [here](https://resend.com/).
## Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add @hbertoson/astro-resend
```

```bash
npx astro add @hbertoson/astro-resend
```

```bash
yarn astro add @hbertoson/astro-resend
```


Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add @hbertoson/astro-resend
```

```bash
npm install @hbertoson/astro-resend
```

```bash
yarn add @hbertoson/astro-resend
```

2. Add the integration to your astro config

```diff
+import resend from '@hbertoson/astro-resend'

export default defineConfig({
  integrations: [
+    resend({
        fromEmail: 'youremail@email.com',
        templates: {
            email: "./src/components/Email.astro",
            email2: "./src/components/Email2.astro",
        }
    }),
  ],
});
```

### Configuration

#### `.env` File

You will need to add your API Key your `.env` file:

- `RESEND_API_KEY` (required): Your Resend API key - this should be kept secret
    
#### Astro Config Options

**`verbose`**
- Type: `boolean`
- Default: `false`

Enable verbose logging.

**`fromEmail`**
- Type: `string`
- Default: `onboarding@resend.dev`

The email you want to use to send emails. 

**`preventThreading`**
- Type: `boolean`
- Default: `false`

Unique string to Prevent Threading on Gmail

**`unsubscribeUrl`**
- Type: `string`

Link to unsubscribe 


## Usage/Examples

```html
  <body>
    <h1>Astro</h1>
    <button>Send Email</button>
    <script>
      import {
        sendEmail,
        type EmailRequest,
      } from "@hbertoson/astro-resend/client";
      const button = document.querySelector("button");
      button?.addEventListener("click", async () => {
        const emailData: EmailRequest = {
          to: "dev@hunterbertoson.tech",
          subject: "Test Email",
          templateName: "email",
          props: {
            name: "Hunter",
            content: "This is a test email. From my Astro Resend Integration",
          },
        };
        await sendEmail(emailData);
      });
    </script>
  </body>
```

## Roadmap

- Support Multiple Recipients

- Allow configuration for sending emails to multiple recipients.
    - Enable dynamic recipient selection based on form input (e.g., department-specific         notifications).

- Enhance Documentation
    - Add more examples for common use cases such as contact forms and feedback forms.
    - Provide templates for common email formats.

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.


Made with ❤️ by [Hunter Bertoson](https://github.com/hkbertoson).



## Acknowledgements

[Astro](https://astro.build/)

[Resend](https://resend.com/)

[Florian Lefebvre](https://github.com/florian-lefebvre)


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
