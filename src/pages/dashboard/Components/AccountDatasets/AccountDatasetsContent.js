import pluralize from 'pluralize';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Box, Icon } from 'hdruk-react-core';

import { SearchControls } from 'components';
import { DATASETS_STATUS_ACTIVE, STATUS_ARCHIVE, STATUS_INREVIEW, STATUS_REJECTED } from '../../../../configs/constants';
import DatasetCard from '../../../commonComponents/DatasetCard';
import MessageNotFound from '../../../commonComponents/MessageNotFound';
import SearchResults from '../../../commonComponents/SearchResults';
import { ReactComponent as EyeIcon } from '../../../../images/eye.svg';

import '../../Dashboard.scss';

const options = ['latest', 'alphabetic', 'metadata'];
const optionsWithPublish = ['latest', 'alphabetic', 'metadata', 'recentlyadded'];

const AccountDatasetsContent = ({ data = [], onSubmit, onReset, isLoading, isFetched, status, params, teamType, count }) => {
    const { search, sortBy, sortDirection, maxResults } = params;

    const [searchValue, setSearchValue] = useState('');
    const [sortValue, setSortValue] = useState({
        value: sortBy,
        direction: sortDirection,
    });

    const history = useHistory();

    const { t } = useTranslation();

    const handleChange = useCallback(value => {
        setSearchValue(value);
    }, []);

    const getDatasetPath = id => `/account/datasets/${id}`;

    const handleActivityLogClick = id => {
        history.push(getDatasetPath(id));
    };

    const handleSort = useCallback(
        (data, submitForm) => {
            setSortValue(data);

            submitForm();
        },
        [searchValue]
    );

    useEffect(() => {
        setSearchValue(search);
    }, [search]);

    useEffect(() => {
        if (sortBy && sortDirection) {
            setSortValue({
                value: sortBy,
                direction: sortDirection,
            });
        }
    }, [sortBy, sortDirection]);

    const hasActivityHistory = useCallback(dataset => dataset.listOfVersions.length > 0 && teamType === 'admin', [teamType]);

    const getDatasetCardProps = dataset => {
        const datasetCardProps = {};

        if (dataset.activeflag === STATUS_INREVIEW && hasActivityHistory(dataset)) {
            datasetCardProps.slaProps = {
                icon: <Icon svg={<EyeIcon />} role='button' onClick={() => handleActivityLogClick(dataset.pid)} mr={1} />,
            };

            datasetCardProps.path = getDatasetPath(dataset.pid);
        } else if (dataset.activeflag === STATUS_REJECTED) {
            datasetCardProps.rejectionText = dataset.applicationStatusDesc;
            datasetCardProps.rejectionAuthor = dataset.applicationStatusAuthor;
        }

        return datasetCardProps;
    };

    let statusOptions = options;

    if (teamType !== 'admin' && (status === STATUS_ARCHIVE || status === DATASETS_STATUS_ACTIVE)) {
        statusOptions = optionsWithPublish;
    }

    return (
        <>
            {isFetched && (
                <SearchControls
                    type={t(`dataset.${status}`)}
                    onSubmit={onSubmit}
                    inputProps={{
                        onChange: handleChange,
                        value: searchValue,
                        onReset,
                    }}
                    sortProps={{
                        direction: sortValue.direction,
                        value: sortValue.value,
                        options: statusOptions,
                        allowDirection: true,
                        minWidth: '300px',
                        onSort: handleSort,
                    }}
                    mt={4}
                />
            )}

            <SearchResults
                data={data}
                errorMessage={({ type }) => (
                    <Box mt={2}>
                        <MessageNotFound word={pluralize(type)} />
                    </Box>
                )}
                results={data =>
                    data.map(dataset => (
                        <DatasetCard
                            key={dataset._id}
                            id={dataset._id}
                            title={dataset.name}
                            publisher={status !== STATUS_ARCHIVE && dataset.datasetv2.summary.publisher.name}
                            version={dataset.datasetVersion}
                            isDraft
                            datasetStatus={dataset.activeflag}
                            timeStamps={dataset.timestamps}
                            completion={dataset.percentageCompleted}
                            listOfVersions={dataset.listOfVersions}
                            {...getDatasetCardProps(dataset)}
                        />
                    ))
                }
                count={count}
                maxResults={maxResults}
                type='dataset'
                isLoading={isLoading}
                search={searchValue}
            />
        </>
    );
};

AccountDatasetsContent.defaultProps = {
    params: {
        search: '',
        sortBy: 'latest',
        sortDirection: 'desc',
    },
};

export default AccountDatasetsContent;
