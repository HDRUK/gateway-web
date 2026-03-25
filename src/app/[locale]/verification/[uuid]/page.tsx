import apis from "@/config/apis";
import { getSessionCookie } from "@/utils/getSessionCookie";
import { logger } from "@/utils/logger";
import metaData, { noFollowRobots } from "@/utils/metadata";
import Verification from "./verification";

export const metadata = metaData(
    {
        title: "Email Verification",
        description: "",
    },
    noFollowRobots
);

interface VerificationPageProps {
    params: Promise<{
        uuid: string;
    }>;
}

export default async function VerificationPage({
    params,
}: VerificationPageProps) {
    const { uuid } = await params;
    const session = await getSessionCookie();

    let hasFailed = false;

    try {
        const res = await fetch(`${apis.secondaryVerification1UrlIP}/${uuid}`);
        if (!res.ok) {
            hasFailed = true;
        }
    } catch (e) {
        hasFailed = true;
        logger.error(e, session, `verify-secondary-email`);
    }

    return <Verification hasFailed={hasFailed} />;
}
