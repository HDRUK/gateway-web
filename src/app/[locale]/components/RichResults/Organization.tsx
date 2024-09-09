import { useTranslations } from "next-intl";
import Script from "next/script";
import { Organization as Org, WithContext } from "schema-dts";

const Organization = () => {
    const t = useTranslations("common");

    const jsonLd: WithContext<Org> = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: t("companyNameLong"),
        alternateName: t("companyNameShort"),
        description: t("companyDescription"),
        url: "https://healthdatagateway.org/",
        logo: "https://www.hdruk.ac.uk/wp-content/uploads/2019/11/HRD_share_image-380x209.png",
        address: {
            "@type": "PostalAddress",
            addressLocality: t("companyLocality"),
            postalCode: t("companyPostalCode"),
            streetAddress: t("companyStreetAddress"),
        },
        email: "enquires@healthdatagateway.org",
        sameAs: "https://twitter.com/HDR_UK,https://www.linkedin.com/company/healthdataresearchuk",
    };

    return (
        <Script id="org" type="application/ld+json">
            {JSON.stringify(jsonLd)}
        </Script>
    );
};

export default Organization;
