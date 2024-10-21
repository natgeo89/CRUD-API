import { STATUS_CODES } from "../constants";
import { getUsers } from "../database/users";
import { NotFoundError } from "../errors";

export async function get(
  userId: string | null
): Promise<{ statusCode: number; data: unknown }> {
  if (userId === null) {
    return { statusCode: STATUS_CODES.OK, data: getUsers() };
  }

  const user = getUsers().find(({ id }) => id === userId);

  if (user) {
    return { statusCode: STATUS_CODES.OK, data: user };
  }

  throw new NotFoundError();
}
