/** @jsxImportSource @emotion/react */
import groupBy from 'lodash/groupBy';
import PropTypes from 'prop-types';
import { Suspense } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { BlockQuote, ListInfo, Timeline } from 'components';
import { datasetOnboardingHelperUtils } from 'utils';

import approved from '../../../../images/Application_approved.svg';
import rejected from '../../../../images/Application_rejected.svg';
import updated from '../../../../images/Updates_requested.svg';
import versionCreated from '../../../../images/Versions_created.svg';
import { dateFormats } from '../../../../utils/General.util';

import SLA from '../../../commonComponents/sla/SLA';
import * as styles from './ActivityLogCard.styles';

const eventStatusIcons = {
    newDatasetVersionSubmitted: versionCreated,
    datasetVersionApproved: approved,
    datasetVersionRejected: rejected,
    datasetVersionArchived: updated,
    datasetVersionUnarchived: updated,
    datasetUpdatesSubmitted: updated,
};

const ActivityLogCard = props => {
    const { t } = useTranslation();
    const {
        versionNumber,
        meta: { applicationStatus, dateSubmitted },
        events,
        mb,
    } = props;

    const groupedEvents = groupBy(events, ({ timestamp }) => {
        return dateFormats(timestamp).dateOnly;
    });

    return (
        <Suspense fallback={t('loading')}>
            <Row>
                <div className='col-md-12'>
                    <div className='layoutCard'>
                        <div css={styles.activityCard}>
                            <Row css={styles.activityLog(mb)}>
                                <Col sm={6} lg={6} data-testid='version-title'>
                                    <h1>{`Version ${versionNumber}`}</h1>
                                    <span className='gray800-14'>
                                        {t('datetime.submitted', { datetime: dateFormats(dateSubmitted).dateOnly })}
                                    </span>
                                </Col>
                                <Col sm={6} lg={6}>
                                    <span css={styles.applicationStatus} data-testid='status'>
                                        <SLA
                                            classProperty={datasetOnboardingHelperUtils.datasetStatusColours[applicationStatus]}
                                            text={datasetOnboardingHelperUtils.datasetSLAText[applicationStatus]}
                                        />
                                    </span>
                                </Col>
                            </Row>

                            {Object.keys(groupedEvents).map(key => {
                                return (
                                    <div>
                                        <h3 className='mb-3'>{key}</h3>
                                        <Timeline
                                            data={groupedEvents[key].map((event, index) => {
                                                const dateTime = dateFormats(event.timestamp);
                                                const commentTitle =
                                                    event.eventType === 'datasetVersionRejected'
                                                        ? t('activitylog.rejection')
                                                        : t('comment');

                                                return {
                                                    icon: (
                                                        <img
                                                            src={eventStatusIcons[event.eventType]}
                                                            data-testid={`${index}-${event.eventType}`}
                                                            alt='Icon'
                                                        />
                                                    ),
                                                    time: dateTime.timeOnly,
                                                    content: (
                                                        <div>
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: t(event.eventType, {
                                                                        versionNumber: event.version.replace(/\..*$/, ''),
                                                                        ...event.userDetails,
                                                                    }),
                                                                }}
                                                                className='mb-3'
                                                            />
                                                            {event.adminComment && (
                                                                <BlockQuote>
                                                                    <h6 className='mb-3 gray800'>{commentTitle}</h6>
                                                                    <p className='mb-0'>{event.adminComment}</p>
                                                                </BlockQuote>
                                                            )}
                                                            {event.datasetUpdates &&
                                                                event.datasetUpdates.map((item, i) => {
                                                                    const log = datasetOnboardingHelperUtils.getUpdatesSubmittedLog(item);

                                                                    return (
                                                                        <div data-testid={`event-detailed-text-${index}-${i}`}>
                                                                            <BlockQuote>
                                                                                <h6 className='mb-3 gray800'>{log.heading}</h6>
                                                                                <ListInfo
                                                                                    data={[
                                                                                        {
                                                                                            label: t('question'),
                                                                                            value: log.question,
                                                                                        },
                                                                                        {
                                                                                            label: t('previousAnswer'),
                                                                                            value: log.answers.previousAnswer,
                                                                                        },
                                                                                        {
                                                                                            label: t('updatedAnswer'),
                                                                                            value: log.answers.updatedAnswer,
                                                                                        },
                                                                                    ]}
                                                                                />
                                                                            </BlockQuote>
                                                                        </div>
                                                                    );
                                                                })}
                                                        </div>
                                                    ),
                                                };
                                            })}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Row>
        </Suspense>
    );
};

ActivityLogCard.defaultProps = {
    mb: 20,
};

ActivityLogCard.propTypes = {
    versionNumber: PropTypes.string.isRequired,
    meta: PropTypes.shape({
        dateSubmitted: PropTypes.string,
        dateCreated: PropTypes.string,
        applicationStatus: PropTypes.string,
    }).isRequired,
    events: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            eventType: PropTypes.string.isRequired,
            logType: PropTypes.string.isRequired,
            timestamp: PropTypes.string.isRequired,
            user: PropTypes.string.isRequired,
            userDetails: PropTypes.shape({
                firstName: PropTypes.string,
                lastName: PropTypes.string,
                role: PropTypes.string,
            }).isRequired,
            version: PropTypes.string.isRequired,
            versionId: PropTypes.string.isRequired,
            userTypes: PropTypes.arrayOf(PropTypes.string),
            adminComment: PropTypes.string.isRequired,
            datasetUpdates: PropTypes.arrayOf(
                PropTypes.objectOf(
                    PropTypes.shape({
                        previousAnswer: PropTypes.string,
                        updatedAnswer: PropTypes.string,
                    })
                )
            ),
        })
    ).isRequired,
    mb: PropTypes.string,
};

export default ActivityLogCard;
