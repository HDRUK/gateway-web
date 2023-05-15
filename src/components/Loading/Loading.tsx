import { useTranslation } from "next-i18next";

const Loading = () => {
    const { t } = useTranslation("components");

    return <div>{t("Loading.text")}</div>;
};

export default Loading;
