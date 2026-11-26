"use client";

import {
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
    useTransition,
} from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import {
    FormTemplateMeta,
    fromFormValues,
    INTRO_SECTION,
    OnboardingSchema,
    validateDocument,
} from "@hdruk/metadata-onboard";
import {
    FormSectionSummary,
    MetadataFormProvider,
    SchemaPicker,
    useActiveField,
    useFormSections,
    useMetadataForm,
    useMetadataFormContext,
} from "@hdruk/metadata-onboard/client";
import { Button } from "@hdruk/ui";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LegendItem, LegendStatus } from "@/interfaces/FormLegend";
import { OnboardingForm } from "@/interfaces/OnboardingForm";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";
import Box from "@/components/Box";
import FormBanner, { NAVBAR_ID } from "@/components/FormBanner/FormBanner";
import FormLegend from "@/components/FormLegend";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Typography from "@/components/Typography";
import useModal from "@/hooks/useModal";
import { errorNotification } from "@/services/api/utils";
import notificationService from "@/services/notification";
import { DataStatus } from "@/consts/application";
import { ArrowBackIosNewIcon, ArrowForwardIosIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import { capitalise, splitCamelcase } from "@/utils/general";
import { markCollabReadyAction } from "@/app/actions/markCollabReadyAction";
import { saveCollabDraftAction } from "@/app/actions/saveCollabDraftAction";
import { saveSchemaDatasetAction } from "@/app/actions/saveSchemaDatasetAction";
import { GatewayFormContext } from "@/templates/metadata/form/gateway/GatewayFormContext";
import { gatewayInputs } from "@/templates/metadata/form/gateway/gatewayInputs";
import SubmissionScreen from "../../../components/SubmissionScreen";
import { coerceNumbers } from "../../utils/coerceNumbers";
import { padCustodianIdentifier } from "../../utils/padCustodianIdentifier";
import {
    COLLAB_SERVER_OWNED,
    withoutServerOwned,
} from "../../utils/withoutServerOwned";
import {
    AsideSlot,
    BackLink,
    FooterItem,
    FooterRow,
    FormPaper,
    FormRow,
    GuidanceColumn,
    GuidancePaper,
    IntroFields,
    IntroPaper,
    LegendColumn,
    MainColumn,
    PageContainer,
    ShellGrid,
    SubmissionColumn,
    WelcomeHeader,
} from "./SchemaDatasetForm.styles";

const SUBMISSION_SECTION = "submission";
const CREATE_TRANSLATIONS = `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`;
const TRANSLATIONS = `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.SchemaDatasetForm`;

const FORM_LEGEND_EXAMPLE: LegendItem[] = [
    { name: "All fields complete", status: LegendStatus.VALID },
    {
        name: "All required fields complete, some optional fields remain",
        status: LegendStatus.OPTIONAL_REMAIN,
    },
    {
        name: "Not all required fields complete, optional fields may remain",
        status: LegendStatus.INVALID,
    },
    {
        name: "Current form section being viewed",
        status: LegendStatus.ACTIVE,
    },
    { name: "No completed fields", status: LegendStatus.UNTOUCHED },
];

interface SchemaDatasetFormProps {
    teamId: string;
    datasetId?: string;
    isEditing: boolean;
    form: Omit<OnboardingForm, "metadata" | "defaultValues">;
    values: Record<string, unknown>;
    meta: FormTemplateMeta;
    defaultTeam: OptionsType;
    isDraft: boolean;
    isCohortDiscovery?: boolean;
    canChangeSchema?: boolean;
    /**
     * Collaborative onboarding via a share link: an anonymous collaborator
     * saves drafts through the token and can only mark the draft ready for
     * the team to review - never make it active, or leave for team pages.
     */
    collab?: CollabMode;
    children: ReactNode;
}

interface CollabMode {
    token: string;
    readyForReviewAt: string | null;
}

type FormShellProps = Omit<
    SchemaDatasetFormProps,
    "values" | "meta" | "defaultTeam"
> & {
    setIntroAside: (element: HTMLDivElement | null) => void;
};

const percentage = (done: number, total: number) =>
    total ? Math.round((done / total) * 100) : 100;

const inSection = (name: string, section: string) =>
    name === section || name.startsWith(`${section}.`);

const sectionStatus = (
    { name, progress }: FormSectionSummary,
    activeSection: string,
    submissionRequested: boolean,
    isDirty: boolean,
    errorNames: string[]
): LegendStatus => {
    if (name === activeSection) {
        return LegendStatus.ACTIVE;
    }
    if (!submissionRequested && !isDirty) {
        return LegendStatus.UNTOUCHED;
    }
    if (errorNames.some(error => inSection(error, name))) {
        return LegendStatus.INVALID;
    }
    if (progress.optional.done < progress.optional.total) {
        return LegendStatus.OPTIONAL_REMAIN;
    }
    return LegendStatus.VALID;
};

const datasetsHref = (teamId: string, status?: DataStatus) =>
    `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}${
        status ? `?tab=${status}` : ""
    }`;

const FormShell = ({
    teamId,
    datasetId,
    isEditing,
    form,
    isDraft,
    isCohortDiscovery,
    canChangeSchema,
    collab,
    setIntroAside,
    children,
}: FormShellProps) => {
    const t = useTranslations(CREATE_TRANSLATIONS);
    const tSchema = useTranslations(TRANSLATIONS);
    const tApi = useTranslations("api");
    const { showModal } = useModal();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const methods = useMetadataForm();
    // In collab mode this omits server-owned fields (see withoutServerOwned).
    const { validate, schema: validationSchema } = useMetadataFormContext();
    const activeField = useActiveField();
    const { sections, activeSection, setActiveSection } = useFormSections();
    const [isPending, startTransition] = useTransition();
    const [submissionRequested, setSubmissionRequested] = useState(isEditing);
    const [readyForReviewAt, setReadyForReviewAt] = useState(
        collab?.readyForReviewAt ?? null
    );
    const primaryLabel = !collab
        ? t("makeActive")
        : readyForReviewAt
        ? tSchema("unmarkReadyForReview")
        : tSchema("markReadyForReview");
    const [navbarHeight, setNavbarHeight] = useState("0");
    const { dirtyFields, isDirty } = methods.formState;

    useEffect(() => {
        const handleResize = () => {
            const navbar = document.getElementById(NAVBAR_ID);
            if (navbar) {
                setNavbarHeight(`${navbar.offsetHeight}px`);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const submissionErrors = useMemo(() => {
        const flat: FieldErrors<FieldValues> = {};
        const walk = (node: FieldErrors<FieldValues>, path: string[]) => {
            Object.entries(node).forEach(([key, child]) => {
                if (!child || typeof child !== "object") {
                    return;
                }
                const next = [...path, key];
                if (typeof child.message === "string") {
                    flat[next.join(".")] = {
                        type: "schema",
                        message: child.message,
                    };
                    return;
                }
                walk(child as FieldErrors<FieldValues>, next);
            });
        };
        walk(methods.formState.errors, []);
        return flat;
    }, [methods.formState.errors]);

    const errorNames = useMemo(
        () =>
            validateDocument(
                validationSchema,
                padCustodianIdentifier(
                    coerceNumbers(
                        form.schema,
                        fromFormValues(form.schema, methods.getValues())
                    )
                )
            ).map(({ name }) => name),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [form.schema, validationSchema, methods, activeSection]
    );

    const steps = useMemo(
        () => [
            INTRO_SECTION,
            ...sections.map(({ name }) => name),
            SUBMISSION_SECTION,
        ],
        [sections]
    );
    const stepIndex = Math.max(steps.indexOf(activeSection), 0);

    const totals = sections.reduce(
        (acc, { progress }) => ({
            required: {
                done: acc.required.done + progress.required.done,
                total: acc.required.total + progress.required.total,
            },
            optional: {
                done: acc.optional.done + progress.optional.done,
                total: acc.optional.total + progress.optional.total,
            },
        }),
        { required: { done: 0, total: 0 }, optional: { done: 0, total: 0 } }
    );

    const legendItems: LegendItem[] = [
        {
            name: tSchema("introStep"),
            status:
                activeSection === INTRO_SECTION
                    ? LegendStatus.ACTIVE
                    : LegendStatus.UNTOUCHED,
        },
        ...sections.map(summary => ({
            name: summary.name,
            status: sectionStatus(
                summary,
                activeSection,
                submissionRequested,
                !!get(dirtyFields, summary.name),
                errorNames
            ),
        })),
        {
            name: primaryLabel,
            status:
                activeSection === SUBMISSION_SECTION
                    ? LegendStatus.ACTIVE
                    : LegendStatus.UNTOUCHED,
        },
    ];

    const isSection =
        activeSection !== INTRO_SECTION && activeSection !== SUBMISSION_SECTION;

    const buildDocument = () =>
        padCustodianIdentifier(
            coerceNumbers(
                form.schema,
                fromFormValues(form.schema, methods.getValues())
            )
        );

    // Shared with "Make active": request submission and validate, jumping
    // to the submission screen to show what's missing.
    const requestSubmission = () => {
        setSubmissionRequested(true);
        if (!validate()) {
            setActiveSection(SUBMISSION_SECTION);
            return false;
        }
        return true;
    };

    const saveCollabDraft = async (token: string) => {
        const result = await saveCollabDraftAction({
            token,
            model: form.model,
            version: form.version,
            metadata: buildDocument(),
        });
        if (!result.ok) {
            errorNotification({
                status: result.status,
                error: result.error,
                props: { t: tApi, itemName: "Dataset" },
                method: "put",
            });
        }
        return result.ok;
    };

    const collabSaveDraft = (token: string) =>
        startTransition(async () => {
            if (await saveCollabDraft(token)) {
                notificationService.apiSuccess(tSchema("collabDraftSaved"));
            }
        });

    // Marking ready saves first, so the team reviews what's on screen.
    // Unmarking needs neither validation nor a save.
    const collabToggleReady = (token: string) => {
        const ready = !readyForReviewAt;
        if (ready && !requestSubmission()) {
            return;
        }
        startTransition(async () => {
            if (ready && !(await saveCollabDraft(token))) {
                return;
            }
            const result = await markCollabReadyAction(token, ready);
            if (!result.ok) {
                errorNotification({
                    status: result.status,
                    error: result.error,
                    props: { t: tApi, itemName: "Dataset" },
                    method: "patch",
                });
                return;
            }
            setReadyForReviewAt(result.readyForReviewAt ?? null);
            notificationService.apiSuccess(
                tSchema(ready ? "collabMarkedReady" : "collabUnmarkedReady")
            );
        });
    };

    const primaryAction = () =>
        collab ? collabToggleReady(collab.token) : save(DataStatus.ACTIVE);
    const saveDraftAction = () =>
        collab ? collabSaveDraft(collab.token) : save(DataStatus.DRAFT);

    const save = (status: DataStatus.ACTIVE | DataStatus.DRAFT) => {
        const document = buildDocument();

        if (status === DataStatus.ACTIVE && !requestSubmission()) {
            return;
        }

        startTransition(async () => {
            const result = await saveSchemaDatasetAction({
                teamId,
                datasetId,
                model: form.model,
                version: form.version,
                status,
                metadata: document,
                isCohortDiscovery,
            });
            if (result.ok) {
                notificationService.apiSuccess(
                    tApi(
                        `common.success.${datasetId ? "put" : "post"}.message`,
                        {
                            item: "Dataset",
                        }
                    )
                );
                router.push(datasetsHref(teamId, status));
            } else {
                errorNotification({
                    status: result.status,
                    error: result.error,
                    props: { t: tApi, itemName: "Dataset" },
                    method: datasetId ? "put" : "post",
                });
            }
        });
    };

    const switchSchema = (schema: OnboardingSchema) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set("schema", schema.model);
        params.set("version", schema.version);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const changeSchema = (schema: OnboardingSchema) => {
        if (!isDirty && !isEditing) {
            switchSchema(schema);
            return;
        }
        showModal({
            title: tSchema("switchSchemaTitle"),
            content: tSchema("switchSchemaConfirm"),
            confirmText: tSchema("switchSchemaConfirmText"),
            cancelText: tSchema("switchSchemaCancelText"),
            onSuccess: () => switchSchema(schema),
        });
    };

    return (
        <ShellGrid>
            {!collab && (
                <BackLink
                    href={datasetsHref(
                        teamId,
                        isDraft ? DataStatus.DRAFT : DataStatus.ACTIVE
                    )}
                    underline="hover">
                    <ArrowBackIosNewIcon fontSize="small" />
                    {t("backToManagementPage")}
                </BackLink>
            )}

            <FormBanner
                makeActiveAction={primaryAction}
                makeActiveLabel={primaryLabel}
                saveAsDraftAction={saveDraftAction}
                completionPercentage={percentage(
                    totals.required.done,
                    totals.required.total
                )}
                optionalPercentage={percentage(
                    totals.optional.done,
                    totals.optional.total
                )}
                actionButtonsEnabled={!isPending}
            />

            <FormRow>
                <LegendColumn>
                    <FormLegend
                        items={legendItems}
                        handleClickItem={index =>
                            setActiveSection(steps[index])
                        }
                        offsetTop={navbarHeight}
                    />
                </LegendColumn>

                {activeSection === SUBMISSION_SECTION && (
                    <SubmissionColumn>
                        <SubmissionScreen
                            trigger={methods.trigger}
                            errors={submissionErrors}
                            makeActiveAction={primaryAction}
                            makeActiveLabel={primaryLabel}
                            makeActiveDisabled={isPending}
                        />
                    </SubmissionColumn>
                )}

                {activeSection === INTRO_SECTION && (
                    <IntroPaper>
                        <WelcomeHeader>
                            <Typography variant="h2" component="h1">
                                {t("welcomeMessage")}
                            </Typography>
                            <Typography variant="articleLead">
                                {t("legendIntro")}
                            </Typography>
                        </WelcomeHeader>
                        <Box>
                            <Typography variant="h4" component="h2">
                                {t("progressLegend")}
                            </Typography>
                            <FormLegend items={FORM_LEGEND_EXAMPLE} />
                        </Box>
                        {canChangeSchema && (
                            <Box>
                                <Typography variant="h5" component="h2">
                                    {tSchema("schemaPicker")}
                                </Typography>
                                <SchemaPicker
                                    label=""
                                    options={form.schemas}
                                    value={{
                                        model: form.model,
                                        version: form.version,
                                    }}
                                    onChange={(_, schema) =>
                                        changeSchema(schema)
                                    }
                                    disabled={isPending}
                                />
                            </Box>
                        )}
                        <IntroFields>{children}</IntroFields>
                    </IntroPaper>
                )}

                {isSection && (
                    <MainColumn>
                        <FormPaper>
                            <Typography variant="articleLead" component="h2">
                                {capitalise(splitCamelcase(activeSection))}
                            </Typography>
                            {children}
                        </FormPaper>
                    </MainColumn>
                )}

                {activeSection === INTRO_SECTION && (
                    <AsideSlot ref={setIntroAside} />
                )}

                {isSection && (
                    <GuidanceColumn>
                        <GuidancePaper>
                            <Typography variant="articleLead" component="h2">
                                {t("guidance")}
                            </Typography>
                            {activeField?.guidance && (
                                <MarkDownSanitizedWithHtml
                                    content={activeField.guidance.replaceAll(
                                        "\\n",
                                        "\n"
                                    )}
                                />
                            )}
                        </GuidancePaper>
                    </GuidanceColumn>
                )}
            </FormRow>

            <FooterRow>
                <FooterItem>
                    <Button
                        onClick={() => setActiveSection(steps[stepIndex - 1])}
                        disabled={stepIndex === 0}
                        variant="text"
                        startIcon={<ArrowBackIosNewIcon />}>
                        {t("previous")}
                    </Button>
                </FooterItem>
                <FooterItem>
                    <Button
                        onClick={() => setActiveSection(steps[stepIndex + 1])}
                        disabled={stepIndex === steps.length - 1}
                        endIcon={<ArrowForwardIosIcon />}>
                        {t("next")}
                    </Button>
                </FooterItem>
            </FooterRow>
        </ShellGrid>
    );
};

const SchemaDatasetForm = ({
    teamId,
    datasetId,
    isEditing,
    form,
    values,
    meta,
    defaultTeam,
    isDraft,
    isCohortDiscovery,
    canChangeSchema,
    collab,
    children,
}: SchemaDatasetFormProps) => {
    const t = useTranslations(CREATE_TRANSLATIONS);
    const [introAside, setIntroAside] = useState<HTMLDivElement | null>(null);
    // The collaborator can't see or change what the API forces on save, so
    // their form validates (and counts progress) without it. Documents are
    // still built against the full schema.
    const validationSchema = useMemo(
        () =>
            collab
                ? withoutServerOwned(form.schema, COLLAB_SERVER_OWNED)
                : form.schema,
        [collab, form.schema]
    );
    const transformDocument = useCallback(
        (document: Record<string, unknown>) =>
            padCustodianIdentifier(coerceNumbers(form.schema, document)),
        [form.schema]
    );

    return (
        <PageContainer>
            <GatewayFormContext.Provider
                value={{
                    schema: form.schema,
                    model: form.model,
                    version: form.version,
                    teamId,
                    defaultTeam,
                    introAside,
                    isCollab: !!collab,
                }}>
                <MetadataFormProvider
                    schema={validationSchema}
                    values={values}
                    system={meta.system}
                    sections={meta.sections}
                    components={gatewayInputs}
                    mode="onTouched"
                    transformDocument={transformDocument}
                    localeText={{ addItem: t("add"), removeItem: t("remove") }}>
                    <FormShell
                        teamId={teamId}
                        datasetId={datasetId}
                        isEditing={isEditing}
                        form={form}
                        isDraft={isDraft}
                        isCohortDiscovery={isCohortDiscovery}
                        canChangeSchema={canChangeSchema}
                        collab={collab}
                        setIntroAside={setIntroAside}>
                        {children}
                    </FormShell>
                </MetadataFormProvider>
            </GatewayFormContext.Provider>
        </PageContainer>
    );
};

export default SchemaDatasetForm;
