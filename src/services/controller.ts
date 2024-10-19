import { REQUEST_METHODS, STATUS_CODES } from "../constants";
import { get } from "./get";
import { post } from "./post";
import http from "node:http";

export async function controller(
  request: http.IncomingMessage
): Promise<{ statusCode: number; data: unknown }> {
  switch (request.method) {
    case REQUEST_METHODS.GET: {
      return get(request);
    }

    case REQUEST_METHODS.POST: {
      return post(request);
    }

    default:
      return Promise.resolve({
        statusCode: STATUS_CODES.METHOD_NOT_ALLOWED,
        data: "Method not allowed",
      });
  }
}
