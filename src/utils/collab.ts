// Share tokens are Str::random(64) on the API. Checking the shape before a
// token is put into a request URL stops path/query smuggling.
const COLLAB_TOKEN = /^[A-Za-z0-9]{64}$/;

export const isCollabToken = (token: unknown): token is string =>
    typeof token === "string" && COLLAB_TOKEN.test(token);
