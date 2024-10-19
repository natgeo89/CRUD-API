import http from "node:http";
import { REQUEST_METHODS, STATUS_CODES } from "../constants";
import { BadRequestError, NotFoundError } from "../errors";
import { get } from "./get";
import { post } from "./post";
import { parseUrl } from "../utils/parseUrl";

export async function controller(
  request: http.IncomingMessage
): Promise<{ statusCode: number; data: unknown }> {
  try {
    const { userId } = parseUrl(request.url);

    console.log("userId", userId);

    switch (request.method) {
      case REQUEST_METHODS.GET: {
        return await get(userId);
      }

      case REQUEST_METHODS.POST: {
        return await post(request);
      }

      default:
        return {
          statusCode: STATUS_CODES.METHOD_NOT_ALLOWED,
          data: "Method not allowed",
        };
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      return {
        statusCode: STATUS_CODES.NOT_FOUND,
        data: "Not found",
      };
    }

    if (error instanceof BadRequestError) {
      return {
        statusCode: STATUS_CODES.BAD_REQUEST,
        data: "Invalid request data",
      };
    }

    return {
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: "Internal server error. We are already busy to fix it. Thank you for your patience",
    };
  }
}
