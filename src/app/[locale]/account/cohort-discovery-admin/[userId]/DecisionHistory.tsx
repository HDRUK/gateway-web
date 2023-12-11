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

import Box from "@/components/Box";
import Typography from "@/components/Typography";
import { formatDate } from "@/utils/date";

import Accordion from "@/components/Accordion";

interface DecisionHistoryProps {
    cohortRequest: CohortRequest;
}

export default function DecisionHistory({
    cohortRequest,
}: DecisionHistoryProps) {
    return (
        <>
            <Accordion
                heading={<Typography>{"Show decision history"}</Typography>}
                contents={cohortRequest.logs.map(log => (
                    <Box
                        key={log.id}
                        sx={{
                            p: 0,
                            m: 0,
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                        }}>
                        <Typography sx={{ width: "25%" }} color="GrayText">
                            {log.request_status}
                        </Typography>
                        <Typography sx={{ width: "25%" }} color="GrayText">
                            {formatDate(new Date(log.updated_at), "dd/MM/yyyy")}
                        </Typography>
                        <Typography sx={{ width: "50%" }} color="GrayText">
                            {log.details}
                        </Typography>
                    </Box>
                ))}
            />
        </>
    );
}
