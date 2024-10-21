import { BASE_URL } from "../constants";
import { BadRequestError, NotFoundError } from "../errors";

const URL_REGEX = /^(\/api\/users)(?:\/(.*))?$/;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function parseUrl(url: string): {
  baseUrl: string;
  userId: string | null;
} {
  const matchesUrl = url.match(URL_REGEX);

  if (matchesUrl === null) {
    throw new NotFoundError();
  }

  const [, userInputUrl, userInputId] = matchesUrl;

  if (userInputId) {
    if (!UUID_REGEX.test(userInputId)) {
      throw new BadRequestError();
    }
  }

  if (userInputUrl === BASE_URL) {
    return { baseUrl: BASE_URL, userId: userInputId || null };
  }

  throw new NotFoundError();
}
