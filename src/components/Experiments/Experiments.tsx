"use client";

import { useState } from "react";
import { Answers, Experiment, ExperimentsLocaleText } from "@hdruk/experiments";
import { ExperimentPrompt } from "@hdruk/experiments/client";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { getPreferredEmail } from "@/utils/user";

const quiet = { successNotificationsOn: false, errorNotificationsOn: false };

const Experiments = () => {
    const t = useTranslations("modules.experimentBuilder");
    const pathname = usePathname();
    const { isLoggedIn, isLoading, user } = useAuth();
    const [experimentId, setExperimentId] = useState<Experiment["id"]>();
    const me = isLoggedIn ? "/me" : "";

    const { data: experiments } = useGet<Experiment[]>(
        `${apis.experimentsV1Url}/active${me}`,
        { shouldFetch: !isLoading, errorNotificationsOn: false }
    );

    const createResponse = usePost<{
        answers: Answers;
        path: string;
        variant?: string | null;
        contact: boolean;
        email?: string;
    }>(`${apis.experimentsV1Url}/${experimentId}/responses${me}`, quiet);

    if (!experiments || !experiments.length) {
        return null;
    }

    return (
        <ExperimentPrompt
            experiments={experiments}
            pathname={pathname}
            onOpen={experiment => setExperimentId(experiment.id)}
            onSubmit={async (_, answers, { path, variant, contactEmail }) => {
                const payload = {
                    answers,
                    path,
                    variant,
                    contact: !!contactEmail,
                    ...(contactEmail && !isLoggedIn && { email: contactEmail }),
                };
                const sent = await createResponse(payload);
                if (!sent) {
                    throw new Error("Response not saved");
                }
            }}
            allowContact
            contactEmail={user ? getPreferredEmail(user) : null}
            localeText={t.raw("prompt") as Partial<ExperimentsLocaleText>}
        />
    );
};

export default Experiments;
