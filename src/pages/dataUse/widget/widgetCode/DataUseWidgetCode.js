/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Typography from '../../../../components/Typography';
import Button from '../../../../components/Button';
import styles from './DataUseWidgetCode.styles';
import LayoutBox from '../../../../components/LayoutBox';

const DataUseWidgetCode = ({ codeString, copyToClipBoard }) => {
    const { t } = useTranslation();
    const tooltip = <Tooltip id='tooltip'>{t('datause.widget.copyCodeClipBoard')}</Tooltip>;
    return (
        <div>
            <Typography variant='h6' mb={4}>
                {t('datause.widget.copyCodeHelp')}
            </Typography>{' '}
            <div css={styles}>
                <pre>
                    <code>{codeString}</code>
                </pre>
            </div>
            <OverlayTrigger placement='bottom' overlay={tooltip} trigger='click'>
                <LayoutBox display='flex' justifyContent='flex-end'>
                    <Button onClick={copyToClipBoard} type='button' mt={2}>
                        {t('datause.widget.copyCodeButton')}
                    </Button>
                </LayoutBox>
            </OverlayTrigger>
        </div>
    );
};

DataUseWidgetCode.propTypes = {
    codeString: PropTypes.string.isRequired,
    copyToClipBoard: PropTypes.func.isRequired,
};

export default DataUseWidgetCode;
