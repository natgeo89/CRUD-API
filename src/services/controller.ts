import { REQUEST_METHODS, STATUS_CODES } from "../constants";
import { BadRequestError, NotFoundError } from "../errors";
import { get } from "./get";
import { post } from "./post";
import http from "node:http";

export async function controller(
  request: http.IncomingMessage
): Promise<{ statusCode: number; data: unknown }> {
  try {
    switch (request.method) {
      case REQUEST_METHODS.GET: {
        return await get(request);
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
        data: "Invalid request body data",
      };
    }

    return {
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      data: "Internal server error. We are already busy to fix it. Thank you for your patience",
    };
  }
}
