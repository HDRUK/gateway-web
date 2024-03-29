/** @jsxImportSource @emotion/react */
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { Button } from 'hdruk-react-core';

import { LayoutBox, Typography, ModalBody, ModalFooter, ModalHeader, Modal, RenderMarkdown } from 'components';

import legalText from './TermsAndConditions';
import * as styles from './AcceptModal.styles';

const AcceptModal = ({ open, onClose, onAccept }) => {
    const { t } = useTranslation();
    const [disableAcceptStatus, setAcceptStatus] = useState(true);
    const listInnerRef = useRef();

    const onScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

            if (scrollTop + clientHeight >= scrollHeight - (scrollHeight / 100) * 5) {
                setAcceptStatus(false);
            } else {
                setAcceptStatus(true);
            }
        }
    };

    useEffect(() => {
        if (open) {
            setAcceptStatus(true);
        }
    }, [open]);

    return (
        <Modal open={open} onClose={onClose} dismissable>
            <ModalHeader>
                HEALTH DATA RESEARCH UK
                <Typography variant='h6' mb={0}>
                    {t('datause.widget.heading')}
                </Typography>
            </ModalHeader>
            <ModalBody>
                <div onScroll={onScroll} ref={listInnerRef} css={styles.markdown}>
                    <RenderMarkdown source={legalText} className='react-markdown' />
                </div>
            </ModalBody>
            <ModalFooter>
                <LayoutBox flexGrow='1'>
                    <Button variant='tertiary' data-testid='cancel-button' onClick={onClose}>
                        {t('datause.widget.modal.cancel')}
                    </Button>
                </LayoutBox>
                <Button disabled={disableAcceptStatus} type='submit' data-testid='accept-button' onClick={onAccept}>
                    {t('datause.widget.modal.accept')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

AcceptModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAccept: PropTypes.func.isRequired,
};

export default AcceptModal;
