import type templates from "virtual:astro-resend/templates";

export type TemplateNames = keyof typeof templates;

export interface EmailRequest {
  to: string | string[];
  subject: string;
  templateName: TemplateNames;
  props: Record<string, unknown>;
  headers?: Record<string, string>;
}

export async function sendEmail(request: EmailRequest): Promise<Response> {
  return fetch("/api/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}

export default sendEmail;
