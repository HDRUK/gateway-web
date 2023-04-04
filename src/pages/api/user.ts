// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from "@/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";

// Temporary API whilst BE is in development
export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<User>
) {
	res.status(200).json({ firstname: "Naomi", lastname: "Howe" });
}
