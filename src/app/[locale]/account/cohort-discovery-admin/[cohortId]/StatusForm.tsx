"use client";

import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputWrapper from "@/components/InputWrapper";
import apis from "@/config/apis";
import usePut from "@/hooks/usePut";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import ChangesActionBar from "@/modules/ChangesActionBar";
import { CohortRequest, CohortRequestForm } from "@/interfaces/CohortRequest";
import useActionBar from "@/hooks/useActionBar";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    defaultValues,
    requestStatusField,
    detailsField,
    validationSchema,
} from "./config";
import { RouteName } from "@/consts/routeName";

interface EditCohortRequestProps {
    cohortRequest: CohortRequest;
}

export default function StatusForm({ cohortRequest }: EditCohortRequestProps) {
    const { push } = useRouter();
    const { showBar, hideBar, store, updateStoreProps } = useActionBar();
    const { control, handleSubmit, formState, reset } =
        useForm<CohortRequestForm>({
            resolver: yupResolver(validationSchema),
            defaultValues: {
                ...defaultValues,
                request_status: cohortRequest.request_status,
            },
        });

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty && !formState.isSubmitSuccessful,
    });

    const hydratedFormFields = useMemo(
        () => [
            {
                ...requestStatusField,
                /* only add "PENDING" to dropdown if that is the current status */
                ...(cohortRequest.request_status === "PENDING" && {
                    options: [
                        { label: "Pending", value: "PENDING" },
                        ...requestStatusField.options,
                    ],
                }),
                /* only add "EXPIRED" to dropdown if that is the current status */
                ...(cohortRequest.request_status === "EXPIRED" && {
                    options: [
                        { label: "Expired", value: "EXPIRED" },
                        ...requestStatusField.options,
                    ],
                }),
            },
            /* only display "details" field if "request_status" has changed */
            ...(formState.dirtyFields.request_status ? [detailsField] : []),
        ],
        [formState.dirtyFields.request_status, cohortRequest]
    );

    const updateCohort = usePut<CohortRequestForm>(
        `${apis.cohortRequestsV1Url}`,
        {
            itemName: "Cohort request",
        }
    );

    /* Increment custom `changeCount` prop within 'ActionBarProvider' using 'updateStoreProps' */
    useEffect(() => {
        updateStoreProps({
            formId: "action-bar-form",
            confirmType: "submit",
            changeCount: Object.keys(formState.dirtyFields).length,
        });
    }, [formState, updateStoreProps]);

    const submitForm = (formData: CohortRequestForm) => {
        updateCohort(cohortRequest.id, {
            details: formData.details,
            request_status: formData.request_status,
        });
        push(`/${RouteName.ACCOUNT}/${RouteName.COHORT_DISCOVERY_ADMIN}`);
    };

    useEffect(() => {
        /* Only call `showBar` if form is `isDirty` ActionBar is not visible */
        if (formState.isDirty && !store.isVisible) {
            showBar("PermissionChanges", {
                component: ChangesActionBar,
                cancelText: "Discard",
                confirmText: "Save",
                changeCount: 1,
                onCancel: () => {
                    push(
                        `/${RouteName.ACCOUNT}/${RouteName.COHORT_DISCOVERY_ADMIN}`
                    );
                },
            });
        }
        if (!formState.isDirty && store.isVisible) {
            hideBar();
        }
    }, [
        cohortRequest,
        formState.isDirty,
        hideBar,
        push,
        reset,
        showBar,
        store.isVisible,
    ]);

    return (
        <Form id="action-bar-form" onSubmit={handleSubmit(submitForm)}>
            {hydratedFormFields.map(field => (
                <InputWrapper
                    horizontalForm
                    key={field.name.toString()}
                    control={control}
                    {...field}
                />
            ))}
        </Form>
    );
}
