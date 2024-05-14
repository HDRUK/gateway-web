"use client";

import BackButtonOrig from "@/components/BackButton";
import usePatch from "@/hooks/usePatch";
import apis from "@/config/apis";

const BackButton = ({ questionId }: { questionId: string }) => {
    const unlockQuestion = usePatch(`${apis.questionBankV1Url}/questions`, {
        subPath: "unlock",
        successNotificationsOn: false,
    });

    const handleClick = () => {
        unlockQuestion(questionId, {});
    };

    return (
        <BackButtonOrig
            label="Back to Question Bank list page"
            onClick={handleClick}
        />
    );
};

export default BackButton;
