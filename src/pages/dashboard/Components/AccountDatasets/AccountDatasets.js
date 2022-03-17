import reduce from 'lodash/reduce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { LayoutContent } from '../../../../components/Layout';
import useSearch from '../../../../components/Search/useSearch';
import { DATASETS_STATUS_ACTIVE, STATUS_INREVIEW } from '../../../../configs/constants';
import { useAuth } from '../../../../context/AuthContext';
import serviceDatasetOnboarding from '../../../../services/dataset-onboarding/dataset-onboarding';
import googleAnalytics from '../../../../tracking';
import utils from '../../../../utils/DataSetHelper.util';
import '../../Dashboard.scss';
import AccountDatasetsCreate from '../AccountDatasetsCreate';
import AccountDatasetsContent from './AccountDatasetsContent';
import AccountDatasetsTabs from './AccountDatasetsTabs';

const AccountDatasets = props => {
    const [key, setKey] = useState(props.alert ? props.alert.tab : '');
    const [statusCounts, setStatusCounts] = useState({});
    const { userState } = useAuth();
    const [publisherID, setPublisherId] = useState();

    const { team } = props;

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
        serviceDatasetOnboarding.useGetPublisher(publisherID),
        searchOptions
    );

    const handleSelect = key => {
        setKey(key);
    };

    const handleSubmit = React.useCallback(
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

    const handleReset = React.useCallback(submitForm => {
        submitForm();
    }, []);

    useEffect(() => {
        setPublisherId(utils.getPublisherID(userState[0], team));
        setKey(team === 'admin' ? STATUS_INREVIEW : props.alert.tab || DATASETS_STATUS_ACTIVE);
    }, [team]);

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
        ({ isLoading, isFetched, datasets, params, team, count }) => (
            <AccountDatasetsContent
                isLoading={isLoading}
                isFetched={isFetched}
                data={datasets}
                onSubmit={handleSubmit}
                onReset={handleReset}
                team={team}
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
                <AccountDatasetsCreate publisherID={publisherID} alert={props.alert} team={team} />

                {isFetched && <AccountDatasetsTabs counts={statusCounts} onSelectTab={handleSelect} team={team} activeKey={key} />}

                <AccountDatasetsResults
                    isLoading={isLoading}
                    isFetched={isFetched}
                    datasets={(data && data.data.data.results.listOfDatasets) || []}
                    params={params}
                    team={team}
                    count={statusCounts[key]}
                />
            </LayoutContent>
        </div>
    );
};

export default AccountDatasets;
