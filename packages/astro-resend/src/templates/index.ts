// This will be populated by the integration setup
export const templates: Record<string, any> = {};

// Function to register templates
export function registerTemplate(name: string, template: any) {
  templates[name] = template;
}

// Function to get a template
export function getTemplate(name: string): any | undefined {
  return templates[name];
}
