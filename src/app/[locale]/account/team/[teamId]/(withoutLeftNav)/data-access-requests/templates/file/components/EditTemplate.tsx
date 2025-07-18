"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import Container from "@/components/Container";
import Paper from "@/components/Paper";
import Sections from "@/components/Sections";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import useActionBar from "@/hooks/useActionBar";
import useModal from "@/hooks/useModal";

const EDIT_TEMPLATE_TRANSLATION_PATH = "pages.account.team.dar.template.edit";

interface EditTemplateProps {
    teamId: string;
    templateId: string;
}
const sections = [
    {
        id: 1,
        name: "File-based template",
        parent_section: null,
        order: 0,
    },
];

const EditTemplate = ({ teamId, templateId }: EditTemplateProps) => {
    const t = useTranslations(EDIT_TEMPLATE_TRANSLATION_PATH);

    const [sectionId, setSectionId] = useState(1);

    const [hasChanges, setHasChanges] = useState(false);

    const { showModal } = useModal();
    const { showBar } = useActionBar();

    const handleChangeSection = (sectionId: number) => {
        if (!hasChanges) {
            setSectionId(sectionId);
        } else {
            showModal({
                invertCloseIconBehaviour: true,
                confirmText: t("unsavedConfirm"),
                cancelText: t("unsavedCancel"),
                title: t("unsavedTitle"),
                content: t("unsavedInfo"),
                onCancel: () => setSectionId(sectionId),
            });
        }
    };

    const [currentSection, setCurrentSection] = useState<QuestionBankSection>();

    useEffect(() => {
        const section = sections?.filter(s => s.id === sectionId)[0];
        if (section) {
            setCurrentSection(section);
        }
    }, [sections, sectionId]);

    const handleSaveChanges = (isPublished: boolean) => {
        // const payload = {
        //     team_id: teamId,
        //     user_id: user?.id.toString(),
        //     published: isPublished ? 1 : 0,
        // };
    };

    useEffect(() => {
        showBar("CreateTool", {
            confirmText: t("save"),
            tertiaryButton: {
                onAction: () => handleSaveChanges(false),
                buttonText: t("saveDraft"),
                buttonProps: {
                    color: "secondary",
                    variant: "outlined",
                },
            },
            onSuccess: () => {
                handleSaveChanges(true);
            },
            showCancel: false,
        });
    }, [showBar, t]);

    const tabsList = [
        {
            label: "Create",
            value: "create",
            content: (
                <Paper
                    sx={{
                        my: 2,
                        padding: 2,
                    }}
                />
            ),
        },
        {
            label: "Preview",
            value: "preview",
            content: (
                <Paper
                    sx={{
                        my: 2,
                        padding: 2,
                    }}
                />
            ),
        },
    ];

    return (
        <Container maxWidth={false} sx={{ minHeight: "1000px", p: 1, m: 1 }}>
            <Typography variant="h2"> {t("title")} </Typography>
            <Container
                maxWidth={false}
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 4fr",
                    gap: 0,
                    pt: 2,
                }}>
                <Sections
                    handleLegendClick={handleChangeSection}
                    sectionId={sectionId}
                    sections={sections}
                />
                <Container maxWidth={false}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h2">
                            {currentSection?.name}
                        </Typography>
                    </Paper>
                    {tabsList && (
                        <Tabs
                            centered
                            tabs={tabsList}
                            tabBoxSx={{ padding: 0 }}
                            rootBoxSx={{ padding: 0 }}
                        />
                    )}
                </Container>
            </Container>
        </Container>
    );
};

export default EditTemplate;
