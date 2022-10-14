import React, { useEffect, useState, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { AuthProvider } from './context/AuthContext';
import authService from './services/auth';
import personService from './services/person';
import Loading from './pages/commonComponents/Loading';
import { DEFAULT_USER_STATE, ROLE_MANAGER } from './configs/constants';

const App = ({ children, showLoader }) => {
    const [userState, setUserState] = useState();
    const [isTeamManager, setIsTeamManager] = useState();
    const statusResult = authService.useGetStatus();
    const personResult = personService.useGetPerson();

    useEffect(() => {
        const init = async () => {
            if (statusResult.isFetched) {
                if (statusResult.data?.data?.data[0]?.id) {
                    try {
                        const { loggedIn, role, id, name, teams, email, provider, advancedSearchRoles, acceptedAdvancedSearchTerms } =
                            statusResult.data.data.data[0];
                        const {
                            data: {
                                person: { profileComplete, terms },
                            },
                        } = await personResult.mutateAsync(id);

                        setUserState([
                            {
                                loggedIn,
                                role,
                                id,
                                name,
                                teams,
                                email,
                                profileComplete,
                                provider,
                                advancedSearchRoles,
                                acceptedAdvancedSearchTerms,
                                terms,
                            },
                        ]);
                    } catch (e) {
                        setUserState(DEFAULT_USER_STATE);
                    }
                } else {
                    setUserState(DEFAULT_USER_STATE);
                }
            }
        };

        init();
    }, [statusResult.data]);

    const roleInTeam = useCallback(
        (teamId, role) => {
            const { teams } = userState[0];

            return !!teams.find(({ id, roles }) => {
                return teamId === id && roles.includes(role);
            });
        },
        [userState]
    );

    const managerInTeam = teamId => {
        setIsTeamManager(teamId, ROLE_MANAGER);
    };

    const isLoading = personResult.isLoading || statusResult.isLoading;

    return (
        <AuthProvider
            value={{
                userState,
                showError: personResult.isError || statusResult.isError,
                roleInTeam,
                managerInTeam,
                isTeamManager,
            }}>
            {showLoader && isLoading && (
                <Container>
                    <Loading />
                </Container>
            )}
            {userState && children}
        </AuthProvider>
    );
};

App.propTypes = {
    showLoader: PropTypes.bool,
    children: PropTypes.node.isRequired,
};

App.defaultProps = {
    showLoader: false,
};

export default App;
