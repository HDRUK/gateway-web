import React, { useEffect, useState } from "react";
import { Control, useFormContext } from "react-hook-form";
import Box from "@/components/Box";
import Button from "@/components/Button";
import theme from "@/config/theme";
import { renderFormHydrationField } from "@/utils/formHydration";
import { FormHydration } from "@/interfaces/FormHydration";
import { Option } from "@/interfaces/Option";

type FormValues = Record<string, unknown>;

interface FormFieldRowProps {
    index: number;
    control: Control<FormValues>;
    fieldParent: FormHydration;
    fieldData: Record<string, any>;
    setSelectedField?: (fieldName: string, fieldArrayName: string) => void;
    remove: (index: number) => void;
    subtypeOptions: Option[];
}

const ID = "id";
 const schemaJson = {
        "HealthAndDisease": {
                "properties": {
                    "name": {
                        "Literal": true,
                        "default": "Health and disease",
                        "title": "Name",
                        "type": "string"
                    },
                    "subTypes": {
                        "anyOf": [
                            {
                                "items": {
                                    "$ref": "#/$defs/HealthAndDiseaseSubTypes"
                                },
                                "type": "array"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Subtypes"
                    }
                },
                "required": [
                    "subTypes"
                ],
                "title": "HealthAndDisease",
                "type": "object"
            },
            "HealthAndDiseaseSubTypes": {
                "enum": [
                    "Mental health",
                    "Cardiovascular",
                    "Cancer",
                    "Rare diseases",
                    "Metabolic and endocrine",
                    "Neurological",
                    "Reproductive",
                    "Maternity and neonatology",
                    "Respiratory",
                    "Immunity",
                    "Musculoskeletal",
                    "Vision",
                    "Renal and urogenital",
                    "Oral and gastrointestinal",
                    "Cognitive function",
                    "Hearing",
                    "Others"
                ],
                "title": "HealthAndDiseaseSubTypes",
                "type": "string"
            },
            "ImagingAreaOfTheBody": {
                "properties": {
                    "name": {
                        "Literal": true,
                        "default": "Imaging Area Of The Body",
                        "title": "Name",
                        "type": "string"
                    },
                    "subTypes": {
                        "anyOf": [
                            {
                                "items": {
                                    "$ref": "#/$defs/ImagingAreaOfTheBodySubTypes"
                                },
                                "type": "array"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Subtypes"
                    }
                },
                "required": [
                    "subTypes"
                ],
                "title": "ImagingAreaOfTheBody",
                "type": "object"
            },
            "ImagingAreaOfTheBodySubTypes": {
                "enum": [
                    "Head",
                    "Chest",
                    "Arm",
                    "Abdomen",
                    "Leg",
                    "Others"
                ],
                "title": "ImagingAreaOfTheBodySubTypes",
                "type": "string"
            },
            "ImagingTypes": {
                "properties": {
                    "name": {
                        "Literal": true,
                        "default": "Imaging Types",
                        "title": "Name",
                        "type": "string"
                    },
                    "subTypes": {
                        "anyOf": [
                            {
                                "items": {
                                    "$ref": "#/$defs/ImagingTypesSubTypes"
                                },
                                "type": "array"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Subtypes"
                    }
                },
                "required": [
                    "subTypes"
                ],
                "title": "ImagingTypes",
                "type": "object"
            },
            "ImagingTypesSubTypes": {
                "enum": [
                    "CT",
                    "MRI",
                    "PET",
                    "X-ray",
                    "Ultrasound",
                    "Pathology",
                    "Others"
                ],
                "title": "ImagingTypesSubTypes",
                "type": "string"
            },
            "InformationAndCommunication": {
                "properties": {
                    "name": {
                        "Literal": true,
                        "default": "Information and communication",
                        "title": "Name",
                        "type": "string"
                    },
                    "subTypes": {
                        "anyOf": [
                            {
                                "items": {
                                    "$ref": "#/$defs/NotApplicableSubTypes"
                                },
                                "type": "array"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Subtypes"
                    }
                },
                "required": [
                    "subTypes"
                ],
                "title": "InformationAndCommunication",
                "type": "object"
            },
            "Isocountrycode": {
                "pattern": "^[A-Z]{2}(-[A-Z]{2,3})?$",
                "title": "Isocountrycode",
                "type": "string"
            },
            "LanguageEnum": {
                "enum": [
                    "aa",
                    "ab",
                    "ae",
                    "af",
                    "ak",
                    "am",
                    "an",
                    "ar",
                    "as",
                    "av",
                    "ay",
                    "az",
                    "ba",
                    "be",
                    "bg",
                    "bh",
                    "bi",
                    "bm",
                    "bn",
                    "bo",
                    "br",
                    "bs",
                    "ca",
                    "ce",
                    "ch",
                    "co",
                    "cr",
                    "cs",
                    "cu",
                    "cv",
                    "cy",
                    "da",
                    "de",
                    "dv",
                    "dz",
                    "ee",
                    "el",
                    "en",
                    "eo",
                    "es",
                    "et",
                    "eu",
                    "fa",
                    "ff",
                    "fi",
                    "fj",
                    "fo",
                    "fr",
                    "fy",
                    "ga",
                    "gd",
                    "gl",
                    "gn",
                    "gu",
                    "gv",
                    "ha",
                    "he",
                    "hi",
                    "ho",
                    "hr",
                    "ht",
                    "hu",
                    "hy",
                    "hz",
                    "ia",
                    "id",
                    "ie",
                    "ig",
                    "ii",
                    "ik",
                    "io",
                    "is",
                    "it",
                    "iu",
                    "ja",
                    "jv",
                    "ka",
                    "kg",
                    "ki",
                    "kj",
                    "kk",
                    "kl",
                    "km",
                    "kn",
                    "ko",
                    "kr",
                    "ks",
                    "ku",
                    "kv",
                    "kw",
                    "ky",
                    "la",
                    "lb",
                    "lg",
                    "li",
                    "ln",
                    "lo",
                    "lt",
                    "lu",
                    "lv",
                    "mg",
                    "mh",
                    "mi",
                    "mk",
                    "ml",
                    "mn",
                    "mr",
                    "ms",
                    "mt",
                    "my",
                    "na",
                    "nb",
                    "nd",
                    "ne",
                    "ng",
                    "nl",
                    "nn",
                    "no",
                    "nr",
                    "nv",
                    "ny",
                    "oc",
                    "oj",
                    "om",
                    "or",
                    "os",
                    "pa",
                    "pi",
                    "pl",
                    "ps",
                    "pt",
                    "qu",
                    "rm",
                    "rn",
                    "ro",
                    "ru",
                    "rw",
                    "sa",
                    "sc",
                    "sd",
                    "se",
                    "sg",
                    "si",
                    "sk",
                    "sl",
                    "sm",
                    "sn",
                    "so",
                    "sq",
                    "sr",
                    "ss",
                    "st",
                    "su",
                    "sv",
                    "sw",
                    "ta",
                    "te",
                    "tg",
                    "th",
                    "ti",
                    "tk",
                    "tl",
                    "tn",
                    "to",
                    "tr",
                    "ts",
                    "tt",
                    "tw",
                    "ty",
                    "ug",
                    "uk",
                    "ur",
                    "uz",
                    "ve",
                    "vi",
                    "vo",
                    "wa",
                    "wo",
                    "xh",
                    "yi",
                    "yo",
                    "za",
                    "zh",
                    "zu"
                ],
                "title": "LanguageEnum",
                "type": "string"
            },
            "Lifestyle": {
                "properties": {
                    "name": {
                        "Literal": true,
                        "default": "Socioeconomic",
                        "title": "Name",
                        "type": "string"
                    },
                    "subTypes": {
                        "anyOf": [
                            {
                                "items": {
                                    "$ref": "#/$defs/LifestyleSubTypes"
                                },
                                "type": "array"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Subtypes"
                    }
                },
                "required": [
                    "subTypes"
                ],
                "title": "Lifestyle",
                "type": "object"
            },
            "LifestyleSubTypes": {
                "enum": [
                    "Smoking",
                    "Physical activity",
                    "Dietary habits",
                    "Alcohol",
                    "Others"
                ],
                "title": "LifestyleSubTypes",
                "type": "string"
            },
            "LongDescription": {
                "anyOf": [
                    {
                        "maxLength": 50000,
                        "minLength": 2,
                        "type": "string"
                    },
                    {
                        "type": "null"
                    }
                ],
                "title": "LongDescription"
            },
            "MaterialTypeCategoriesV2": {
                "enum": [
                    "None/not available",
                    "Bone marrow",
                    "Cancer cell lines",
                    "CDNA/MRNA",
                    "Core biopsy",
                    "DNA",
                    "Entire body organ",
                    "Faeces",
                    "Immortalized cell lines",
                    "Isolated pathogen",
                    "MicroRNA",
                    "Peripheral blood cells",
                    "Plasma",
                    "PM Tissue",
                    "Primary cells",
                    "RNA",
                    "Saliva",
                    "Serum",
                    "Swabs",
                    "Tissue",
                    "Urine",
                    "Whole blood",
                    "Availability to be confirmed",
                    "Other"
                ],
                "title": "MaterialTypeCategoriesV2",
                "type": "string"
            },
            "MeasuredProperty": {
                "title": "MeasuredProperty"
            },
            "MeasurementsTests": {
                "properties": {
                    "name": {
                        "Literal": true,
                        "default": "Measurements Tests",
                        "title": "Name",
                        "type": "string"
                    },
                    "subTypes": {
                        "anyOf": [
                            {
                                "items": {
                                    "$ref": "#/$defs/MeasurementsTestsSubTypes"
                                },
                                "type": "array"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Subtypes"
                    }
                },
                "required": [
                    "subTypes"
                ],
                "title": "MeasurementsTests",
                "type": "object"
            },
            "MeasurementsTestsSubTypes": {
                "enum": [
                    "Laboratory",
                    "Other diagnostics"
                ],
                "title": "MeasurementsTestsSubTypes",
                "type": "string"
            }
    }
function getSubtypeOptionsFromSchema(
            schema: Record<string, any>,
            selectedLabel: string
            ): string[] {

            const matchedEntry = Object.entries(schema).find(([_, value]) => {
                return value?.properties?.name?.default === selectedLabel;
            });

            if (!matchedEntry) return ['Not applicable'];

            const [baseKey] = matchedEntry;
            const subTypeKey = `${baseKey}SubTypes`;
            const enumOptions = schema[subTypeKey]?.enum;

            return Array.isArray(enumOptions) ? enumOptions : [];
        }

const FormFieldRow = ({
    index,
    control,
    fieldParent,
    fieldData,
    setSelectedField,
    remove,
    subtypeOptions,
}: FormFieldRowProps) => {
const dataTypeField = `${fieldParent.title}.${index}.Dataset type`
const dataSubTypeField = `${fieldParent.title}.${index}.Dataset subtypes`
console.log(dataSubTypeField)
console.log('Dataset Type Array.0.Dataset subtypes')


    // const watchedType = useWatch({
    //     control,
    //     name: dataTypeField,
    // });

    const [newSubtypeOptions, setNewSubtypeOptions] = useState(subtypeOptions);
    const { setValue, watch, resetField } = useFormContext<FormValues>();
const watchedType = watch(dataTypeField);



    return (
        <Box sx={{ mb: theme.spacing(3) }}>
            {Object.entries(fieldData)
                .filter(([key]) => key !== ID)
                .map(([key]) => {
                    const arrayField = fieldParent?.fields?.find(
                        field => field.title === key
                    );
                    const field = arrayField?.field;
                    const isSubtype = field?.name?.includes("subtype");

  const options = getSubtypeOptionsFromSchema(schemaJson, fieldData["Dataset type"]).map((v) => ({ label: v, value: v }))

                    const fieldWithOptions = isSubtype
                        ? { ...field, options,   }
                        : {...field, disabled: true};
                  

                    return (
                        <React.Fragment key={key}>
                        {fieldWithOptions &&
                            renderFormHydrationField(
                            fieldWithOptions,
                            control,
                            `${fieldParent.title}.${index}.${fieldWithOptions.name}`,
                            (fieldTest: string) =>
                                setSelectedField &&
                                setSelectedField(fieldTest, fieldParent.title),
                            )}
</React.Fragment>
                    );
                })}
        </Box>
    );
};

export default FormFieldRow;
