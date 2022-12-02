import '@testing-library/jest-dom/extend-expect';
import { advanceTo, clear } from 'jest-date-mock';
import { testUtils } from '../../../../../test';
import * as SearchControls from '../../../../components/SearchControls';
import { STATUS_INREVIEW } from '../../../../configs/constants';
import { mockGetPublisher } from '../../../../services/dataset-onboarding/mockMsw';
import * as DatasetCard from '../../../commonComponents/DatasetCard';
import * as SearchResults from '../../../commonComponents/SearchResults';
import AccountDatasetsContent from './AccountDatasetsContent';

const mockOnSubmit = jest.fn();
const mockHistoryPush = jest.fn();

const searchResultsSpy = jest.spyOn(SearchResults, 'default');
const searchControlsSpy = jest.spyOn(SearchControls, 'default');
const datasetCardSpy = jest.spyOn(DatasetCard, 'default');

// jest.mock('../../../../components/Icon', () => ({ onClick }) => (
//     <span onClick={onClick} className='icon-mock'>
//         Icon
//     </span>
// ));

// jest.mock('../../../commonComponents/relatedObject/RelatedObject', () => <div />);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

const props = {
    data: [],
    onSubmit: mockOnSubmit,
    isLoading: true,
    isFetched: false,
    status: STATUS_INREVIEW,
    team: 'admin',
    count: 19,
    params: { search: 'covid', sortBy: 'latest', sortDirection: 'desc', maxResults: 1000 },
};

let wrapper;

describe('Given the AccountDatasetsContent component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            advanceTo(new Date(2022, 8, 14, 0, 0, 0));

            wrapper = testUtils.render(<AccountDatasetsContent {...props} />);
        });

        afterAll(() => {
            clear();
            Date.now();
        });

        it('The should call SearchResults with the correct arguments', () => {
            expect(searchResultsSpy.mock.calls[0][0]).toMatchObject({
                count: 19,
                data: [],
                isLoading: true,
            });
        });

        it('The should not call SearchControls with the correct arguments', () => {
            expect(searchControlsSpy).not.toHaveBeenCalled();
        });

        describe('And has data', () => {
            beforeAll(() => {
                jest.clearAllMocks();

                wrapper = testUtils.render(
                    <AccountDatasetsContent {...props} data={mockGetPublisher.data.results.listOfDatasets} isFetched isLoading={false} />
                );
            });

            it('Then matches the previous snapshot', () => {
                expect(wrapper.container).toMatchSnapshot();
            });

            it('Then handles input change', async () => {
                const input = wrapper.container.querySelector('input[name="search"]');

                await testUtils.fireEvent.change(input, {
                    target: {
                        value: 'dataset',
                    },
                });

                await testUtils.waitFor(() => expect(input.value).toEqual('dataset'));
            });

            it('The should call SearchResults with the correct arguments', () => {
                expect(searchResultsSpy.mock.calls[0][0]).toEqual({
                    count: 19,
                    data: mockGetPublisher.data.results.listOfDatasets,
                    isLoading: false,
                    search: '',
                    maxResults: 1000,
                    results: expect.any(Function),
                    errorMessage: expect.any(Function),
                    type: 'dataset',
                });
            });

            it('The should call Datasetcard with the correct arguments', () => {
                const {
                    _id: id,
                    name: title,
                    datasetv2: {
                        summary: {
                            publisher: { name: publisher },
                        },
                    },
                    datasetVersion: version,
                    activeflag: datasetStatus,
                    timestamps: timeStamps,
                    percentageCompleted: completion,
                    listOfVersions,
                } = mockGetPublisher.data.results.listOfDatasets[0];

                expect(datasetCardSpy.mock.calls[0][0]).toEqual({
                    id,
                    title,
                    publisher,
                    version,
                    datasetStatus,
                    timeStamps,
                    completion,
                    isDraft: true,
                    listOfVersions,
                });
            });

            describe('And status is inReview', () => {
                beforeAll(() => {
                    jest.clearAllMocks();

                    wrapper = testUtils.render(
                        <AccountDatasetsContent
                            {...props}
                            data={mockGetPublisher.data.results.listOfDatasets}
                            isFetched
                            isLoading={false}
                            status={STATUS_INREVIEW}
                        />
                    );
                });

                it('Then should change history onClick', async () => {
                    const sla = wrapper.container.querySelectorAll('.sla-icons .icon-mock')[0];

                    await testUtils.fireEvent.click(sla, '1234');

                    await testUtils.waitFor(() => expect(mockHistoryPush).toHaveBeenCalled());
                });

                it('Then should call Datasetcard with the correct arguments', () => {
                    const {
                        _id: id,
                        name: title,
                        datasetv2: {
                            summary: {
                                publisher: { name: publisher },
                            },
                        },
                        datasetVersion: version,
                        activeflag: datasetStatus,
                        timestamps: timeStamps,
                        percentageCompleted: completion,
                        listOfVersions,
                    } = mockGetPublisher.data.results.listOfDatasets[1];

                    expect(datasetCardSpy.mock.calls[1][0]).toEqual({
                        id,
                        title,
                        publisher,
                        version,
                        datasetStatus,
                        timeStamps,
                        completion,
                        isDraft: true,
                        listOfVersions,
                        path: '/account/datasets/0a048419-0796-46fb-ad7d-91e650a6c742',
                        slaProps: expect.any(Object),
                    });
                });
            });

            describe('And status is rejected', () => {
                beforeAll(() => {
                    jest.clearAllMocks();

                    wrapper = testUtils.render(
                        <AccountDatasetsContent
                            {...props}
                            data={mockGetPublisher.data.results.listOfDatasets}
                            isFetched
                            isLoading={false}
                            status='rejected'
                        />
                    );
                });

                it('The should call Datasetcard with the correct arguments', () => {
                    const {
                        _id: id,
                        name: title,
                        datasetv2: {
                            summary: {
                                publisher: { name: publisher },
                            },
                        },
                        datasetVersion: version,
                        activeflag: datasetStatus,
                        timestamps: timeStamps,
                        percentageCompleted: completion,
                        listOfVersions,
                    } = mockGetPublisher.data.results.listOfDatasets[2];

                    expect(datasetCardSpy.mock.calls[2][0]).toEqual({
                        id,
                        title,
                        publisher,
                        version,
                        datasetStatus,
                        timeStamps,
                        completion,
                        isDraft: true,
                        listOfVersions,
                        rejectionAuthor: 'Callum Reekie',
                        rejectionText: 'SDg',
                    });
                });
            });

            describe('And results are sorted', () => {
                beforeAll(() => {
                    const input = wrapper.container.querySelector('button');

                    testUtils.fireEvent.click(input);
                });

                it.skip('Then submits with the correct values', async () => {
                    const link = wrapper.container.querySelectorAll('a')[1];

                    testUtils.fireEvent.click(link);

                    await testUtils.waitFor(() =>
                        expect(mockOnSubmit.mock.calls[0][0]).toEqual({ search: 'covid', sortBy: 'alphabetic', sortDirection: 'desc' })
                    );
                });

                it.skip('Then submits with the correct sort direction', async () => {
                    const link = wrapper.container.querySelector('.btn-link');

                    testUtils.fireEvent.click(link);

                    await testUtils.waitFor(() =>
                        expect(mockOnSubmit.mock.calls[1][0]).toEqual({ search: 'covid', sortBy: 'alphabetic', sortDirection: 'asc' })
                    );
                });
            });
        });
    });
});
