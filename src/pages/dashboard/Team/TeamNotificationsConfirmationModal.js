import React from 'react';
import { isEmpty } from 'lodash';
import { Modal } from 'react-bootstrap';
import { Button } from 'hdruk-react-core';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import './TeamEmailAlertModal.scss';

const TeamNotificationsConfirmationModal = ({ open, close, confirm, teamNotifications }) => {
    const buildEmailList = () => {
        if (!isEmpty(teamNotifications)) {
            return teamNotifications.map((notification, i) => {
                const { subscribedEmails = [], notificationType = '' } = notification;
                if (!isEmpty(subscribedEmails)) {
                    return (
                        <div className='teamEmails' key={`teamEmail-${notificationType}-${i}`}>
                            <div className='teamEmails-label'>Team Email</div>
                            <div className='teamEmails-body'>
                                {subscribedEmails.map((obj, i) => `${obj.value}${i === subscribedEmails.length - 1 ? '' : ','} `)}
                            </div>
                        </div>
                    );
                }
                return '';
            });
        }
    };

    return (
        <>
            <Modal
                show={open}
                onHide={() => close(false)}
                aria-labelledby='contained-modal-title-vcenter'
                centered
                className='teamNotificationsConfirmationEmail'>
                <div className='teamNotificationsConfirmationEmail-header'>
                    <h1 className='black-20-semibold'>Email notifications</h1>
                    <CloseButtonSvg className='deleteDraftModal-header--close' onClick={() => close(false)} />
                </div>
                <div className='teamNotificationsConfirmationEmail-body'>
                    <div>
                        Are you sure you want to save your update to email notifications? Please make sure any team email addresses you have
                        entered are correct.
                    </div>
                    {buildEmailList()}
                </div>
                <div className='teamNotificationsConfirmationEmail-footer'>
                    <div className='teamNotificationsConfirmationEmail-footer--wrap'>
                        <Button variant='secondary' className='techDetailButton mr-2' onClick={() => close(false)}>
                            No, nevermind
                        </Button>
                        <Button onClick={() => confirm(true)}>Save update</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default TeamNotificationsConfirmationModal;
