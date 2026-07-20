import { SvgIconComponent } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Box from "@/components/Box";
import Button from "@/components/Button";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import { InstituteIcon } from "@/consts/customIcons";

interface LinkItem {
    label: string;
    href?: string;
    image?: string;
    Icon?: SvgIconComponent;
}

interface ProviderGroup {
    key: string;
    title: React.ReactNode;
    description: React.ReactNode;
    links: LinkItem[];
}

interface ProviderLinksProps {
    showInstitution: () => void;
    redirectPath?: string;
}

const highlight = (chunks: React.ReactNode) => (
    <Box component="span" sx={{ color: colors.red700, p: 0 }}>
        {chunks}
    </Box>
);

const bold = (chunks: React.ReactNode) => (
    <Box component="span" sx={{ fontWeight: 600, p: 0 }}>
        {chunks}
    </Box>
);

const ProviderLinks = ({
    showInstitution,
    redirectPath,
}: ProviderLinksProps) => {
    const t = useTranslations("modules.dialogs.ProvidersDialog");
    const { push } = useRouter();

    let effectiveRedirectPath = "";

    if (redirectPath) {
        effectiveRedirectPath = `?redirect=${encodeURIComponent(redirectPath)}`;
    }

    const providerGroups: ProviderGroup[] = [
        {
            key: "preferred",
            title: t.rich("preferredAccessTitle", { bold }),
            description: t("preferredAccessText"),
            links: [
                {
                    label: t("socialProviders.openAthens"),
                    Icon: InstituteIcon,
                },
                {
                    label: t("socialProviders.azure"),
                    href: `${apis.authAzureV1Url}${effectiveRedirectPath}`,
                    image: "microsoft-logo.png",
                },
            ],
        },
        {
            key: "notPreferred",
            title: t.rich("notPreferredAccessTitle", { bold }),
            description: t.rich("notPreferredAccessText", { highlight }),
            links: [
                {
                    label: t("socialProviders.google"),
                    href: `${apis.authGoogleV1Url}${effectiveRedirectPath}`,
                    image: "google-logo.png",
                },
                {
                    label: t("socialProviders.linkedIn"),
                    href: `${apis.authLinkedinV1Url}${effectiveRedirectPath}`,
                    image: "linkedIn-logo.png",
                },
            ],
        },
    ];

    return (
        <Box sx={{ padding: 0 }}>
            {providerGroups.map(group => (
                <Box
                    key={group.key}
                    sx={{ padding: 0, marginTop: 3, marginBottom: 3 }}>
                    <Typography variant="h4" sx={{ marginBottom: 1 }}>
                        {group.title}
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: 2 }}>
                        {group.description}
                    </Typography>
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
                        }}>
                        {group.links.map(link => (
                            <Button
                                key={link.label}
                                onClick={() =>
                                    link.href
                                        ? push(link.href)
                                        : showInstitution()
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
                                        alignItems: "center",
                                        gap: 2,
                                    }}>
                                    {link.Icon ? (
                                        <link.Icon
                                            fontSize="small"
                                            titleAccess={link.label}
                                            sx={{ color: colors.teal700 }}
                                        />
                                    ) : (
                                        <Image
                                            src={`/images/logos/${link.image}`}
                                            alt={link.label}
                                            width="20"
                                            height="20"
                                        />
                                    )}
                                    Sign in with {link.label}
                                </Box>
                            </Button>
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default ProviderLinks;
