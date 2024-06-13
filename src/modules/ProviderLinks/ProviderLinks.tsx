import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Box from "@/components/Box";
import Link from "@/components/Link";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";

interface LinkItem {
    label: string;
    href: string;
    image: string;
}

const ProviderLinks = () => {
    const t = useTranslations("modules");
    const pathname = usePathname();

    let redirectPath = "";

    if (
        pathname?.includes(`/${RouteName.ABOUT}/${RouteName.COHORT_DISCOVERY}`)
    ) {
        redirectPath = `?redirect=/${RouteName.ABOUT}/${RouteName.COHORT_DISCOVERY_REQUEST}`;
    }

    const providerLinks: LinkItem[] = [
        {
            label: t("dialogs.ProvidersDialog.socialProviders.google"),
            href: `${apis.authGoogleV1Url}${redirectPath}`,
            image: "google-logo.png",
        },
        {
            label: t("dialogs.ProvidersDialog.socialProviders.linkedIn"),
            href: `${apis.authLinkedinV1Url}${redirectPath}`,
            image: "linkedIn-logo.png",
        },
        {
            label: t("dialogs.ProvidersDialog.socialProviders.azure"),
            href: `${apis.authAzureV1Url}${redirectPath}`,
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
            {providerLinks.map(link => (
                <Link
                    href={link.href}
                    key={link.image}
                    prefetch={false}
                    underline="none"
                    sx={{ color: colors.grey700 }}>
                    <Box
                        sx={{
                            border: `solid 1px ${colors.grey400}`,
                            borderRadius: "4px",
                            padding: "7px",
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
                </Link>
            ))}
        </Box>
    );
};

export default ProviderLinks;
