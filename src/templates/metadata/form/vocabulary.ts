import {
    FormField,
    FormSection,
    IntroStep,
    SchemaSections,
} from "@hdruk/metadata-onboard/client";
import {
    DerivedFromObservations,
    GatewayForm,
    IntroAside,
    PlainTextField,
    StructuralMetadataUpload,
    TeamPicker,
    UnionChoices,
    UnionDetails,
} from "./gateway/vocabulary";

export const formVocabulary = {
    IntroStep,
    IntroAside,
    FormSection,
    FormField,
    SchemaSections,
    GatewayForm,
    TeamPicker,
    UnionChoices,
    UnionDetails,
    PlainTextField,
    DerivedFromObservations,
    StructuralMetadataUpload,
};

export type FormVocabulary = typeof formVocabulary;
