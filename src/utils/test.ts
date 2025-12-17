import apis from "@/config/apis";
import { sessionHeader, sessionPrefix } from "@/config/session";
import { CACHE_DAR_APPLICATION } from "@/consts/cache";
import {
    DarApplicationStatus,
    DarApplicationApprovalStatus,
} from "@/consts/dataAccess";
import { revalidateCache } from "./revalidateCache";

type EnsureKind = "user" | "team";

type EnsureArgs =
    | { kind: "user"; userId: string; applicationId: string }
    | { kind: "team"; teamId: string; applicationId: string };

export async function ensureDarApplicationStatus(
    args: EnsureArgs,
    auth: { jwtToken: string; session: string }
) {
    const { jwtToken, session } = auth;

    console.log("HERE IN UTIL", jwtToken, session);

    const baseUrl =
        args.kind === "user"
            ? `${apis.usersV1UrlIP}/${args.userId}/dar/applications/${args.applicationId}`
            : `${apis.teamsV1UrlIP}/${args.teamId}/dar/applications/${args.applicationId}`;

    const headers = {
        Authorization: `Bearer ${jwtToken}`,
        [sessionHeader]: sessionPrefix + session,
    } as const;

    // 1) Always read fresh
    const current = await fetch(baseUrl, { cache: "no-store", headers }).then(
        r => r.json()
    );
    const data = current?.data;

    if (!data) return null;

    // 2) Decide update rules per kind
    const shouldUpdate =
        args.kind === "team"
            ? !data.approval_status
            : !data.approval_status &&
              data.submission_status === DarApplicationStatus.SUBMITTED;

    if (!shouldUpdate) return data;

    // 3) Patch (per kind)
    const patchBody =
        args.kind === "team"
            ? { approval_status: DarApplicationApprovalStatus.FEEDBACK }
            : { submission_status: DarApplicationStatus.DRAFT };

    await fetch(baseUrl, {
        method: "PATCH",
        headers: {
            ...headers,
            "content-type": "application/json",
        },
        body: JSON.stringify(patchBody),
    });

    // 4) Invalidate tag for other cached readers
    revalidateCache(`${CACHE_DAR_APPLICATION}${args.applicationId}`);

    // 5) Read again fresh and return
    const updated = await fetch(baseUrl, { cache: "no-store", headers }).then(
        r => r.json()
    );
    return updated?.data ?? null;
}
