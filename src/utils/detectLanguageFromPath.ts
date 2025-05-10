export const detectLanguageFromPath = (
  path: string
): {
  language: string;
  type: string;
} => {
  if (path.endsWith(".ts")) return { language: "typescript", type: "text" };
  if (path.endsWith(".tsx")) return { language: "typescript", type: "text" };
  if (path.endsWith(".js")) return { language: "javascript", type: "text" };
  if (path.endsWith(".jsx")) return { language: "javascript", type: "text" };
  if (path.endsWith(".json")) return { language: "json", type: "text" };
  if (path.endsWith(".css")) return { language: "css", type: "text" };
  if (path.endsWith(".html")) return { language: "html", type: "text" };
  if (path.endsWith(".py")) return { language: "python", type: "text" };
  if (path.endsWith(".txt")) return { language: "plaintext", type: "text" };
  if (path.endsWith(".png")) return { language: "binary", type: "image" };
  if (path.endsWith(".jpg")) return { language: "binary", type: "image" };
  if (path.endsWith(".jpeg")) return { language: "binary", type: "image" };
  if (path.endsWith(".gif")) return { language: "binary", type: "image" };
  return { language: "plaintext", type: "text" };
};
