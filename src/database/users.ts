import { User } from "../types/User.type";

const DB_USERS: User[] = [];

export function getUsers(): typeof DB_USERS {
  return DB_USERS;
}

export function addUser(newUser: User): void {
  DB_USERS.push(newUser);
}
