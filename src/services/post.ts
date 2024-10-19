import { BASE_URL, STATUS_CODES } from "../constants";
import http from "node:http";
import crypto from "node:crypto";
import { getRequestBody } from "../utils/getRequestBody";
import { validateBody } from "../utils/validateBody";
import { User } from "../types/User.type";
import { addUser } from "../database/users";
import { BadRequestError, NotFoundError } from "../errors";

export async function post(
  request: http.IncomingMessage
): Promise<{ statusCode: number; data: User | string }> {
  if (request.url !== BASE_URL) {
    throw new NotFoundError();
  }

  const parsedBody = await getRequestBody(request);

  const validatedBody = validateBody(parsedBody);

  if (parsedBody === null || validatedBody === null) {
    throw new BadRequestError();
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    ...validatedBody,
  };

  addUser(newUser);

  return {
    statusCode: STATUS_CODES.CREATED,
    data: newUser,
  };
}
