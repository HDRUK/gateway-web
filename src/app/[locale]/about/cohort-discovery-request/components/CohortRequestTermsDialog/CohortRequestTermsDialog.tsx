"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { InView } from "react-intersection-observer";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { templateRepeatFields } from "@/interfaces/Cms";
import ActiveList from "@/components/ActiveList";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import Form from "@/components/Form";
import HTMLContent from "@/components/HTMLContent";
import InputWrapper from "@/components/InputWrapper";
import ModalButtons from "@/components/ModalButtons";
import ScrollContent from "@/components/ScrollContent";
import useDialog from "@/hooks/useDialog";
import useModal from "@/hooks/useModal";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import {
    cohortAcceptTermsValidationSchema,
    cohortAcceptTermsDefaultValues,
    cohortAcceptTermsField,
} from "@/config/forms/cohortTermsAccept";
import { colors } from "@/config/theme";

const TRANSLATION_PATH_MODAL = "modals.CohortRequestSent";
const TRANSLATION_PATH_DIALOG = "dialogs.CohortRequestTerms";

const CohortRequestTermsDialog = () => {
    const [activeItem, setActiveItem] = useState(1);
    const { push } = useRouter();
    const { control, handleSubmit } = useForm({
        defaultValues: cohortAcceptTermsDefaultValues,
        resolver: yupResolver(cohortAcceptTermsValidationSchema),
    });

    const { hideDialog, store } = useDialog();
    const { dialogProps } = store as unknown as {
        dialogProps: { cmsContent: templateRepeatFields };
    };

    const { showModal } = useModal();

    const t = useTranslations("modules");

    const submitRequest = usePost(apis.cohortRequestsV1Url);

    const handleSuccess = () => {
        hideDialog();
        showModal({
            title: t(`${TRANSLATION_PATH_MODAL}.title`),
            content: t(`${TRANSLATION_PATH_MODAL}.text`),
            confirmText: t(`${TRANSLATION_PATH_MODAL}.confirmButton`),
            onSuccess: () => {
                push("/");
            },
        });
    };

    const mockTerms = [
        {
            label: "Application of these terms",
            content:
                '\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
        },
        {
            label: "Agreeing to the terms of use",
            content:
                '\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<h2 class="wp-block-heading has-large-font-size">Acceptance of Terms and Conditions</h2>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
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
            label: "Application of these terms other",
            content:
                '\n<h2 class="wp-block-heading has-large-font-size">Who we are and how to contact us</h2>\n\n\n\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<h2 class="wp-block-heading has-large-font-size">Acceptance of Terms and Conditions</h2>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
        },
        {
            label: "Agreeing to the terms of use other",
            content:
                '\n<h2 class="wp-block-heading has-large-font-size">Who we are and how to contact us</h2>\n\n\n\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<h2 class="wp-block-heading has-large-font-size">Acceptance of Terms and Conditions</h2>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
        },
        {
            label: "Changes to these additional terms other",
            content:
                '\n<h2 class="wp-block-heading has-large-font-size">Who we are and how to contact us</h2>\n\n\n\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<h2 class="wp-block-heading has-large-font-size">Acceptance of Terms and Conditions</h2>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
        },
        {
            label: "Scope of us other",
            content:
                '\n<h2 class="wp-block-heading has-large-font-size">Who we are and how to contact us</h2>\n\n\n\n<p>This Gateway Portal, including all functionality on the Gateway Portal such as Cohort Discovery (the “<strong>site</strong>“) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company registered in England and Wales under company number 10887014 and a charity registered with the Charity Commission under charity number 1194431 with its registered office is at 215 Euston Road, London, England, NW1 2BE.</p>\n\n\n\n<p>To contact us, please use the contact details on our <a href="https://www.healthdatagateway.org/about/contact-us">support page</a>.</p>\n\n\n\n<p></p>\n\n\n\n<h2 class="wp-block-heading has-large-font-size">Acceptance of Terms and Conditions</h2>\n\n\n\n<p>Access to and use of this site is provided by HDR UK subject to the following:</p>\n\n\n\n<ul>\n<li>By using this site you confirm that you accept these Terms and Conditions (including any Additional Terms that may apply as below) (together, the &#8220;<strong>Terms and Conditions</strong>&#8220;) and that you agree to comply with them. The Terms and Conditions take effect on the date of your first use of the site.</li>\n\n\n\n<li>If you do not agree to the Terms and Conditions, you must not use our site.</li>\n</ul>\n\n\n\n<p></p>\n',
        },
    ];

    const onFormSubmit = async () => {
        await submitRequest({ details: "mock text " });
        handleSuccess();
    };

    const handleScroll = (id: number) => {
        const section = document.querySelector(`#anchor${id}`);
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <Dialog title="" maxWidth="laptop">
            <Form
                sx={{ p: 0 }}
                component="form"
                onSubmit={handleSubmit(onFormSubmit)}>
                <MuiDialogContent>
                    <Box sx={{ display: "flex", p: 0 }}>
                        <Box
                            sx={{
                                width: 240,
                                pl: 0,
                                borderRight: `1px solid ${colors.grey300}`,
                            }}>
                            <ActiveList
                                handleClick={handleScroll}
                                activeItem={activeItem}
                                items={mockTerms}
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Box
                                sx={{
                                    p: 0,
                                    mb: 2,
                                    borderBottom: `1px solid ${colors.grey300}`,
                                }}>
                                <Typography
                                    variant="h2"
                                    sx={{ mb: 2, fontSize: 24 }}>
                                    {dialogProps?.cmsContent.title}
                                </Typography>
                                <Typography color="GrayText" sx={{ mb: 2 }}>
                                    {dialogProps?.cmsContent.subTitle}
                                </Typography>
                            </Box>
                            <ScrollContent>
                                <div style={{ marginBottom: 30 }}>
                                    <HTMLContent
                                        content={
                                            dialogProps?.cmsContent.description
                                        }
                                    />
                                </div>
                                {mockTerms.map((term, index) => (
                                    <InView
                                        key={term.label}
                                        id={`anchor${index + 1}`}
                                        as="div"
                                        onChange={inView => {
                                            if (inView) {
                                                setActiveItem(index + 1);
                                            }
                                        }}>
                                        <Typography
                                            variant="h3"
                                            fontSize={16}
                                            sx={{ textTransform: "uppercase" }}>
                                            {index + 1}. {term.label}
                                        </Typography>
                                        <HTMLContent content={term.content} />
                                    </InView>
                                ))}
                            </ScrollContent>
                        </Box>
                    </Box>
                </MuiDialogContent>
                <MuiDialogActions
                    sx={{
                        justifyContent: "space-between",
                        p: 2,
                        borderTop: `1px solid ${colors.grey300}`,
                    }}>
                    <InputWrapper
                        control={control}
                        label={t(`${TRANSLATION_PATH_DIALOG}.acceptTerms`)}
                        {...cohortAcceptTermsField}
                    />
                    <ModalButtons
                        confirmText={t(
                            `${TRANSLATION_PATH_DIALOG}.confirmButton`
                        )}
                        cancelText={t(
                            `${TRANSLATION_PATH_DIALOG}.discardButton`
                        )}
                        confirmType="submit"
                        onSuccess={handleSuccess}
                    />
                </MuiDialogActions>
            </Form>
        </Dialog>
    );
};

export default CohortRequestTermsDialog;
