import { useCallback, useState } from 'react';
import { OverlayTrigger, Tooltip, Row, Button, Accordion } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import moment from 'moment';

import { datasetOnboardingHelperUtils } from 'utils';
import SVGIcon from '../../images/SVGIcon';

import SLA from './sla/SLA';
import TimeDuration from './timeDuration/TimeDuration';
import CommentItem from '../dashboard/DataAccessRequests/CommentItem/CommentItem';
import StatusDisplay from './StatusDisplay';
import './DatasetCard.scss';

const completionList = {
    Summary: 'summary',
    Documentation: 'documentation',
    Coverage: 'coverage',
    Provenance: 'provenance',
    Accessibility: 'accessibility',
    Enrichment: 'enrichmentAndLinkage',
    Observations: 'observations',
    'Structural Meta Data': 'structural',
};

const DatasetCard = props => {
    const {
        id,
        publisher,
        title,
        version,
        datasetStatus,
        completion = {},
        timeStamps = {},
        rejectionText,
        rejectionAuthor,
        listOfVersions,
        path,
        slaProps,
    } = props;
    const [flagClosed, setFlagClosed] = useState(true);

    const handleClick = useCallback(() => {
        window.location.href = path || `/dataset-onboarding/${id}`;
    }, [id]);

    return (
        <Row key={`dataset_card_${title}`} onClick={handleClick}>
            <div className='col-md-12'>
                <div className='layoutCard mb-0'>
                    <div className='datasetHeader mb-0 mt-2'>
                        <div className='datasetHeader-title'>
                            <h1>{title}</h1>
                        </div>
                        <div className='datasetHeader-status'>
                            {datasetStatus === 'draft' ? (
                                <TimeDuration
                                    text={`${datasetOnboardingHelperUtils.calculateTimeDifference(timeStamps.created)} days since start`}
                                />
                            ) : (
                                ''
                            )}
                            {datasetStatus === 'inReview' ? (
                                <TimeDuration
                                    text={`${datasetOnboardingHelperUtils.calculateTimeDifference(
                                        timeStamps.submitted
                                    )} days since submission`}
                                />
                            ) : (
                                ''
                            )}

                            <SLA
                                classProperty={datasetOnboardingHelperUtils.datasetStatusColours[datasetStatus]}
                                text={datasetOnboardingHelperUtils.datasetSLAText[datasetStatus]}
                                {...slaProps}
                            />

                            {datasetStatus === 'draft' && listOfVersions.find(version => version.activeflag === 'active') ? (
                                <>
                                    &nbsp;&nbsp;
                                    <SLA
                                        classProperty={datasetOnboardingHelperUtils.datasetStatusColours.active}
                                        text={datasetOnboardingHelperUtils.datasetSLAText.active}
                                        {...slaProps}
                                    />
                                </>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <div className='dataset-completion-wheels'>
                        {!isEmpty(completion)
                            ? Object.keys(completionList).map(key => (
                                  <OverlayTrigger
                                      key={key}
                                      placement='top'
                                      overlay={
                                          <Tooltip id='tooltip-top'>
                                              {key}: {completion[completionList[key]]}
                                          </Tooltip>
                                      }>
                                      <div>
                                          <StatusDisplay section={key} status={completion[completionList[key]]} />
                                      </div>
                                  </OverlayTrigger>
                              ))
                            : null}
                    </div>

                    <div className='body'>
                        <>
                            <div className='box'>Publisher</div>
                            <div className='box'>{publisher}</div>
                            <div className='box version-list'>Version</div>

                            {listOfVersions.length > 1 ? (
                                <div className='box'>
                                    <Accordion defaultActiveKey='1' style={{ width: '100%' }}>
                                        <Accordion.Toggle
                                            as={Button}
                                            variant='link'
                                            eventKey='0'
                                            onClick={e => {
                                                e.stopPropagation();
                                                setFlagClosed(!flagClosed);
                                            }}
                                            data-testid='accordion-toggle'
                                            style={{ width: '100%', padding: '0px', border: '0px' }}
                                            className='version-list'>
                                            <div className='version-list'>
                                                {version}
                                                {datasetStatus === 'draft' ? ' (Draft)' : ''}
                                                {datasetStatus === 'inReview' ? ' (Pending)' : ''}
                                                <SVGIcon
                                                    name='chevronbottom'
                                                    fill='#475da7'
                                                    style={{ width: '18px', height: '18px', paddingLeft: '4px' }}
                                                    className={flagClosed === true ? 'svg-24' : 'svg-24 flipSVG'}
                                                />
                                            </div>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey='0' style={{ paddingRight: '20px' }}>
                                            <>
                                                {listOfVersions.map(datasetVersion =>
                                                    datasetVersion.datasetVersion !== version ? (
                                                        <a
                                                            key={datasetVersion._id}
                                                            href='#'
                                                            className='version-list'
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                window.location.href = `/dataset-onboarding/${datasetVersion._id}`;
                                                            }}>
                                                            {datasetVersion.datasetVersion}
                                                            {datasetVersion.activeflag === 'draft' ? ' (Draft)' : ''}
                                                            {datasetVersion.activeflag === 'active' ? ' (Live)' : ''}
                                                            {datasetVersion.activeflag === 'rejected' ? ' (Rejected)' : ''}
                                                            {datasetVersion.activeflag === 'inReview' ? ' (Pending)' : ''}
                                                        </a>
                                                    ) : null
                                                )}
                                            </>
                                        </Accordion.Collapse>
                                    </Accordion>
                                </div>
                            ) : (
                                <div className='box'>
                                    {version}
                                    {datasetStatus === 'draft' ? ' (Draft)' : ''}
                                </div>
                            )}
                            <div className='box'>Last activity</div>
                            <div className='box'>
                                {!isEmpty(timeStamps.updated) ? moment(timeStamps.updated).format('D MMMM YYYY HH:mm') : '-'}
                            </div>
                        </>
                    </div>
                    {datasetStatus === 'rejected' ? (
                        <CommentItem
                            text={rejectionText}
                            title='Reason for rejection'
                            subtitle={rejectionAuthor || 'HDR Admin'}
                            decisionDate={moment(timeStamps.rejected).format('D MMMM YYYY HH:mm')}
                        />
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </Row>
    );
};

export default DatasetCard;
