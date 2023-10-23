/** @jsxImportSource @emotion/react */

import Box from "@/components/Box";
import Label from "@/components/Label";

import Image from "next/image";

import { colors } from "@/config/theme";
import * as styles from "./SocialProviders.styles";

interface SocialProvidersProps {
    label: string;
    name: string;
    getValues: (name: string) => unknown;
}

const SocialProviders = ({ label, getValues, name }: SocialProvidersProps) => {
    const socialProviders = [
        { label: "Google", value: "google", image: "google-logo.png" },
        { label: "LinkedIn", value: "linkedIn", image: "linkedIn-logo.png" },
        { label: "Microsoft", value: "microsoft", image: "microsoft-logo.png" },
    ];
    return (
        <Box sx={{ padding: 0, marginBottom: 2 }}>
            <Label name={name} label={label} sx={{ marginBottom: "4px" }} />
            <Box sx={{ padding: 0, display: "flex", gap: "10px" }}>
                {socialProviders.map(provider => (
                    <Box
                        key={provider.value}
                        sx={{
                            cursor: "pointer",
                            background: "white",
                            opacity:
                                getValues(name) === provider.value ? 1 : 0.5,
                            border: `2px solid ${colors.grey400}`,
                            borderRadius: "4px",
                            display: "flex",
                            gap: "12px",
                            padding:
                                getValues(name) === provider.value
                                    ? "6px 32px 6px 14px"
                                    : "6px 14px",
                            fontSize: "14px",
                            position: "relative",
                        }}>
                        <Image
                            src={`/images/logos/${provider.image}`}
                            alt={provider.label}
                            width="20"
                            height="20"
                        />
                        {getValues(name) === provider.value && (
                            <span css={styles.dot} />
                        )}
                        <div>Sign in with {provider.label}</div>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default SocialProviders;
