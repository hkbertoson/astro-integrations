import { parse as parseHTML } from "node-html-parser";
import juice from "juice";

interface TransformOptions {
  width?: number;
  backgroundColor?: string;
  inlineCss?: boolean;
  preserveInlineStyles?: boolean;
  centerTable?: boolean;
  cellPadding?: string;
}

export async function transformToEmail(
  html: string,
  options: TransformOptions = {}
): Promise<string> {
  const {
    width = 600,
    backgroundColor = "#f6f9fc",
    inlineCss = true,
    preserveInlineStyles = true,
    centerTable = true,
    cellPadding = "0",
  } = options;

  let processedHtml = html;

  // If the HTML already has inline styles and we want to preserve them
  if (preserveInlineStyles) {
    // Store existing inline styles
    const root = parseHTML(html);
    const inlineStyleMap = new Map<string, string>();

    root.querySelectorAll("[style]").forEach((el) => {
      const id = Math.random().toString(36).substring(7);
      inlineStyleMap.set(id, el.getAttribute("style") || "");
      el.setAttribute("data-style-id", id);
    });

    // Run juice only on elements without inline styles
    if (inlineCss) {
      processedHtml = juice(html);
    }

    // Restore preserved inline styles
    const processed = parseHTML(processedHtml);
    processed.querySelectorAll("[data-style-id]").forEach((el) => {
      const id = el.getAttribute("data-style-id");
      const originalStyle = inlineStyleMap.get(id || "");
      if (originalStyle) {
        el.setAttribute("style", originalStyle);
        el.removeAttribute("data-style-id");
      }
    });

    processedHtml = processed.toString();
  } else if (inlineCss) {
    // If not preserving inline styles, just run juice normally
    processedHtml = juice(processedHtml);
  }

  // Convert to table-based layout only if processedHtml does not contain a top-level table
  const processedRoot = parseHTML(processedHtml);
  if (!processedRoot.querySelector("table")) {
    processedHtml = convertToTableLayout(processedHtml);
  }

  // Wrap in email boilerplate
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${backgroundColor};">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="${
            centerTable ? "center" : "left"
          }" style="padding: ${cellPadding};">
            <table border="0" cellpadding="0" cellspacing="0" width="${width}" style="background-color: #ffffff; border-radius: 8px;">
              <tr>
                <td style="padding: 40px 30px;">
                  ${processedHtml}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function convertToTableLayout(html: string): string {
  const root = parseHTML(html);

  // Convert divs to tables while preserving styles, but skip existing tables
  root.querySelectorAll("div").forEach((div) => {
    // Check if the div is already inside a table
    if (div.closest("table")) {
      return; // Skip this div if it's already inside a table
    }

    // Preserve all attributes
    const attributes = div.attributes;
    const style = attributes.style || "";
    const className = attributes.class || "";

    // Create table structure
    const table = parseHTML(`
      <table border="0" cellpadding="0" cellspacing="0" width="100%" ${
        className ? `class="${className}"` : ""
      } ${style ? `style="${style}"` : ""}>
        <tr>
          <td>
            ${div.innerHTML}
          </td>
        </tr>
      </table>
    `);

    div.replaceWith(table);
  });

  return root.toString();
}

// TODO: Implement this function to handle flex layouts

// function handleFlexLayouts(root: any) {
//   // Find elements with display: flex
//   root
//     .querySelectorAll('[style*="display: flex"]')
//     .forEach(
//       (flex: {
//         childNodes: any[];
//         replaceWith: (arg0: HTMLElement) => void;
//       }) => {
//         const cells = flex.childNodes
//           .filter((node: { nodeType: number }) => node.nodeType === 1) // Only element nodes
//           .map(
//             (child: { toString: () => any }) => `
//         <td style="vertical-align: top;">
//           ${child.toString()}
//         </td>
//       `
//           )
//           .join("");

//         const table = parseHTML(`
//       <table border="0" cellpadding="0" cellspacing="0" width="100%">
//         <tr>
//           ${cells}
//         </tr>
//       </table>
//     `);

//         flex.replaceWith(table);
//       }
//     );
// }

// TODO: Function to Grid Layout
