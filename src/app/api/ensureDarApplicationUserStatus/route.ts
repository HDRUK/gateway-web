import { NextRequest, NextResponse } from "next/server";
import config from "@/config/config";
import { getSessionCookie } from "@/utils/getSessionCookie";
import { ensureDarApplicationStatus } from "@/utils/test";

export async function POST(request: NextRequest) {
    const session = await getSessionCookie();
    const jwtToken = request.cookies.get(config.JWT_COOKIE)?.value;

    if (!jwtToken) return NextResponse.json({ status: 401 });

    const { applicationId, userId } = await request.json();

    const data = await ensureDarApplicationStatus(
        { kind: "user", applicationId, userId },
        { jwtToken, session }
    );

    return NextResponse.json(data);
}
