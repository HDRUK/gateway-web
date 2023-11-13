// cookieMiddleware.ts
import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export function cookieMiddleware(
    handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        // Get the cookie from the request headers
        const cookies = cookie.parse(req.headers.cookie || "");

        // Attach the cookie to the request object
        req.cookies = cookies;

        // Wait for the handler execution
        await handler(req, res);
    };
}
