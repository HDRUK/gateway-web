/** @jsxImportSource @emotion/react */

"use client";

import ActiveList from "@/components/ActiveList";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import HTMLContent from "@/components/HTMLContent";
import InputWrapper from "@/components/InputWrapper";
import ModalButtons from "@/components/ModalButtons";
import ScrollContent from "@/components/ScrollContent";
import { inputComponents } from "@/config/forms";
import { colors } from "@/config/theme";
import useDialog from "@/hooks/useDialog";
import useModal from "@/hooks/useModal";
import { Typography } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const TRANSLATION_PATH_MODAL = "modals.CohortRequestSent";
const TRANSLATION_PATH_DIALOG = "dialogs.CohortRequestTerms";

const CohortRequestSentDialog = () => {
    const { push } = useRouter();
    const { control } = useForm();

    const { hideDialog } = useDialog();
    const { showModal } = useModal();

    const t = useTranslations("modules");

    const handleSuccess = () => {
        hideDialog();
        showModal({
            title: t(`${TRANSLATION_PATH_MODAL}.title`),
            text: t(`${TRANSLATION_PATH_MODAL}.text`),
            confirmButton: t(`${TRANSLATION_PATH_MODAL}.confirmButton`),
        });
    };

    const mockTerms = [
        {
            label: "Application of these terms",
            content:
                '\n<h2 class="wp-block-heading has-large-font-size">Who we are and how to contact us</h2>\n\n\n\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<h2 class="wp-block-heading has-large-font-size">Acceptance of Terms and Conditions</h2>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
        },
        {
            label: "Agreeing to the terms of use",
            content:
                '\n<h2 class="wp-block-heading has-large-font-size">Who we are and how to contact us</h2>\n\n\n\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<h2 class="wp-block-heading has-large-font-size">Acceptance of Terms and Conditions</h2>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
        },
        {
            label: "Changes to these additional terms",
            content:
                '\n<h2 class="wp-block-heading has-large-font-size">Who we are and how to contact us</h2>\n\n\n\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<h2 class="wp-block-heading has-large-font-size">Acceptance of Terms and Conditions</h2>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
        },
        {
            label: "Scope of us",
            content:
                '\n<h2 class="wp-block-heading has-large-font-size">Who we are and how to contact us</h2>\n\n\n\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<h2 class="wp-block-heading has-large-font-size">Acceptance of Terms and Conditions</h2>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
        },
        {
            label: "Application of these terms",
            content:
                '\n<h2 class="wp-block-heading has-large-font-size">Who we are and how to contact us</h2>\n\n\n\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<h2 class="wp-block-heading has-large-font-size">Acceptance of Terms and Conditions</h2>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
        },
        {
            label: "Agreeing to the terms of use",
            content:
                '\n<h2 class="wp-block-heading has-large-font-size">Who we are and how to contact us</h2>\n\n\n\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<h2 class="wp-block-heading has-large-font-size">Acceptance of Terms and Conditions</h2>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
        },
        {
            label: "Changes to these additional terms",
            content:
                '\n<h2 class="wp-block-heading has-large-font-size">Who we are and how to contact us</h2>\n\n\n\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<h2 class="wp-block-heading has-large-font-size">Acceptance of Terms and Conditions</h2>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
        },
        {
            label: "Scope of us",
            content:
                '\n<h2 class="wp-block-heading has-large-font-size">Who we are and how to contact us</h2>\n\n\n\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<h2 class="wp-block-heading has-large-font-size">Acceptance of Terms and Conditions</h2>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
        },
    ];

    return (
        <Dialog title="" maxWidth="laptop">
            <Box sx={{ p: 0 }} component="form">
                <MuiDialogContent>
                    <Box sx={{ display: "flex", p: 0 }}>
                        <Box
                            sx={{
                                width: 240,
                                pl: 0,
                                borderRight: `1px solid ${colors.grey300}`,
                            }}>
                            <ActiveList activeItem={1} items={mockTerms} />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Box
                                sx={{
                                    p: 0,
                                    mb: 3,
                                    borderBottom: `1px solid ${colors.grey300}`,
                                }}>
                                <Typography
                                    variant="h2"
                                    sx={{ mb: 2, fontSize: 24 }}>
                                    {t(`${TRANSLATION_PATH_DIALOG}.title`)}
                                </Typography>
                                <Typography color="GrayText" sx={{ mb: 2 }}>
                                    {t(`${TRANSLATION_PATH_DIALOG}.text`)}
                                </Typography>
                            </Box>
                            <ScrollContent>
                                {mockTerms.map(term => (
                                    <>
                                        <Typography>{term.label}</Typography>
                                        <HTMLContent content={term.content} />
                                    </>
                                ))}
                            </ScrollContent>
                        </Box>
                    </Box>
                </MuiDialogContent>
                <MuiDialogActions
                    sx={{ borderTop: `1px solid ${colors.grey300}` }}>
                    <InputWrapper
                        label={t(`${TRANSLATION_PATH_DIALOG}.acceptTerms`)}
                        name="hasAccepted"
                        component={inputComponents.Checkbox}
                        required
                        control={control}
                    />
                    <ModalButtons
                        confirmText={t(
                            `${TRANSLATION_PATH_DIALOG}.confirmButton`
                        )}
                        cancelText={t(
                            `${TRANSLATION_PATH_DIALOG}.discardButton`
                        )}
                        onSuccess={handleSuccess}
                    />
                </MuiDialogActions>
            </Box>
        </Dialog>
    );
};

export default CohortRequestSentDialog;
