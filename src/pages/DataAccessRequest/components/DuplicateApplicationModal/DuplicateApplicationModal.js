import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';

import { Alert } from 'components';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import SVGIcon from '../../../../images/SVGIcon';
import { baseURL } from '../../../../configs/url.config';
import DarHelperUtil from '../../../../utils/DarHelper.util';

import SLA from '../../../commonComponents/sla/SLA';
import TimeDuration from '../../../commonComponents/timeDuration/TimeDuration';
import './DuplicateApplicationModal.scss';

const DuplicateApplicationModal = ({ isOpen, closeModal, duplicateApplication, showDatasetModal, appToCloneId }) => {
    const [applicationsToCloneInto, setApplicationsToCloneInto] = useState([]);
    const [isNewApplication, setIsNewApplication] = useState(false);
    const [applicationId, setApplicationId] = useState(null);

    useEffect(() => {
        axios.get(`${baseURL}/api/v1/data-access-request?applicationStatus=inProgress`).then(res => {
            const appInProgressToCloneInto = res.data.data.filter(app => app._id !== appToCloneId);
            setApplicationsToCloneInto(appInProgressToCloneInto);
        });
    }, []);

    const onCloseModal = () => {
        resetModalState();
        closeModal();
    };

    const onShowDatasetModal = () => {
        resetModalState();
        showDatasetModal();
    };

    const resetModalState = () => {
        setIsNewApplication(false);
        setApplicationId(null);
    };

    return (
        <Modal show={isOpen} onHide={onCloseModal} centered className='duplicateApplicationModal'>
            <div className='duplicateApplicationModal-header'>
                <h1 className='black-20-semibold'>Duplicate application</h1>
                <CloseButtonSvg className='duplicateApplicationModal-header--close' onClick={onCloseModal} />
                <div className='duplicateApplicationModal-header-description'>
                    You can copy the answers of your application into a new application or select an exisiting pre-submission application.
                    Only applications with matching form processes will be available to duplicate into. All applicants and contributors will
                    be notified of this duplication.
                </div>
                <Alert variant='warning' mt={6}>
                    By selecting a pre-submission application, any already existing answers will be overridden.
                </Alert>
            </div>
            <div className='duplicateApplicationModal-body'>
                <div className='duplicateApplicationModal-body-applications'>
                    {isNewApplication ? (
                        <button className='duplicateApplicationModal-body-newappbuttonselected'>
                            <SVGIcon className='newAppButtonIcon' name='check' width={51} height={51} fill=' #3db28c' />
                            <div className='newAppButtonText'>Create new application</div>
                        </button>
                    ) : (
                        <button
                            className='duplicateApplicationModal-body-newappbutton'
                            onClick={() => {
                                setIsNewApplication(true);
                                setApplicationId(null);
                            }}>
                            <SVGIcon className='newAppButtonIcon' name='plusChunky' width={20} height={20} fill='#475da7' />
                            <div className='newAppButtonText'>Create new application</div>{' '}
                        </button>
                    )}

                    {applicationsToCloneInto.map((request, i) => {
                        const {
                            datasets = [],
                            updatedAt,
                            applicants = '',
                            publisher = '',
                            dateSubmitted = new Date(),
                            projectName = '',
                            _id,
                            createdAt,
                        } = request;
                        return (
                            <div
                                key={`request_${i}`}
                                className={`duplicateApplicationModal-body-presubmittedappbutton ${
                                    applicationId === _id ? 'active-duplicate' : ''
                                }`}
                                onClick={() => {
                                    setApplicationId(_id);
                                    setIsNewApplication(false);
                                }}>
                                <div className='duplicateApplicationModal-body-presubmittedappbutton-header'>
                                    <div className='title'>
                                        <h1>{projectName}</h1>
                                    </div>
                                    <div className='status'>
                                        {renderDuration(createdAt)}
                                        <SLA
                                            classProperty={DarHelperUtil.darStatusColours[request.applicationStatus]}
                                            text={DarHelperUtil.darSLAText[request.applicationStatus]}
                                        />
                                    </div>
                                </div>

                                <div className='duplicateApplicationModal-body-presubmittedappbutton-body'>
                                    <div className='box-header'>Datasets</div>
                                    <div className='box-field'>
                                        {datasets.map((d, i) => {
                                            return <SLA key={i} classProperty='default' text={d.name} />;
                                        })}
                                    </div>
                                    <div className='box-header'>Custodian</div>
                                    <div className='box-field'>{publisher}</div>
                                    <div className='box-header'>Applicants</div>
                                    <div className='box-field'>{!_.isEmpty(applicants) ? applicants : '-'}</div>
                                    <div className='box-header'>Submitted</div>
                                    <div className='box-field'>
                                        {!_.isEmpty(dateSubmitted) ? moment(dateSubmitted).format('D MMMM YYYY') : '-'}
                                    </div>
                                    <div className='box-header'>Last activity</div>
                                    <div className='box-field'>{moment(updatedAt).format('D MMMM YYYY HH:mm')}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className='duplicateApplicationModal-footer'>
                <div className='duplicateApplicationModal-footer--wrap'>
                    <button className='button-tertiary' onClick={onCloseModal}>
                        Cancel
                    </button>
                    <button
                        disabled={applicationId == null && !isNewApplication}
                        className='button-primary'
                        onClick={e => {
                            isNewApplication ? onShowDatasetModal() : duplicateApplication(applicationId, []);
                        }}>
                        Duplicate application
                    </button>
                </div>
            </div>
        </Modal>
    );
};

const renderDuration = createdAt => {
    let diff = 0;
    const start = moment(createdAt);
    const end = moment();
    diff = end.diff(start, 'days');
    return <TimeDuration text={`${diff} days since start`} />;
};

export default DuplicateApplicationModal;
