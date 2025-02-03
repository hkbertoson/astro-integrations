import type { APIRoute } from "astro";
import { Resend } from "resend";
import { experimental_AstroContainer } from "astro/container";
import { randomBytes } from "node:crypto";
import { RESEND_API_KEY } from "astro:env/server";
import templates from "virtual:astro-resend/templates";
import config from "virtual:astro-resend/config";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { transformToEmail } from "../src/utils/emailTransformer";
import type { EmailRequest } from "./client";

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
      ).join(", ")}`
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

  const hasInlineStyles = renderedHTML.includes("style=");

  return transformToEmail(renderedHTML, {
    width: 600,
    backgroundColor: "#f6f9fc",
    inlineCss: hasInlineStyles,
    preserveInlineStyles: hasInlineStyles,
  });
}

function generateUniqueId(): string {
  return randomBytes(16).toString("hex");
}

export const POST: APIRoute = async ({ request }) => {
  const resend = new Resend(RESEND_API_KEY);
  try {
    const { to, subject, templateName, props, headers } =
      (await request.json()) as EmailRequest;

    if (!to || !subject || !templateName) {
      throw new Error(
        "Missing required fields: 'to', 'subject', and 'templateName' are required"
      );
    }

    const entityRefID = generateUniqueId();
    const html = await renderEmailTemplate(templateName, props || {});

    await resend.emails.send({
      from: config.fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      headers: {
        "X-Entity-Ref-ID": entityRefID,
        ...(config.headers?.preventThreading && {
          "X-Entity-Ref-ID": entityRefID,
        }),
        ...(config.headers?.unsubscribeUrl && {
          "List-Unsubscribe": `<${config.headers.unsubscribeUrl}>`,
        }),
        ...headers,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    // Get template name from query parameter
    const templateName = url.searchParams.get("template");
    if (!templateName) {
      throw new Error("Template name is required as a query parameter");
    }

    const html = await renderEmailTemplate(templateName, {
      name: "Test User",
      content: "This is a test email",
    });

    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Failed to render template",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
