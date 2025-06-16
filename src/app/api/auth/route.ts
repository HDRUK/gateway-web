import { NextRequest, NextResponse } from 'next/server';
import apis from '@/config/apis';
import config from '@/config/config';
import { sessionHeader, sessionPrefix } from '@/config/session';
import { getUserFromToken } from '@/utils/cookies';
import { getSessionCookie } from '@/utils/getSessionCookie';

export async function GET(req: NextRequest) {
    try {
        const jwtToken = req.cookies.get(config.JWT_COOKIE)?.value;

        const authUser = getUserFromToken(jwtToken || '');

        if (!authUser) {
            return NextResponse.json({ data: { isLoggedIn: false } }, { status: 200 });
        }

        const session = await getSessionCookie();

        if (!session) {
            return NextResponse.json({ error: "no session" }, { status: 401 });
        }
        
        try {
            const response = await fetch(
                `${apis.usersV1UrlIP}/${authUser?.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        [sessionHeader]: sessionPrefix + session,
                    },
                }
            );

            const json = await response.json();

            return NextResponse.json({
                data: { isLoggedIn: true, user: json.data },
            }, { status: 200 });

        } catch (error) {
            throw new Error("We have been unable to log you in");
        }
    } catch (error) {
        const err = error as {
            response?: {
                status: number;
                data?: { message: string };
            };
            stack?: unknown;
            message: string;
        };

        if (err?.response) {
            return NextResponse.json({
                title: "We have not been able to fetch your profile",
                message: err.response.data?.message,
            }, { status: err.response.status });
        }

        return NextResponse.json({
            title: "We have not been able to fetch your profile",
            message: err.message,
            stack: err.stack,
        }, { status: 500 });
    }
}
