import { ValidUserWithoutId } from "../types/User.type";

const requiredFields = ["username", "age", "hobbies"] as const;

export function validateBody(body: {
  [propName: string]: unknown;
}): ValidUserWithoutId | null {
  try {
    const isValidBody = requiredFields.every((field) => {
      const fieldValue = body[field] || null;

      if (fieldValue === null) {
        return false;
      }

      switch (field) {
        case "age": {
          return typeof fieldValue === "number";
        }
        case "username": {
          return typeof fieldValue === "string";
        }
        case "hobbies": {
          const isArray = Array.isArray(fieldValue);
          if (!isArray) return false;

          const isEveryItemString = fieldValue.every(
            (item) => typeof item === "string"
          );

          return isEveryItemString;
        }
      }
    });

    if (!isValidBody) return null;

    const validBody: ValidUserWithoutId = requiredFields.reduce(
      (accum, field) => ({ ...accum, [field]: body[field] }),
      {} as ValidUserWithoutId
    );

    return validBody;
  } catch {
    return null;
  }
}
