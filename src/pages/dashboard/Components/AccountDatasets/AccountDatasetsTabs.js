import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { DATASETS_STATUS_ACTIVE, STATUS_ARCHIVE, STATUS_INREVIEW, STATUS_REJECTED } from '../../../../configs/constants';
import '../../Dashboard.scss';

const AccountDatasetsTabs = ({ counts = { inReview: 0, active: 0, rejected: 0, archive: 0 }, teamType, onSelectTab, activeKey }) => {
    const { t } = useTranslation();

    const activeAndDraft = () => {
        const activeCount = Number.isInteger(counts.active) ? counts.active : 0;
        const draftCount = Number.isInteger(counts.draft) ? counts.draft : 0;

        if (activeKey === 'active') return activeCount;

        return activeCount + draftCount;
    };

    return (
        <div className='tabsBackground mb-0'>
            <Row>
                <Col sm={12} lg={12}>
                    {teamType === 'admin' ? (
                        <Tabs className='dataAccessTabs gray700-13' activeKey={activeKey} onSelect={onSelectTab}>
                            <Tab
                                eventKey={STATUS_INREVIEW}
                                title={t('tabs.counts.inReview', {
                                    count: counts.inReview,
                                })}>
                                {' '}
                            </Tab>
                        </Tabs>
                    ) : (
                        <Tabs className='dataAccessTabs gray700-13' activeKey={activeKey} onSelect={onSelectTab}>
                            <Tab
                                eventKey={DATASETS_STATUS_ACTIVE}
                                title={t('tabs.counts.active', {
                                    count: activeAndDraft(),
                                })}>
                                {' '}
                            </Tab>
                            <Tab
                                eventKey={STATUS_INREVIEW}
                                title={t('tabs.counts.inReview', {
                                    count: counts[STATUS_INREVIEW],
                                })}>
                                {' '}
                            </Tab>
                            <Tab
                                eventKey={STATUS_REJECTED}
                                title={t('tabs.counts.rejected', {
                                    count: counts[STATUS_REJECTED],
                                })}>
                                {' '}
                            </Tab>
                            <Tab
                                eventKey={STATUS_ARCHIVE}
                                title={t('tabs.counts.archive', {
                                    count: counts[STATUS_ARCHIVE],
                                })}>
                                {' '}
                            </Tab>
                        </Tabs>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default AccountDatasetsTabs;
