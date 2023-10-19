/** @jsxImportSource @emotion/react */

import { colors } from "@/config/theme";
import Box from "@/components/Box";
import { CancelIcon, CheckCircleIcon } from "@/consts/icons";
import Button from "@/components/Button";
import { ReactNode, useState } from "react";
import { Integration } from "@/interfaces/Integration";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import Typography from "@/components/Typography";

import * as styles from "./RunFederationTest.styles";

interface RunFederationTestProps {
    integration?: Partial<Integration>;
    onRun: (status: boolean) => void;
    isEnabled?: boolean;
}

interface RunResponse {
    statusCode: number;
    status: boolean;
    message: string;
}

const Container = ({ children }: { children: ReactNode }) => {
    return (
        <Box
            sx={{
                height: "100%",
                background: colors.grey900,
                color: colors.white,
                p: 3,
            }}>
            {children}
        </Box>
    );
};

const RunFederationTest = ({
    integration,
    onRun,
    isEnabled = false,
}: RunFederationTestProps) => {
    const [isRunning, setIsRunning] = useState(false);
    const [runResponse, setRunResponse] = useState<RunResponse | null>({
        status: true,
        statusCode: 200,
        message: "The auth key is invalid",
    });

    const runTest = () => {
        setIsRunning(true);
        fetch(apis.metaDataFedV1Url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(integration),
        })
            .then(res => res.json())
            .then((res: RunResponse) => {
                setIsRunning(false);
                setRunResponse(res);
                onRun(res.status);
            })
            .catch(() => {
                notificationService.apiError(
                    "There are been an error calling the Metadata Federation Service"
                );
                setIsRunning(false);
            });
    };
    // (!isEnabled || !runResponse)
    if (isRunning) {
        return (
            <Container>
                <Typography css={styles.loading}>
                    Testing API connection link
                </Typography>
            </Container>
        );
    }

    if (runResponse) {
        return (
            <Container>
                <Box
                    sx={{
                        height: "100%",
                        p: 0,
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    <div>
                        <Typography fontSize={10} color={colors.grey200}>
                            Complete
                        </Typography>
                        <Box
                            sx={{
                                p: 0,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>
                            <Typography>API Connection link...</Typography>
                            {runResponse.status ? (
                                <CheckCircleIcon color="success" />
                            ) : (
                                <CancelIcon color="error" />
                            )}
                        </Box>
                    </div>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            p: 0,
                            textAlign: "center",
                            flex: 1,
                            justifyContent: "center",
                        }}>
                        <Typography>
                            {runResponse.status ? "Complete" : "Failed"}
                        </Typography>
                        <Typography>
                            {runResponse.status ? (
                                <>The test has come back with (0) errors</>
                            ) : (
                                <>
                                    The test has come back with a (
                                    {runResponse.statusCode}) error
                                </>
                            )}
                        </Typography>
                        {!runResponse.status && (
                            <>
                                <Typography color={colors.red600}>
                                    {runResponse.message}
                                </Typography>
                                <Typography>
                                    Change the form inputs to reset the test
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <Box
                sx={{
                    p: 0,
                    textAlign: "center",
                    display: "flex",
                    height: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                }}>
                <Typography sx={{ mb: 2 }}>
                    {isEnabled
                        ? "A test must be carried out before you can enable this configuration"
                        : "You must complete the required fields before running a test"}
                </Typography>

                <Button
                    style={{
                        ...(!isEnabled && {
                            background: colors.grey200,
                        }),
                    }}
                    {...(!isEnabled && {
                        color: "inherit",
                    })}
                    disabled={!isEnabled}
                    onClick={() => runTest()}>
                    Run test
                </Button>
            </Box>
        </Container>
    );
};

export default RunFederationTest;
