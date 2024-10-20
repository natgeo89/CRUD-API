import { User } from "../types/User.type";

const DB_USERS: User[] = [];

export function getUsers(): typeof DB_USERS {
  return DB_USERS;
}

export function addUser(newUser: User): void {
  DB_USERS.push(newUser);
}

export function updateUser(updatedUser: User): void {
  const indexOfUpdatedUser = DB_USERS.findIndex(
    ({ id }) => updatedUser.id === id
  );

  DB_USERS[indexOfUpdatedUser] = updatedUser;
}
