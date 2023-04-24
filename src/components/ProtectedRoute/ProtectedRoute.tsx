import { useTranslation } from "next-i18next";

const ProtectedRoute = () => {
    const { t } = useTranslation("components");

    return (
        <div style={{ border: "2px solid #ff3030", padding: "40px" }}>
            <h1>{t("ProtectedRoute.title")}</h1>
            <p>{t("ProtectedRoute.text")}</p>
        </div>
    );
};

export default ProtectedRoute;
