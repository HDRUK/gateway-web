import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/Button';
import Checkbox from '../../../components/Checkbox';
import { LayoutContent } from '../../../components/Layout';
import Typography, { H5, H6, P } from '../../../components/Typography';

const DataUseWidget = () => {
    const { t } = useTranslation();

    const [state, setState] = useState({
        showAcceptModal: false,
    });

    const clickHandler = () => {
        setState({ ...state, showAcceptModal: true });
    };

    return (
        <LayoutContent>
            <div className='accountHeader mb-3'>
                <H5>{t(`datause.widget.heading`)}</H5>
                <P>{t(`datause.widget.description`)}</P>
            </div>
            <div className='accountHeader'>
                <H5 data-testid='howToHeader'>{t('datause.widget.howToHeader')}</H5>
                <P mb={3}>{t('datause.widget.howToDesc')}</P>
                <Button mb={3} onClick={clickHandler} data-testid='getWidgetButton' type='button'>
                    {t('datause.widget.getWidgetButton')}
                </Button>

                <P mb={3}>{t('datause.widget.tAndCHelp')}</P>
                <Checkbox
                    variant='primary'
                    label='I agree to the HDR Widget Terms and Conditions of use'
                    id='termConditions'
                    mb={6}
                    disabled
                />
                <H6>{t('datause.widget.heading')}</H6>
                <P color='grey600'>
                    <i>{t('datause.widget.buttonHelp')}</i>
                </P>
            </div>
        </LayoutContent>
    );
};

export default DataUseWidget;
