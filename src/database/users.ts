import { User } from "../types/User.type";
import { BDRequest } from "../utils/httpRequest";

const isMulti = process.env.IS_MULTI === "true";

const DB_USERS: User[] = [];

export async function getUsers(): Promise<typeof DB_USERS> {
  if (!isMulti) {
    return DB_USERS;
  }

  const data = JSON.stringify({ action: "getUsers" });
  const users = await BDRequest(data);

  return users;
}

export async function addUser(newUser: User): Promise<User[] | null> {
  if (!isMulti) {
    DB_USERS.push(newUser);
    return null;
  }

  const data = JSON.stringify({ action: "addUser", data: newUser });
  await BDRequest(data);
}

export async function updateUser(updatedUser: User): Promise<User[] | null> {
  if (!isMulti) {
    const indexOfUpdatedUser = DB_USERS.findIndex(
      ({ id }) => updatedUser.id === id
    );

    DB_USERS[indexOfUpdatedUser] = updatedUser;

    return null;
  }

  const data = JSON.stringify({ action: "updateUser", data: updatedUser });
  await BDRequest(data);
}

export async function deleteUser(userId: User["id"]): Promise<User[] | null> {
  if (!isMulti) {
    const restUsers = DB_USERS.filter(({ id }) => userId !== id);

    DB_USERS.length = 0;

    DB_USERS.push(...restUsers);

    return null;
  }

  const data = JSON.stringify({ action: "deleteUser", data: userId });
  await BDRequest(data);
}

export function clearDB(): void {
  if (!isMulti) {
    DB_USERS.length = 0;
  }
}
