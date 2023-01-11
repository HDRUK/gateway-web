import reduce from 'lodash/reduce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';

import { authUtils } from 'utils';
import { LayoutContent } from 'components';
import { useSearch } from 'hooks';
import { datasetOnboardingService } from 'services';

import { DATASETS_STATUS_ACTIVE, STATUS_INREVIEW } from '../../../../configs/constants';
import { useAuth } from '../../../../context/AuthContext';
import { useDashboard } from '../../../../context/DashboardContext';
import googleAnalytics from '../../../../tracking';
import '../../Dashboard.scss';
import AccountDatasetsCreate from '../AccountDatasetsCreate';
import AccountDatasetsContent from './AccountDatasetsContent';
import AccountDatasetsTabs from './AccountDatasetsTabs';

const AccountDatasets = ({ alert, teamType, teamId }) => {
    const [key, setKey] = useState(alert ? alert.tab : '');
    const [statusCounts, setStatusCounts] = useState({});
    const { userState } = useAuth();
    const { isFederated, isLoading: isDashboardLoading } = useDashboard();
    const [publisherID, setPublisherId] = useState();

    const searchOptions = useMemo(
        () => ({
            initialParams: {
                limit: 1000,
                search: '',
                sortBy: 'latest',
                sortDirection: 'desc',
                page: 1,
            },
        }),
        [key]
    );

    const { isLoading, isFetched, isError, data, params, getResults, getCachedResults, getCache } = useSearch(
        datasetOnboardingService.useGetPublisher(publisherID),
        searchOptions
    );

    const handleSelect = key => {
        setKey(key);
    };

    const handleSubmit = useCallback(
        ({ search, sortBy, sortDirection }) => {
            getResults(
                {
                    search,
                    sortBy,
                    sortDirection,
                    status: key,
                    page: 1,
                },
                key
            );

            googleAnalytics.recordEvent(
                'Datasets',
                `Searched in account datasets for ${search} ordered by ${sortBy} ${sortDirection}`,
                'Account datasets search changed'
            );
        },
        [key, publisherID]
    );

    const handleReset = useCallback(submitForm => {
        submitForm();
    }, []);

    useEffect(() => {
        setPublisherId(authUtils.getPublisherId(userState[0], teamId, teamType));
        setKey(teamType === 'admin' ? STATUS_INREVIEW : alert.tab || DATASETS_STATUS_ACTIVE);
    }, [teamId, teamType]);

    useEffect(() => {
        if (publisherID && key) {
            getCachedResults(
                {
                    status: key,
                },
                key
            );
        }
    }, [publisherID, key]);

    useEffect(() => {
        if (data) {
            const reducedValues = reduce(
                getCache(),
                (original, { data }, tab) => {
                    original[tab] = data.data.results.total;
                    return original;
                },
                {}
            );

            setStatusCounts({
                ...data.data.data.publisherTotals,
                ...reducedValues,
                [key]: data.data.data.results.total,
            });
        }
    }, [data]);

    const AccountDatasetsResults = useCallback(
        ({ isLoading, isFetched, datasets, params, teamType, count }) => (
            <AccountDatasetsContent
                isLoading={isLoading}
                isFetched={isFetched}
                data={datasets}
                onSubmit={handleSubmit}
                onReset={handleReset}
                teamType={teamType}
                params={params}
                status={key}
                count={count}
            />
        ),
        [key]
    );

    if (isError) {
        NotificationManager.error('Unable to find data', 'Error', 10000);
    }

    return (
        <div>
            <LayoutContent>
                <AccountDatasetsCreate
                    isFederated={isFederated}
                    isLoading={isDashboardLoading}
                    publisherID={publisherID}
                    alert={alert}
                    teamType={teamType}
                />

                {isFetched && <AccountDatasetsTabs counts={statusCounts} onSelectTab={handleSelect} teamType={teamType} activeKey={key} />}

                <AccountDatasetsResults
                    isLoading={isLoading}
                    isFetched={isFetched}
                    datasets={(data && data.data.data.results.listOfDatasets) || []}
                    params={params}
                    teamType={teamType}
                    count={statusCounts[key]}
                />
            </LayoutContent>
        </div>
    );
};

export default AccountDatasets;
