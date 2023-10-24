/** @jsxImportSource @emotion/react */

import { colors } from "@/config/theme";
import Box from "@/components/Box";
import { CancelIcon, CheckCircleIcon } from "@/consts/icons";
import Button from "@/components/Button";
import { ReactNode, useState } from "react";
import apis from "@/config/apis";
import Typography from "@/components/Typography";

import usePost from "@/hooks/usePost";
import { Federation, FederationRunResponse } from "@/interfaces/Federation";
import * as styles from "./RunFederationTest.styles";

import { useEffect } from "react";

interface RunFederationTestProps {
    //fieldsToWatch?:
    integration?: Federation;
    onRun: (status: boolean) => void;
    formIsValid?: boolean;
    isEnabled?: boolean;
    teamId?: number;
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
    watch,
    integration,
    teamId,
    onRun,
    isEnabled,
    formIsValid = false,
}: RunFederationTestProps) => {
    const [isRunning, setIsRunning] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [runResponse, setFederationRunResponse] =
        useState<FederationRunResponse | null>(null);

    const runFederationTest = usePost<Federation>(
        `${apis.teamsV1Url}/${teamId}/federations/test`,
        {
            itemName: "Integration test",
            successNotificationsOn: false,
        }
    );

    useEffect(() => {
        //could be still loading..
        if (watch.includes(undefined)) return;

        //the form is loading asynchronously so will indicate that some fields have changed
        //therefore the code shouldn't start messing with enable/disable button
        if (isInitialLoad) {
            setIsInitialLoad(false);
            return;
        }
        console.log("Something has changed in the form...");
        setIsRunning(false);
        //if a field has changed then the run test has not been run..
        onRun(false);
        //also reset the run response
        setFederationRunResponse(null);
    }, [watch]);

    const runTest = async () => {
        setIsRunning(true);

        console.log(integration);

        /*const response = (await runFederationTest(
            integration!
        )) as unknown as FederationRunResponse;
            */
        const response = {
            title: "",
            status: 200,
            success: true,
        };

        setIsRunning(false);
        setFederationRunResponse(response);
        onRun(response.success);
        setIsRunning(false);
    };

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
                    {!formIsValid
                        ? "You must complete the required fields before running a test"
                        : isEnabled
                        ? "API already enabled, you can run a test again or make changes"
                        : "A test must be carried out before you can (re)enable this configuration"}
                </Typography>

                <Button
                    style={{
                        ...(!formIsValid && {
                            background: colors.grey200,
                        }),
                    }}
                    {...(!formIsValid && {
                        color: "inherit",
                    })}
                    disabled={!formIsValid}
                    onClick={() => runTest()}>
                    Run test
                </Button>
            </Box>
        </Container>
    );
};

export default RunFederationTest;
