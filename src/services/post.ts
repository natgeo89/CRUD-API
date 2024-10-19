import { STATUS_CODES } from "../constants";
import http from "node:http";
import { getRequestBody } from "../utils/getRequestBody";

export async function post(
  request: http.IncomingMessage
): Promise<{ statusCode: number; data: unknown }> {
  const body = await getRequestBody(request);

  if (body === null) {
    return {
      statusCode: STATUS_CODES.BAD_REQUEST,
      data: "Invalid request body data. Recheck JSON format you provided",
    };
  }

  // validate body if has all fields  

  return {
    statusCode: STATUS_CODES.CREATED,
    data: body,
  };
}
