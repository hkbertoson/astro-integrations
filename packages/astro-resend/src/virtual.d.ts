interface BaseEmailRequest {
  to: string | string[];
  subject: string;
  templateName: string;
  props: Record<string, unknown>;
  headers?: Record<string, string>;
}

declare module "virtual:astro-mailer/templates" {
  export const templates: Record<string, any>;
  export default templates;
}

declare module "virtual:astro-mailer/types" {
  export const EmailRequest: BaseEmailRequest;
}
