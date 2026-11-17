"use client";

import { useState } from "react";
import { Answers, Experiment, ExperimentsLocaleText } from "@hdruk/experiments";
import { ExperimentPrompt } from "@hdruk/experiments/client";
import GlobalStyles from "@mui/material/GlobalStyles";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { getRecaptchaToken, loadRecaptcha } from "@/utils/recaptcha";
import { getPreferredEmail } from "@/utils/user";
import { useFeatures } from "@/providers/FeatureProvider";
import { recaptchaBadgeOpen } from "./Experiments.styles";

const quiet = { successNotificationsOn: false, errorNotificationsOn: false };
const RECAPTCHA_ACTION = "experiment_response";

const Experiments = () => {
    const t = useTranslations("modules.experimentBuilder");
    const pathname = usePathname();
    const { isLoggedIn, isLoading, user } = useAuth();
    const { isExperimentsEnabled } = useFeatures();
    const [experimentId, setExperimentId] = useState<Experiment["id"]>();
    const [promptOpen, setPromptOpen] = useState(false);
    const me = isLoggedIn ? "/me" : "";
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    const { data: experiments } = useGet<Experiment[]>(
        `${apis.experimentsV1Url}/active${me}`,
        {
            shouldFetch: isExperimentsEnabled && !isLoading,
            errorNotificationsOn: false,
        }
    );

    const createResponse = usePost<{
        answers: Answers;
        path: string;
        variant?: string | null;
        contact: boolean;
        email?: string;
        recaptcha: string;
    }>(`${apis.experimentsV1Url}/${experimentId}/responses${me}`, quiet);

    if (!isExperimentsEnabled || !experiments || !experiments.length) {
        return null;
    }

    return (
        <>
            {promptOpen && <GlobalStyles styles={recaptchaBadgeOpen} />}
            <ExperimentPrompt
                experiments={experiments}
                pathname={pathname}
                onOpen={experiment => {
                    setExperimentId(experiment.id);
                    setPromptOpen(true);
                    if (recaptchaSiteKey) {
                        loadRecaptcha(recaptchaSiteKey);
                    }
                }}
                onSubmit={async (
                    _,
                    answers,
                    { path, variant, contactEmail }
                ) => {
                    const payload = {
                        answers,
                        path,
                        variant,
                        contact: !!contactEmail,
                        ...(contactEmail &&
                            !isLoggedIn && { email: contactEmail }),
                    };
                    if (!recaptchaSiteKey) {
                        throw new Error("reCAPTCHA is not configured");
                    }
                    const sent = await createResponse({
                        ...payload,
                        recaptcha: await getRecaptchaToken(
                            recaptchaSiteKey,
                            RECAPTCHA_ACTION
                        ),
                    });
                    if (!sent) {
                        throw new Error("Response not saved");
                    }
                }}
                onClose={() => setPromptOpen(false)}
                allowContact
                contactEmail={user ? getPreferredEmail(user) : null}
                localeText={t.raw("prompt") as Partial<ExperimentsLocaleText>}
            />
        </>
    );
};

export default Experiments;
