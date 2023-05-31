import { useEffect } from 'react';
import _ from 'lodash';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Alert } from 'components';
import { datasetOnboardingService } from 'services';
import googleAnalytics from '../../../../tracking';

const AccountDatasetsCreate = ({ isFederated, isLoading, publisherID, teamType, alert: { message } }) => {
    const { t } = useTranslation();

    const dataPostDatasetOnboarding = datasetOnboardingService.usePostDatasetOnboarding(null, {
        enabled: false,
    });

    const createNewDataset = e => {
        e.preventDefault();

        dataPostDatasetOnboarding.mutateAsync({ publisherID });
    };

    useEffect(() => {
        if (dataPostDatasetOnboarding.data) {
            const {
                data: {
                    data: {
                        data: { id },
                    },
                },
            } = dataPostDatasetOnboarding;

            if (!_.isUndefined(id)) window.location.href = `/dataset-onboarding/${id}`;
        }
    }, [dataPostDatasetOnboarding.data]);

    return (
        <>
            {message && <Alert variant='success'>{message}</Alert>}
            <div className='accountHeader'>
                <Row>
                    <Col sm={12} md={8}>
                        <div>
                            <span className='black-20'>{t('datasets')}</span>
                        </div>
                        <div>
                            <span className='gray700-13 '>
                                {publisherID !== 'admin' ? t('dataset.create.description.admin') : t('dataset.create.description.user')}
                            </span>
                        </div>
                    </Col>
                    <Col sm={12} md={4} style={{ textAlign: 'right' }}>
                        {teamType !== 'admin' && !isFederated && !isLoading && (
                            <Button
                                variant='primary'
                                className='addButton'
                                onClick={e => {
                                    googleAnalytics.recordEvent('Datasets', 'Add a new dataset', 'Datasets dashboard button clicked');

                                    createNewDataset(e);
                                }}>
                                + {t('dataset.create.action')}
                            </Button>
                        )}
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default AccountDatasetsCreate;
