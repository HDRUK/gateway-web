import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import AdvancedSearchRequestAccessModal from '../../dashboard/AdvancedSearchRequestAccessModal';
import AdvancedSearchTermsandConditionsModal from '../../dashboard/AdvancedSearchTAndCsModal';
import { ReactComponent as GoldStar } from '../../../images/cd-star.svg';
import { ReactComponent as ChevronRightSvg } from '../../../images/chevron-right.svg';
import axios from 'axios';
const baseURL = require('../../commonComponents/BaseURL').getURL();
const GENERAL_ACCESS = 'GENERAL_ACCESS';
const BANNED = 'BANNED';
const urlEnv = require('../../commonComponents/BaseURL').getURLEnv();

const CohortDiscoveryBanner = ({ userProps }) => {
    const [userState, setUserState] = useState(userProps);
    const [showRequestAccessModal, setShowRequestAccessModal] = useState(false);
    const [showTermsandConditionsModal, setShowTermsAndConditionsModal] = useState(false);

    const accessRQuest = async () => {
        const approvedUser = await authorisedForAdvancedSearch();
        if (approvedUser && userState.acceptedAdvancedSearchTerms) {
            if (urlEnv === 'prod') {
                window.location.assign('https://rquest.prod.healthdatagateway.org/bcrquest/');
            } else {
                window.location.assign('https://rquest.test.healthdatagateway.org/bcrquest/');
            }
        } else {
            determineModalToShow(approvedUser);
        }
    };

    const authorisedForAdvancedSearch = async () => {
        if (userState.advancedSearchRoles.includes(BANNED)) {
            return false;
        } else if (userState.advancedSearchRoles.includes(GENERAL_ACCESS)) {
            return true;
        } else if (userState.provider === 'oidc') {
            //if user is from open athens but not authorised and not banned, assign them an advanced search role
            let authorised = false;
            await axios
                .patch(baseURL + '/api/v1/users/advancedSearch/roles/' + userState.id)
                .then(res => {
                    authorised = true;
                    let newUserState = userState;
                    newUserState.advancedSearchRoles = res.data.response.advancedSearchRoles;
                    setUserState(newUserState);
                })
                .catch(err => {
                    console.error(err.message);
                });
            return authorised;
        } else {
            return false;
        }
    };

    const determineModalToShow = approvedUser => {
        if (approvedUser) {
            toggleShowTermsandConditionsModal();
        } else {
            toggleShowRequestAccessModal();
        }
    };

    const updateUserAcceptedAdvancedSearchTerms = async () => {
        await axios
            .patch(baseURL + '/api/v1/users/advancedSearch/terms/' + userState.id, {
                acceptedAdvancedSearchTerms: true,
            })
            .then(res => {
                // Update the state so that if user moves away from page they are still authorised
                let newUserState = userState;
                newUserState.acceptedAdvancedSearchTerms = res.data.response.acceptedAdvancedSearchTerms;
                setUserState(newUserState);
                accessRQuest();
            })
            .catch(err => {
                console.error(err.message);
            });
    };

    const toggleShowRequestAccessModal = () => {
        setShowRequestAccessModal(!showRequestAccessModal);
    };

    const toggleShowTermsandConditionsModal = () => {
        setShowTermsAndConditionsModal(!showTermsandConditionsModal);
    };

    const showLoginModal = () => {
        // 1. add class to body to stop background scroll
        document.body.classList.add('modal-open');

        document.getElementById('myModal').style.display = 'block';
        document.getElementById('loginWayFinder').style.display = 'none';
        document.getElementById('loginButtons').style.display = 'block';
        document.getElementById('loginModalTitle').innerHTML = 'Sign in or create a new account';
        document.getElementById('modalRequestSection').style.display = 'none';

        window.onclick = function (event) {
            if (event.target === document.getElementById('myModal')) {
                // 2. remove class modal-open from body
                document.body.classList.remove('modal-open');
                document.getElementById('myModal').style.display = 'none';
            }
        };
    };
    return (
        <>
            <Row className='mt-1 mb-3'>
                <Col sm={12} lg={12}>
                    <div className='rectangle'>
                        <Row className='gray800-14-bold'>
                            <Col sm={11} lg={11} className='gray800-14'>
                                <div className='black-16-semibold mr-3'>
                                    <GoldStar fill={'#f98e2b'} height='16' width='16' viewBox='0 0 21 21' className='mr-2' />
                                    Explore this dataset with cohort discovery
                                    <span className='beta-title ml-2'>BETA</span>
                                </div>
                                <div className='gray800-14'>
                                    Find out the count and gender distribution of subjects with the characteristics you’re interested in,
                                    such as disease. Queries are made on the actual dataset, not just metadata.
                                    <a
                                        className='textUnderline gray800-14 cursorPointer'
                                        href='https://www.healthdatagateway.org/about/cohort-discovery'
                                        target='_blank'
                                        rel='noopener noreferrer'>
                                        Learn more
                                    </a>
                                </div>
                            </Col>
                            <Col sm={1} lg={1} className='alignSelfCenter'>
                                <span
                                    onClick={() => {
                                        userState.loggedIn ? accessRQuest() : showLoginModal();
                                    }}>
                                    <ChevronRightSvg fill={'#475da7'} className='dataClassArrow pointer' />
                                </span>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <AdvancedSearchTermsandConditionsModal
                open={showTermsandConditionsModal}
                close={() => toggleShowTermsandConditionsModal()}
                updateUserAcceptedAdvancedSearchTerms={() =>
                    updateUserAcceptedAdvancedSearchTerms()
                }></AdvancedSearchTermsandConditionsModal>
            <AdvancedSearchRequestAccessModal
                open={showRequestAccessModal}
                close={() => toggleShowRequestAccessModal()}
                userId={userState.id}></AdvancedSearchRequestAccessModal>
        </>
    );
};

export default CohortDiscoveryBanner;
