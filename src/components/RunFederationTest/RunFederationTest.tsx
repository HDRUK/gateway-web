/** @jsxImportSource @emotion/react */

import { colors } from "@/config/theme";
import Box from "@/components/Box";
import Button from "@/components/Button";
import { ReactNode } from "react";
import Typography from "@/components/Typography";
import { FederationRunResponse } from "@/interfaces/Federation";
import { CancelIcon, CheckCircleIcon } from "@/consts/icons";
import * as styles from "./RunFederationTest.styles";

interface RunFederationTestProps {
    onRun: () => void;
    status: "NOT_RUN" | "IS_RUNNING" | "RUN_COMPLETE" | "TESTED_IS_TRUE";
    isEnabled?: boolean;
    runResponse?: FederationRunResponse;
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
    status = "NOT_RUN",
    runResponse,
    onRun,
    isEnabled = false,
}: RunFederationTestProps) => {
    if (status === "IS_RUNNING") {
        return (
            <Container>
                <Typography css={styles.loading}>
                    Testing API connection link
                </Typography>
            </Container>
        );
    }

    if (status === "RUN_COMPLETE" && runResponse) {
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
                            {runResponse.success ? (
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
                            {runResponse.success ? "Complete" : "Failed"}
                        </Typography>
                        <Typography>
                            {runResponse.success ? (
                                <>The test has come back with (0) errors</>
                            ) : (
                                <>
                                    The test has come back with a (
                                    {runResponse.status}) error
                                </>
                            )}
                        </Typography>
                        {!runResponse.success && (
                            <>
                                <Typography color={colors.red600}>
                                    {runResponse.title}
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

    const message =
        status === "TESTED_IS_TRUE"
            ? "Integration tested successfully"
            : isEnabled
            ? "A test must be carried out before you can enable this configuration"
            : "You must complete the required fields before running a test";

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
                <Typography sx={{ mb: 2 }}>{message}</Typography>

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
                    onClick={() => onRun()}>
                    Run test
                </Button>
            </Box>
        </Container>
    );
};

export default RunFederationTest;
