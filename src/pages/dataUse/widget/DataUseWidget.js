import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/Button';
import Checkbox from '../../../components/Checkbox';
import { LayoutContent } from '../../../components/Layout';
import Typography from '../../../components/Typography';

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
                <Typography variant='h5'>{t(`datause.widget.heading`)}</Typography>
                <Typography>{t(`datause.widget.description`)}</Typography>
            </div>
            <div className='accountHeader'>
                <Typography variant='h5' data-testid='howToHeader'>
                    {t('datause.widget.howToHeader')}
                </Typography>
                <Typography mb={3}>{t('datause.widget.howToDesc')}</Typography>
                <Button mb={3} onClick={clickHandler} data-testid='getWidgetButton' type='button'>
                    {t('datause.widget.getWidgetButton')}
                </Button>

                <Typography mb={3}>{t('datause.widget.tAndCHelp')}</Typography>
                <Checkbox
                    variant='primary'
                    label='I agree to the HDR Widget Terms and Conditions of use'
                    id='termConditions'
                    mb={6}
                    disabled
                />
                <Typography variant='h6'>{t('datause.widget.heading')}</Typography>
                <Typography color='grey600'>
                    <i>{t('datause.widget.buttonHelp')}</i>
                </Typography>
            </div>
        </LayoutContent>
    );
};

export default DataUseWidget;
