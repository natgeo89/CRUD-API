import http from "node:http";

export function getRequestBody(request: http.IncomingMessage): Promise<{
  [propName: string]: unknown;
} | null> {
  return new Promise((resolve, rejects) => {
    const requestBody: string[] = [];
    request.setEncoding("utf-8");

    request.on("data", (chunk) => {
      requestBody.push(chunk);
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(requestBody.join("")));
      } catch {
        resolve(null);
      }
    });

    request.on("error", () => {
      rejects(null);
    });
  });
}
