import { has, isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NotificationManager } from 'react-notifications';

import { generalUtils } from 'utils';
import { Alert, LayoutContent } from 'components';
import { personService, publishersService } from 'services';
import SVGIcon from '../../../images/SVGIcon';
import { stripHtml } from '../../../utils/General.util';

import CustomiseDAREditGuidance from '../Components/CustomiseDAREditGuidance';
import StatusBadge from './Components/StatusBadge';
import './CustomiseDAR.scss';
import handleAnalytics from '../../dataAccessRequestCustomiseForm/handleAnalytics';

const CustomiseDAR = ({ userState, publisherId, showConfirmPublishModal, setShowConfirmPublishModal, activeTab, onSelectTab, alert }) => {
    const { t } = useTranslation();
    const [publisherDetails, setPublisherDetails] = useState({});
    const [howToRequestAccessStatus, setHowToRequestAccessStatus] = useState();
    const [yourAppFormStatus, setYourAppFormStatus] = useState();
    const [howToRequestAccessPublisher, setHowToRequestAccessPublisher] = useState();
    const [yourApplicationFormPublisher, setYourApplicationFormPublisher] = useState();
    const [showGuidanceModal, setShowGuidanceModal] = useState();
    const [closeGuidanceMessage, setCloseGuidanceMessage] = useState('');
    const [alertMessage, setAlertMessage] = useState(alert?.message);

    const { publishedDARContent } = generalUtils.parseQueryString(window.location.search);

    const publishersRequest = publishersService.useGetPublisher(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const personGetRequest = personService.useGetPerson(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });
    const sectionStatuses = {
        ACTIVE: 'Live',
        INACTIVE: 'Inactive',
        PENDING: 'Pending',
    };

    const sectionStatusColours = {
        Live: 'green',
        Inactive: 'gray',
        Pending: 'amber',
    };

    const getHowToRequestAccessPublisher = async publisherInfo => {
        if (has(publisherInfo, 'dataRequestModalContentUpdatedBy')) {
            personGetRequest.mutateAsync(publisherInfo.dataRequestModalContentUpdatedBy).then(res => {
                const {
                    data: { person },
                } = res;

                setHowToRequestAccessPublisher(`${person.firstname} ${person.lastname}`);
            });
        }
    };

    const getYourApplicationFormPublisher = async publisherInfo => {
        if (has(publisherInfo, 'applicationFormUpdatedBy')) {
            personGetRequest.mutateAsync(publisherInfo.applicationFormUpdatedBy).then(res => {
                const {
                    data: { person },
                } = res;

                setYourApplicationFormPublisher(`${person.firstname} ${person.lastname}`);
            });
        }
    };

    const setSectionStatuses = (htraContent, applicationContentComplete) => {
        if (!isEmpty(htraContent)) {
            if (applicationContentComplete) {
                setHowToRequestAccessStatus(sectionStatuses.ACTIVE);
                setYourAppFormStatus(sectionStatuses.ACTIVE);
            } else {
                setHowToRequestAccessStatus(sectionStatuses.PENDING);
                setYourAppFormStatus(sectionStatuses.INACTIVE);
            }
        } else if (applicationContentComplete) {
            setYourAppFormStatus(sectionStatuses.PENDING);
            setHowToRequestAccessStatus(sectionStatuses.INACTIVE);
        } else {
            setYourAppFormStatus(sectionStatuses.INACTIVE);
            setHowToRequestAccessStatus(sectionStatuses.INACTIVE);
        }
    };

    const getModalData = () => {
        publishersRequest.mutateAsync(publisherId).then(async res => {
            const {
                data: { publisher },
            } = res;
            const body = has(publisher, 'dataRequestModalContent.body') ? publisher.dataRequestModalContent.body : '';

            setSectionStatuses(body, publisher.uses5Safes);
            setPublisherDetails(publisher);

            await getHowToRequestAccessPublisher(publisher);
            await getYourApplicationFormPublisher(publisher);
        });
    };

    useEffect(() => {
        setAlertMessage(alert?.message);
    }, [alert?.message]);

    useEffect(() => {
        getModalData();
    }, [publisherId]);

    const loadCustomiseForm = () => {
        window.location.href = `/data-access-request/customiseForm/${publisherId}`;
    };

    const handleShowGuidanceModal = () => {
        setShowGuidanceModal(true);
    };

    const handleSelectTab = tabId => {
        setShowGuidanceModal(false);

        onSelectTab(tabId);

        handleAnalytics(`Clicked on ${tabId}`, tabId);
    };

    const handleCloseGuidanceMessage = () => {
        setCloseGuidanceMessage('');
    };

    const handleCloseAlertMessage = () => {
        setAlertMessage('');
    };

    return publisherDetails.publisherDetails?.questionBank?.enabled ? (
        <>
            {alertMessage && (
                <LayoutContent>
                    <Alert variant='success' autoclose onClose={handleCloseAlertMessage} mb={3}>
                        {alertMessage}
                    </Alert>
                </LayoutContent>
            )}

            {closeGuidanceMessage && (howToRequestAccessStatus === sectionStatuses.ACTIVE || yourAppFormStatus === sectionStatuses.ACTIVE) && (
                <LayoutContent>
                    <Alert variant='success' autoclose onClose={handleCloseGuidanceMessage} mb={3}>
                        {closeGuidanceMessage}
                    </Alert>
                </LayoutContent>
            )}

            {(howToRequestAccessStatus === sectionStatuses.PENDING || yourAppFormStatus === sectionStatuses.PENDING) && (
                <LayoutContent>
                    <Alert variant='warning' mb={3}>
                        {t('DAR.customise.warningAlert')}
                    </Alert>
                </LayoutContent>
            )}

            <div className='row justify-content-md-center'>
                <div className='col-sm-12 col-md-10'>
                    <div className='accountHeader'>
                        <div>
                            <h1 className='black-20-semibold'>{t('DAR.customise.title')}</h1>
                            <div className='soft-black-14'>{t('DAR.customise.description')}</div>
                        </div>
                    </div>
                    <div className='tabsBackground mb-3'>
                        <Tabs className='dataAccessTabs gray700-13' activeKey={activeTab} onSelect={handleSelectTab}>
                            <Tab eventKey='customisedataaccessrequests_guidance' title={t('tabs.presubmissionGuidance')}>
                                {' '}
                            </Tab>
                            <Tab eventKey='customisedataaccessrequests_applicationform' title={t('tabs.applicationForm')}>
                                {' '}
                            </Tab>
                        </Tabs>
                    </div>

                    {activeTab === 'customisedataaccessrequests_guidance' && (
                        <div className='main-card cursorPointer' onClick={handleShowGuidanceModal}>
                            <div className='super-header'>
                                <h1 className='black-20-semibold mb-3'>
                                    <SVGIcon name='info' fill='#475da7' className='accountSvgs mr-2' />
                                    <span className='ml-3'>{t('DAR.customise.presubmissionGuidance.title')}</span>
                                    <StatusBadge
                                        sectionStatus={howToRequestAccessStatus}
                                        statusOptions={sectionStatuses}
                                        statusClass={sectionStatusColours[howToRequestAccessStatus]}
                                        toolTipText={stripHtml(t('DAR.customise.statusWarning'))}
                                    />
                                </h1>
                                <div className='main-header-desc'>
                                    <div className='soft-black-14'>{t('DAR.customise.presubmissionGuidance.description')}</div>
                                    <div className='customise-dar-body'>
                                        {publisherDetails.dataRequestModalContentUpdatedBy && (
                                            <>
                                                <span className='box gray200-14'>{t('DAR.customise.lastUpdatedBy')}</span>
                                                <span className='box gray800-14'>{howToRequestAccessPublisher}</span>
                                            </>
                                        )}
                                        <span className='box gray200-14'>{t('DAR.customise.lastUpdatedOn')}</span>
                                        <span className='box gray800-14'>
                                            {publisherDetails.dataRequestModalContentUpdatedOn
                                                ? moment(publisherDetails.dataRequestModalContentUpdatedOn).format('DD MMM YYYY HH:mm')
                                                : 'No customisations made'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'customisedataaccessrequests_applicationform' && (
                        <div className='main-card cursorPointer' onClick={() => loadCustomiseForm()}>
                            <div className='super-header'>
                                <h1 className='black-20-semibold mb-3'>
                                    <SVGIcon name='dataaccessicon' fill='#475da7' className='accountSvgs mr-2' />
                                    <span className='ml-3'>{t('DAR.customise.applicationForm.title')}</span>
                                    <StatusBadge
                                        sectionStatus={yourAppFormStatus}
                                        statusOptions={sectionStatuses}
                                        statusClass={sectionStatusColours[yourAppFormStatus]}
                                        toolTipText={stripHtml(t('DAR.customise.statusWarning'))}
                                    />
                                </h1>
                                <div className='main-header-desc'>
                                    <div className='soft-black-14'>
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: t('DAR.customise.applicationForm.description', {
                                                    publisherName: publisherDetails?.publisherDetails?.name,
                                                }),
                                            }}
                                        />
                                    </div>
                                    <div className='customise-dar-body'>
                                        {publisherDetails.applicationFormUpdatedBy && (
                                            <>
                                                <span className='box gray200-14'>{t('DAR.customise.lastUpdatedBy')}</span>
                                                <span className='box gray800-14'>
                                                    {publisherDetails.applicationFormUpdatedBy
                                                        ? yourApplicationFormPublisher
                                                        : 'No customisations made'}
                                                </span>
                                            </>
                                        )}
                                        <span className='box gray200-14'>{t('DAR.customise.lastUpdatedOn')}</span>
                                        <span className='box gray800-14'>
                                            {publisherDetails.applicationFormUpdatedOn
                                                ? moment(publisherDetails.applicationFormUpdatedOn).format('DD MMM YYYY HH:mm')
                                                : 'No customisations made'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showGuidanceModal && (
                <CustomiseDAREditGuidance
                    userState={userState}
                    publisherDetails={publisherDetails}
                    showConfirmPublishModal={showConfirmPublishModal}
                    setShowConfirmPublishModal={setShowConfirmPublishModal}
                    show={showGuidanceModal}
                    onHide={successMsg => {
                        if (successMsg) {
                            getModalData();

                            setCloseGuidanceMessage(successMsg);
                        }

                        setShowGuidanceModal(false);
                    }}
                />
            )}
        </>
    ) : (
        <LayoutContent>
            <div className='accountHeader'>Customise Data Access Request not enabled</div>
        </LayoutContent>
    );
};

CustomiseDAR.defaultProps = {
    defaultTab: 'customisedataaccessrequests_guidance',
    onSelectTab: () => {},
};

export default CustomiseDAR;
