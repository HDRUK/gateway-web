import { useTranslation } from "next-i18next";

const Footer = () => {
    const { t } = useTranslation("components");
    const copyright = String.fromCodePoint(0x00a9);
    const currentYear = new Date().getFullYear();
    return (
        <div style={{ textAlign: "center", width: "100%", padding: "20px" }}>
            {copyright}
            {t("Footer.text", { year: currentYear })}
        </div>
    );
};

export default Footer;
