import { STATUS_CODES } from "../constants";
import { deleteUser, getUsers } from "../database/users";
import { BadRequestError, NotFoundError } from "../errors";

export async function deleteMethod(
  userId: string | null
): Promise<{ statusCode: number; data: unknown }> {
  if (userId === null) {
    throw new BadRequestError();
  }

  const user = getUsers().find(({ id }) => id === userId);

  if (!user) {
    throw new NotFoundError();
  }

  deleteUser(user.id);
  
  return { statusCode: STATUS_CODES.DELETED, data: 'User deleted' };
}
