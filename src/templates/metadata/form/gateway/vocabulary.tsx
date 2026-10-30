"use client";

import {
    ComponentType,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { FieldError, useFormState, useWatch } from "react-hook-form";
import {
    resolveField,
    rootFields,
    toFormValues,
    unionVariants,
} from "@hdruk/metadata-onboard";
import {
    FormField,
    FormSection,
    IntroStep,
    useFormSections,
    useMetadataForm,
    useMetadataFormContext,
} from "@hdruk/metadata-onboard/client";
import { get, merge, set } from "lodash";
import { useTranslations } from "next-intl";
import { StructuralMetadata } from "@/interfaces/Dataset";
import { FormHydrationSchema } from "@/interfaces/FormHydration";
import { Team } from "@/interfaces/Team";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";
import FormInputWrapper from "@/components/FormInputWrapper";
import InputWrapper from "@/components/InputWrapper";
import Typography from "@/components/Typography";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import StructuralMetadataSection from "@/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/components/StructuralMetadata";
import { useGatewayForm } from "./GatewayFormContext";
import {
    UnionCheckboxes,
    UnionInputProps,
    UnionVariantRows,
} from "./gatewayInputs";
import { AsideHint, AsidePaper } from "./vocabulary.styles";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Wrapper = InputWrapper as ComponentType<any>;

const TRANSLATIONS = `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`;

const useActiveSectionIs = (path: string): boolean =>
    useFormSections().activeSection === path.split(".")[0];

export interface PathTagProps {
    path: string;
}

const CUSTODIAN_FIELDS = {
    name: "Name of Data Custodian",
    logo: "Organisation Logo",
    description: "Organisation Description",
    memberOf: "Organisation Membership",
};

export const TeamPicker = ({ path }: PathTagProps) => {
    const t = useTranslations(TRANSLATIONS);
    const methods = useMetadataForm();
    const { schema, defaultTeam } = useGatewayForm();
    const [searchName, setSearchName] = useState("");
    const searchNameDebounced = useDebounce(searchName, 500);

    const { data: teamData, isLoading } = useGet<Team[]>(
        `${apis.teamsSearchV1Url}?name=${searchNameDebounced}`,
        { shouldFetch: !!searchNameDebounced }
    );

    const options = useMemo<OptionsType[]>(() => {
        const found = (teamData ?? []).map(team => ({
            label: team.name,
            value: team.id,
        }));
        const hasDefault =
            !!defaultTeam &&
            found.some(
                option => String(option.value) === String(defaultTeam.value)
            );
        return [...(defaultTeam && !hasDefault ? [defaultTeam] : []), ...found];
    }, [teamData, defaultTeam]);

    const selected = useWatch({ control: methods.control, name: path });
    const [previous, setPrevious] = useState(selected);
    const [custodianId, setCustodianId] = useState<string>();

    if (selected && String(selected) !== String(previous)) {
        setPrevious(selected);
        setCustodianId(String(selected));
    }

    const { data: custodianForm } = useGet<FormHydrationSchema>(
        `${apis.formHydrationV1Url}?team_id=${custodianId}`,
        { shouldFetch: !!custodianId }
    );

    useEffect(() => {
        if (!custodianForm) {
            return;
        }
        const parent = path.split(".").slice(0, -1).join(".");
        const defaults = { ...custodianForm.defaultValues };
        const logo = defaults[CUSTODIAN_FIELDS.logo];
        if (typeof logo === "string" && logo) {
            defaults[CUSTODIAN_FIELDS.logo] = encodeURI(logo);
        }
        const document = Object.entries(CUSTODIAN_FIELDS).reduce(
            (acc, [field, label]) =>
                resolveField(schema, `${parent}.${field}`)
                    ? set(acc, `${parent}.${field}`, defaults[label])
                    : acc,
            {}
        );
        methods.setValue(
            parent,
            merge(
                {},
                methods.getValues(parent),
                get(toFormValues(schema, document), parent)
            ),
            { shouldDirty: true }
        );
    }, [custodianForm, methods, path, schema]);

    return (
        <>
            <Typography variant="h5" component="h2">
                {t("dataCustodian")}
            </Typography>
            <Wrapper
                control={methods.control}
                component={inputComponents.Autocomplete}
                name={path}
                options={options}
                selectOnFocus
                onInputChange={(_: SyntheticEvent, value: string) =>
                    setSearchName(value)
                }
                extraInfo={t("toolTipText")}
                isLoadingOptions={isLoading}
                disableClearable
                filterOptions={(x: OptionsType) => x}
            />
        </>
    );
};

const useUnionInput = (path: string): UnionInputProps => {
    const methods = useMetadataForm();
    const { schema } = useGatewayForm();
    const value = useWatch({ control: methods.control, name: path });
    const field = resolveField(schema, path);

    return {
        name: path,
        value,
        rootSchema: schema,
        variants: field ? unionVariants(field.resolved, schema) : [],
        onChange: next =>
            methods.setValue(path, next, {
                shouldDirty: true,
                shouldValidate: true,
            }),
    };
};

export const UnionChoices = ({ path }: PathTagProps) => (
    <UnionCheckboxes {...useUnionInput(path)} />
);

export const UnionDetails = ({ path }: PathTagProps) => {
    const t = useTranslations(TRANSLATIONS);
    const { control } = useMetadataForm();
    const { schema } = useGatewayForm();
    const isActive = useActiveSectionIs(path);
    const props = useUnionInput(path);
    const { errors } = useFormState({ control, name: path });

    if (!isActive) {
        return null;
    }
    const field = resolveField(schema, path);
    const hasThemes = Array.isArray(props.value) && props.value.length > 0;

    return (
        <FormInputWrapper
            name={path}
            label={field?.label ?? ""}
            required={field?.required}
            extraInfo={hasThemes ? undefined : t("selectDatasetTypes")}
            error={get(errors, path) as FieldError | undefined}>
            <UnionVariantRows {...props} />
        </FormInputWrapper>
    );
};

export const PlainTextField = ({ path }: PathTagProps) => {
    const { control } = useMetadataForm();
    const { schema } = useGatewayForm();
    const isActive = useActiveSectionIs(path);
    const field = resolveField(schema, path);
    if (!isActive || !field) {
        return null;
    }
    return (
        <Wrapper
            control={control}
            component={inputComponents.TextArea}
            name={path}
            label={field.label}
            required={field.required}
            limit={field.resolved.node.maxLength}
            showClearButton={false}
        />
    );
};

export interface DerivedFromObservationsProps extends PathTagProps {
    observedNode: string;
    fallback?: number;
}

export const DerivedFromObservations = ({
    path,
    observedNode,
    fallback,
}: DerivedFromObservationsProps) => {
    const { control, getValues, setValue } = useMetadataForm();
    const observations = useWatch({ control, name: "observations" });

    useEffect(() => {
        const latest = (Array.isArray(observations) ? observations : [])
            .filter(item => item?.observedNode === observedNode)
            .sort(
                (a, b) =>
                    new Date(b.observationDate).getTime() -
                    new Date(a.observationDate).getTime()
            )
            .at(0);
        if (latest && latest.measuredValue !== undefined) {
            setValue(path, Number(latest.measuredValue));
            return;
        }
        const current = getValues(path);
        if (fallback !== undefined && (current == null || current === "")) {
            setValue(path, fallback);
        }
    }, [observations, observedNode, fallback, path, getValues, setValue]);

    return null;
};

export const StructuralMetadataUpload = ({ path }: PathTagProps) => {
    const t = useTranslations(TRANSLATIONS);
    const { control, setValue } = useMetadataForm();
    const isActive = useActiveSectionIs(path);
    const tables = useWatch({ control, name: `${path}.tables` });

    if (!isActive) {
        return null;
    }
    return (
        <StructuralMetadataSection
            structuralMetadata={(tables ?? []) as StructuralMetadata[]}
            fileProcessedAction={(metadata: StructuralMetadata[]) => {
                notificationService.apiSuccess(t("uploadSuccess"));
                setValue(`${path}.tables`, metadata, { shouldDirty: true });
            }}
            handleToggleUploading={() => undefined}
            onRemove={() =>
                setValue(`${path}.tables`, [], { shouldDirty: true })
            }
        />
    );
};

export interface IntroAsideProps {
    title: string;
    hint?: string;
    children: ReactNode;
}

export const IntroAside = ({ title, hint, children }: IntroAsideProps) => {
    const { introAside } = useGatewayForm();
    if (!introAside) {
        return null;
    }
    return createPortal(
        <AsidePaper>
            <Typography variant="articleLead" component="h2">
                {title}
            </Typography>
            {hint && <AsideHint>{hint}</AsideHint>}
            {children}
        </AsidePaper>,
        introAside
    );
};

const CUSTODIAN = "summary.dataCustodian.identifier";
const DATASET_TYPE = "provenance.origin.datasetType";
const POPULATION_SIZE = "summary.populationSize";
const STRUCTURAL_METADATA = "structuralMetadata";

const SECTION_EXCLUDES: Record<string, string[]> = {
    summary: ["dataCustodian"],
    provenance: ["origin.datasetType"],
};

const HDRUK_SECTION_EXCLUDES: Record<string, string[]> = {
    ...SECTION_EXCLUDES,
    summary: [...SECTION_EXCLUDES.summary, "populationSize"],
};

export const GatewayForm = () => {
    const t = useTranslations(TRANSLATIONS);
    const { schema, sections, system } = useMetadataFormContext();
    const { model } = useGatewayForm();
    const has = (path: string) => !!resolveField(schema, path);
    const isHdruk = model === "HDRUK";
    const excludes = isHdruk ? HDRUK_SECTION_EXCLUDES : SECTION_EXCLUDES;

    return (
        <>
            <IntroStep>
                {rootFields(schema)
                    .filter(name => !system.includes(name))
                    .map(name => (
                        <FormField key={name} path={name} />
                    ))}
                {has(CUSTODIAN) && <TeamPicker path={CUSTODIAN} />}
                {has(DATASET_TYPE) && (
                    <IntroAside
                        title={t("datasetThemes")}
                        hint={t("selectAll")}>
                        <UnionChoices path={DATASET_TYPE} />
                    </IntroAside>
                )}
            </IntroStep>
            {isHdruk && has(POPULATION_SIZE) && (
                <DerivedFromObservations
                    path={POPULATION_SIZE}
                    observedNode="Persons"
                    fallback={-1}
                />
            )}
            {sections.map(name =>
                name === STRUCTURAL_METADATA ? (
                    <StructuralMetadataUpload key={name} path={name} />
                ) : (
                    <FormSection
                        key={name}
                        name={name}
                        exclude={excludes[name]}
                    />
                )
            )}
            {has(DATASET_TYPE) && <UnionDetails path={DATASET_TYPE} />}
        </>
    );
};
