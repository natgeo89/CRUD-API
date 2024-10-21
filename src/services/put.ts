import http from "node:http";
import { STATUS_CODES } from "../constants";
import { BadRequestError, NotFoundError } from "../errors";
import { User } from "../types/User.type";
import { getRequestBody } from "../utils/getRequestBody";
import { validateBody } from "../utils/validateBody";
import { getUsers, updateUser } from "../database/users";

export async function put(
  userId: string | null,
  request: http.IncomingMessage
): Promise<{ statusCode: number; data: unknown }> {
  if (userId === null) {
    throw new BadRequestError();
  }

  const parsedBody = await getRequestBody(request);

  const validatedBody = validateBody(parsedBody);

  if (parsedBody === null || validatedBody === null) {
    throw new BadRequestError();
  }

  const user = getUsers().find(({ id }) => id === userId);

  if (!user) {
    throw new NotFoundError();
  }

  const updatedUser: User = {
    id: user.id,
    ...validatedBody,
  };

  updateUser(updatedUser);


  return {
    statusCode: STATUS_CODES.OK,
    data: updatedUser,
  }
}
