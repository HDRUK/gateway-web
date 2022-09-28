import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, FeatureContent, Tag, Typography } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import googleAnalytics from '../../../tracking';
import mediaUrl from '../../../images/feature-cohort-discovery.png';
import { ADVANCED_SEARCH_ROLE_GENERAL_ACCESS } from '../../../configs/constants';
import usersService from '../../../services/users';
import AdvancedSearchRequestAccessModal from '../../dashboard/AdvancedSearchRequestAccessModal';
import AdvancedSearchTermsandConditionsModal from '../../dashboard/AdvancedSearchTAndCsModal';
import { addCmsGatewayHostname } from 'configs/url.config';

const baseURL = require('../BaseURL').getURL();
const urlEnv = require('../BaseURL').getURLEnv();

const AdvancedSearchCohortDiscovery = ({ userProps, variant, showLoginModal }) => {
    const { t } = useTranslation();
    const [userState, setUserState] = useState(userProps);
    const [showModalTCs, setShowModalTCs] = useState();
    const [showModalAccess, setShowModalAccess] = useState();

    const { loggedIn, advancedSearchRoles, acceptedAdvancedSearchTerms } = userState;

    const patchRolesRequest = usersService.usePatchRoles(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const patchTermsRequest = usersService.usePatchTerms(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const authorisedForAdvancedSearch = async () => {
        if (advancedSearchRoles && advancedSearchRoles.includes(ADVANCED_SEARCH_ROLE_GENERAL_ACCESS)) {
            return true;
        }
        if (userState.provider === 'oidc') {
            const {
                data: {
                    response: { advancedSearchRoles },
                },
            } = await patchRolesRequest.mutateAsync({
                _id: userState.id,
            });

            setUserState({
                ...userState,
                advancedSearchRoles,
            });

            return true;
        }

        return false;
    };

    const handleRequestAccess = useCallback(async () => {
        const approvedUser = await authorisedForAdvancedSearch();

        if (approvedUser && userState.acceptedAdvancedSearchTerms) {
            if (urlEnv === 'prod') {
                googleAnalytics.recordVirtualPageView('Cohort discovery tool');
                googleAnalytics.recordEvent('Datasets', 'Clicked search using cohort discovery', 'Opened cohort discovery tool');
                window.location.assign('https://rquest.prod.healthdatagateway.org/bcrquest/');
            } else {
                window.location.assign('https://rquest.test.healthdatagateway.org/bcrquest/');
            }
        } else if (approvedUser) {
            setShowModalTCs(true);
        } else {
            setShowModalAccess(true);
        }
    }, [userState]);

    const handleAcceptedTerms = useCallback(async () => {
        const {
            data: {
                response: { advancedSearchRoles },
            },
        } = await patchTermsRequest.mutateAsync({
            _id: userState.id,
            acceptedAdvancedSearchTerms: true,
        });

        setUserState({
            ...userState,
            advancedSearchRoles,
            acceptedAdvancedSearchTerms: true,
        });
    }, [userState]);

    useEffect(() => {
        setUserState(userProps);
    }, [userProps]);

    return (
        <>
            <FeatureContent
                variant={variant}
                header={
                    <Box display='flex' width='100%' alignItems='center'>
                        <Box flexGrow='1'>{t('search.advanced.cohortDiscovery.title')}</Box>
                        <Tag variant='success' ml={2}>
                            {t('beta').toLocaleUpperCase()}
                        </Tag>
                    </Box>
                }
                body={<Typography>{t('search.advanced.cohortDiscovery.description')}</Typography>}
                media={<img src={addCmsGatewayHostname(mediaUrl)} alt={t('search.advanced.cohortDiscovery.mediaAlt')} />}
                actions={
                    <>
                        {!loggedIn && (
                            <Button variant='secondary' mb={3} onClick={showLoginModal}>
                                {t('search.advanced.cohortDiscovery.actionLoggedOut')}
                            </Button>
                        )}
                        {loggedIn && (
                            <Button
                                variant='secondary'
                                mb={3}
                                onClick={handleRequestAccess}
                                data-testid={acceptedAdvancedSearchTerms ? 'accepted-action' : 'action'}>
                                {t('search.advanced.cohortDiscovery.action')}
                            </Button>
                        )}
                        <a href='https://www.healthdatagateway.org/about/cohort-discovery' target='_blank' rel='noreferrer'>
                            <Typography color='purple500'>{t('learn.more')}</Typography>
                        </a>
                    </>
                }
                mb={5}
            />
            <AdvancedSearchTermsandConditionsModal
                open={showModalTCs}
                close={() => setShowModalTCs(false)}
                updateUserAcceptedAdvancedSearchTerms={handleAcceptedTerms}
            />
            <AdvancedSearchRequestAccessModal open={showModalAccess} close={() => setShowModalAccess(false)} userId={userState.id} />
        </>
    );
};

AdvancedSearchCohortDiscovery.defaultProps = {
    variant: 'vertical',
};

AdvancedSearchCohortDiscovery.propTypes = {
    userProps: PropTypes.object.isRequired,
    showLoginModal: PropTypes.func.isRequired,
};

export default AdvancedSearchCohortDiscovery;
