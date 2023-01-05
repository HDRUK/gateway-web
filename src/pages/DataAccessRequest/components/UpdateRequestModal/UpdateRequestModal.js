import { useHistory } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import { Modal } from 'react-bootstrap';
import { Button } from 'hdruk-react-core';

import { accountUtils } from 'utils';

import { baseURL } from '../../../../configs/url.config';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import './UpdateRequestModal.scss';
import googleAnalytics from '../../../../tracking';

const UpdateRequestModal = ({ open, close, fullAmendments, publisher, applicationId, projectName = '' }) => {
    const history = useHistory();

    const onHandleClose = e => {
        e.preventDefault();
        close();
    };

    const onRequestUpdate = e => {
        if (!_.isEmpty(applicationId) && !_.isEmpty(publisher)) {
            axios.post(`${baseURL}/api/v1/data-access-request/${applicationId}/requestAmendments`).then(() => {
                accountUtils.updateSelectedTeam({ teamType: 'team', teamId: publisher });

                const alert = {
                    publisher,
                    nav: 'dataaccessrequests',
                    tab: 'inReview',
                    message: `You have successfully requested updates to ‘${projectName}’ application`,
                };
                // redirect to dashboard with alert
                history.push({ pathname: `/account`, search: `?tab=dataaccessrequests`, state: { alert } });
            });
        }
    };

    return (
        <>
            <Modal show={open} onHide={close} size='lg' aria-labelledby='contained-modal-title-vcenter' centered className='updateRequest'>
                <div className='updateRequest-header'>
                    <div className='updateRequest-header--wrap'>
                        <div className='updateRequest-head'>
                            <h1 className='black-20-semibold'>Update answer request</h1>
                            <CloseButtonSvg className='updateRequest-head--close' onClick={e => onHandleClose(e)} />
                        </div>
                        <p>
                            Are you sure you want to request the following answers to be updated? The applicant will only be able to edit
                            the answers you selected.
                        </p>
                    </div>
                </div>
                <div className='updateRequest-body'>
                    {Object.keys(fullAmendments).map(section => (
                        <div key={section} className='request-wrap'>
                            <h6 className='black-16-semibold' data-spec='request-section-title'>
                                {section}
                            </h6>
                            {fullAmendments[section].map((item, i) => (
                                <div key={`item-${i}`} className='request-section' data-spec='request-section'>
                                    <>
                                        <div className='area'>Question:</div>
                                        <div className='area' data-spec='request-question'>
                                            {item.question}
                                        </div>
                                        <div className='area'>Answer:</div>
                                        <div className='area' data-spec='request-answer'>
                                            {item.answer}
                                        </div>
                                    </>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className='updateRequest-footer'>
                    <div className='updateRequest-footer--wrap'>
                        <Button onClick={e => onHandleClose(e)} variant='secondary' data-spec='btn-cancel'>
                            No, nevermind
                        </Button>
                        <Button
                            onClick={e => {
                                onRequestUpdate(e);
                                googleAnalytics.recordEvent('Data access request', 'Clicked request update', 'Custodian requested updates');
                            }}
                            data-spec='btn-submit'>
                            Request update
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default UpdateRequestModal;
