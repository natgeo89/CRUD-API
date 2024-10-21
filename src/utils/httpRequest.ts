import http from "node:http";
import { User } from "../types/User.type";

export function BDRequest(data: string): Promise<User[] | null> {
  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        hostname: "localhost",
        port: 1000,
        path: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (response) => {
        const chunks: string[] = [];
        response.setEncoding("utf-8");

        response.on("data", (chunk) => {
          chunks.push(chunk);
        });

        response.on("end", () => {
          resolve(chunks.length === 0 ? null : JSON.parse(chunks.join("")) || null);
        });

        response.on("error", () => {
          reject(null);
        });

      }
    );

    request.write(data);
    request.end();
  });
}
