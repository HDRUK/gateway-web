import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Button, H5, ModalBody, ModalFooter, P } from 'hdruk-react-core';
import PropTypes from 'prop-types';
import '../AccountTeamEmailAlertModal/AccountTeamEmailAlertModal.scss';
import { teamGatewayNotificationsPropTypes } from 'types';
import EmailList from './AccountTeamNotificationsConfirmationModal.components';

const AccountTeamNotificationsConfirmationModal = ({ open, close, confirm, teamNotifications }) => {
    const { t } = useTranslation();

    return (
        <Modal open={open} onClose={() => close(false)}>
            <ModalBody>
                <H5 mb={2}>{t('components.AccountTeamNotificationsConfirmationModal.title')}</H5>
                <P>{t('components.AccountTeamNotificationsConfirmationModal.description')}</P>
                <EmailList notifications={teamNotifications} />
            </ModalBody>
            <ModalFooter>
                <Button variant='secondary' onClick={() => {}} mr={2}>
                    {t('buttons.neverMind')}
                </Button>
                <Button onClick={() => confirm(true)}>{t('buttons.saveUpdate')}</Button>
            </ModalFooter>
        </Modal>
    );
};

AccountTeamNotificationsConfirmationModal.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    teamNotifications: teamGatewayNotificationsPropTypes.isRequired,
};

AccountTeamNotificationsConfirmationModal.defaultProps = {
    open: false,
};

export default AccountTeamNotificationsConfirmationModal;
