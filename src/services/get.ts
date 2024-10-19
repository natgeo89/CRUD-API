import { STATUS_CODES } from "../constants";
import { getUsers } from "../database/users";
import http from "node:http";

export async function get(
  request: http.IncomingMessage
): Promise<{ statusCode: number; data: unknown }> {
  console.log("url", request.url);

  return { statusCode: STATUS_CODES.OK, data: getUsers() };
}
