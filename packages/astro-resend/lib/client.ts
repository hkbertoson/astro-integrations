export interface EmailRequest {
  to: string | string[];
  subject: string;
  templateName: string;
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

// Export the types and function
export default sendEmail;
