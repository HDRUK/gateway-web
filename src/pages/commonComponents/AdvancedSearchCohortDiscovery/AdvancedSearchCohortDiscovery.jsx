import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, FeatureContent, Tag, Typography } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import googleAnalytics from '../../../tracking';
import mediaUrl from '../../../images/feature-cohort-discovery.png';
import { ADVANCED_SEARCH_ROLE_GENERAL_ACCESS } from '../../../configs/constants';

import AdvancedSearchRequestAccessModal from '../../dashboard/AdvancedSearchRequestAccessModal';
import AdvancedSearchTermsandConditionsModal from '../../dashboard/AdvancedSearchTAndCsModal';

const baseURL = require('../BaseURL').getURL();
const urlEnv = require('../BaseURL').getURLEnv();

const AdvancedSearchCohortDiscovery = ({ userProps, showLoginModal }) => {
    const { t } = useTranslation();
    const [userState, setUserState] = useState(userProps);
    const [showModalTCs, setShowModalTCs] = useState();
    const [showModalAccess, setShowModalAccess] = useState();

    const { loggedIn, advancedSearchRoles } = userState;

    const authorisedForAdvancedSearch = async () => {
        if (advancedSearchRoles.includes(ADVANCED_SEARCH_ROLE_GENERAL_ACCESS)) {
            return true;
        }
        if (userState.provider === 'oidc') {
            let authorised = false;

            await axios.patch(`${baseURL}/api/v1/users/advancedSearch/roles/${userState.id}`).then(res => {
                authorised = true;

                setUserState({
                    ...userState,
                    advancedSearchRoles: res.data.response.advancedSearchRoles,
                });
            });

            return authorised;
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
    }, []);

    const handleAcceptedTerms = useCallback(async () => {
        await axios
            .patch(`${baseURL}/api/v1/users/advancedSearch/terms/${userState.id}`, {
                acceptedAdvancedSearchTerms: true,
            })
            .then(res => {
                setUserState({
                    ...userState,
                    advancedSearchRoles: res.data.response.advancedSearchRoles,
                });
            });
    }, []);

    return (
        <>
            <FeatureContent
                variant='vertical'
                header={
                    <>
                        {t('search.advanced.cohortDiscovery.title')}
                        <Tag variant='success' ml={2}>
                            {t('beta')}
                        </Tag>
                    </>
                }
                body={<Typography>{t('search.advanced.cohortDiscovery.description')}</Typography>}
                media={<img src={mediaUrl} alt={t('search.advanced.cohortDiscovery.mediaAlt')} />}
                actions={
                    <>
                        <Button variant='secondary' mb={3} onClick={!loggedIn ? showLoginModal : handleRequestAccess}>
                            {loggedIn && t('search.advanced.cohortDiscovery.action')}
                            {!loggedIn && t('search.advanced.cohortDiscovery.actionLoggedOut')}
                        </Button>
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

AdvancedSearchCohortDiscovery.propTypes = {
    userProps: PropTypes.object.isRequired,
    showLoginModal: PropTypes.func.isRequired,
};

export default AdvancedSearchCohortDiscovery;
