import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { PERMISSIONS_TEAM_ROLES } from 'consts';
import { authUtils } from 'utils';
import { AuthProvider } from './context/AuthContext';
import authService from './services/auth';
import personService from './services/person';
import Loading from './pages/commonComponents/Loading';
import { DEFAULT_USER_STATE } from './configs/constants';

const App = ({ children, showLoader }) => {
    const [userState, setUserState] = useState();
    const [userHasTeamRole, setUserHasTeamRole] = useState(false);
    const [isTeamAdminNotManager, setIsTeamAdminNotManager] = useState(false);
    const [isRootAdmin, setIsRootAdmin] = useState(false);
    const [isTeamManager, setIsTeamManager] = useState();
    const [isTeamAdmin, setIsPublisherAdmin] = useState(false);
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

    useEffect(() => {
        if (!userState) return;
        setIsRootAdmin(authUtils.getIsRootRoleAdmin(userState));
    }, [userState]);

    const checkIsTeamManager = teamId => {
        const result = authUtils.userHasTeamRole(userState, teamId, PERMISSIONS_TEAM_ROLES.manager);
        setIsTeamManager(result);
        return result;
    };

    const checkIsTeamAdminNotManager = teamId => {
        const result = authUtils.isTeamAdminNotManager(teamId, userState);
        setIsTeamAdminNotManager(result);
        return result;
    };

    const checkUserHasTeamRole = (teamId, roles) => {
        const result = authUtils.userHasTeamRole(userState, teamId, roles);
        setUserHasTeamRole(result);
        return result;
    };

    const checkIsTeamAdmin = (teamId, roles) => {
        const result = authUtils.getIsTeamAdmin(userState, teamId, roles);
        setIsPublisherAdmin(result);
        return result;
    };

    const isLoading = personResult.isLoading || statusResult.isLoading;

    return (
        <AuthProvider
            value={{
                userState,
                showError: personResult.isError || statusResult.isError,
                checkIsTeamManager,
                isTeamManager,
                checkUserHasTeamRole,
                userHasTeamRole,
                checkIsTeamAdminNotManager,
                isTeamAdminNotManager,
                isRootAdmin,
                checkIsTeamAdmin,
                isTeamAdmin,
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
