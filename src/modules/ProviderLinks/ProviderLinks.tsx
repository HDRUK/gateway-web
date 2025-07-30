import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Box from "@/components/Box";
import Button from "@/components/Button";
import apis from "@/config/apis";
import { colors } from "@/config/theme";

interface LinkItem {
    label: string;
    href?: string;
    image: string;
}

interface ProviderLinksProps {
    showInstitution: () => void;
    redirectPath?: string;
}

const ProviderLinks = ({
    showInstitution,
    redirectPath,
}: ProviderLinksProps) => {
    const t = useTranslations("modules");
    const { push } = useRouter();

    let effectiveRedirectPath = "";

    if (redirectPath) {
        effectiveRedirectPath = `?redirect=${encodeURIComponent(redirectPath)}`;
    }

    const providerLinks: LinkItem[] = [
        {
            label: t("dialogs.ProvidersDialog.socialProviders.google"),
            href: `${apis.authGoogleV1Url}${effectiveRedirectPath}`,
            image: "google-logo.png",
        },
        {
            label: t("dialogs.ProvidersDialog.socialProviders.openAthens"),
            image: "openathens-logo.png",
        },
        {
            label: t("dialogs.ProvidersDialog.socialProviders.linkedIn"),
            image: "linkedIn-logo.png",
            href: `${apis.authLinkedinV1Url}${effectiveRedirectPath}`,
        },
        {
            label: t("dialogs.ProvidersDialog.socialProviders.azure"),
            href: `${apis.authAzureV1Url}${effectiveRedirectPath}`,
            image: "microsoft-logo.png",
        },
    ];
    return (
        <Box
            sx={{
                padding: 0,
                display: "grid",
                columnGap: 3,
                rowGap: 2,
                gridTemplateColumns: {
                    mobile: "repeat(1, 1fr)",
                    tablet: "repeat(2, 1fr)",
                },
                marginTop: 3,
                marginBottom: 3,
            }}>
            {providerLinks.map(link => {
                return (
                    <Button
                        key={link.image}
                        onClick={() =>
                            link.href ? push(link.href) : showInstitution()
                        }
                        sx={{
                            p: 0,
                            color: colors.grey700,
                            display: "block",
                            lineHeight: "inherit",
                            fontWeight: "inherit",
                        }}
                        variant="text">
                        <Box
                            component="span"
                            sx={{
                                border: `solid 1px ${colors.grey400}`,
                                borderRadius: 1,
                                padding: 1,
                                display: "flex",
                                gap: 2,
                            }}>
                            <Image
                                src={`/images/logos/${link.image}`}
                                alt={link.label}
                                width="20"
                                height="20"
                            />
                            Sign in with {link.label}
                        </Box>
                    </Button>
                );
            })}
        </Box>
    );
};

export default ProviderLinks;
