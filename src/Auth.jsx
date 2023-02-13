import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { authUtils } from 'utils';
import { authService, personService } from 'services';
import { AuthProvider } from './context/AuthContext';
import Loading from './pages/commonComponents/Loading';
import { DEFAULT_USER_STATE } from './configs/constants';

const App = ({ children, showLoader }) => {
    const [userState, setUserState] = useState();
    const [isRootAdmin, setIsRootAdmin] = useState(false);
    const [isHDRAdmin, setIsHDRAdmin] = useState(false);
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
        setIsHDRAdmin(authUtils.getIsHDRAdmin(userState));
    }, [userState]);

    const isLoading = personResult.isLoading || statusResult.isLoading;

    return (
        <AuthProvider
            value={{
                userState,
                showError: personResult.isError || statusResult.isError,
                isRootAdmin,
                isHDRAdmin,
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
