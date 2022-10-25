import React from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Button, H5, ModalBody, ModalFooter, P } from 'hdruk-react-core';
import PropTypes from 'prop-types';
import '../AccountTeamEmailAlertModal/AccountTeamEmailAlertModal.scss';
import { teamNotificationsPropTypes } from 'types';
import { EmailList } from './AccountTeamNotificationsConfirmationModal.components';

const AccountTeamNotificationsConfirmationModal = ({ isOpen, onClose, onConfirm, teamNotifications }) => {
    const { t } = useTranslation();

    return (
        <Modal show={isOpen} onHide={() => onClose(false)}>
            <ModalBody>
                <H5 mb={2}>{t('components.AccountTeamNotificationsConfirmationModal.title')}</H5>
                <P>{t('components.AccountTeamNotificationsConfirmationModal.description')}</P>
                <EmailList notifications={teamNotifications} />
            </ModalBody>
            <ModalFooter>
                <Button variant='secondary' onClick={() => onClose(false)} mr={2}>
                    {t('buttons.neverMind')}
                </Button>
                <Button onClick={() => onConfirm(true)}>{t('buttons.saveUpdate')}</Button>
            </ModalFooter>
        </Modal>
    );
};

AccountTeamNotificationsConfirmationModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    teamNotifications: teamNotificationsPropTypes.isRequired,
};

AccountTeamNotificationsConfirmationModal.defaultProps = {
    isOpen: false,
};

export default AccountTeamNotificationsConfirmationModal;
