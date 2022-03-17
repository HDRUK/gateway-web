import { render, waitFor } from '@testing-library/react';
import React from 'react';
import reactRouterDom from 'react-router-dom';
import AccountDataset from '.';
import { server } from '../../../../services/mockServer';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Redirect: props => {
        mockRedirect(props);
        return null;
    },
}));

jest.mock('../../../commonComponents/DatasetCard', () => props => {
    mockDatasetCard(props);
    return <div />;
});

jest.mock('../ActivityLogCard', () => props => {
    mockActivityLogCard(props);
    return <div />;
});

jest.mock('../../../../components/Icon', () => 'Icon');

const mockDatasetCard = jest.fn();
const mockActivityLogCard = jest.fn();
const mockPush = jest.fn();
const mockRedirect = jest.fn();

const props = {
    location: {},
};

let wrapper;

describe('Given the AccountDataset component', () => {
    beforeAll(() => {
        server.listen();

        jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({
            push: mockPush,
        }));
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });

    describe('When it is rendered', () => {
        beforeAll(() => {
            jest.spyOn(reactRouterDom, 'useParams').mockReturnValue({
                id: 'd5c99a71-c039-4a0b-9171-dba8a1c33154',
            });

            wrapper = render(<AccountDataset {...props} />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then shows a loader', async () => {
            await waitFor(() => expect(wrapper.getByText('Loading...')).toBeTruthy());
        });

        it('Then calls the ActivityLogCard the correct number of times', async () => {
            await waitFor(() => expect(mockActivityLogCard).toHaveBeenCalledTimes(4));
        });

        describe('And the view form is clicked', () => {
            beforeAll(async () => {
                await waitFor(() => expect(wrapper.getByText('View form')).toBeTruthy());

                const button = wrapper.getByText('View form');

                await fireEvent.click(button);
            });

            afterAll(() => {
                mockPush.mockReset();
            });

            it('Then loads the new dataset', () => {
                expect(mockPush).toHaveBeenCalledWith(`/dataset-onboarding/618128a2c312ff5648a20850`);
            });
        });

        describe('And the next button is clicked', () => {
            beforeAll(async () => {
                await waitFor(() => expect(wrapper.queryAllByText('Next')).toBeTruthy());

                const button = wrapper.queryAllByText('Next')[0];

                await fireEvent.click(button);
            });

            afterAll(() => {
                mockPush.mockReset();
            });

            it('Then loads the new dataset', () => {
                expect(mockPush).toHaveBeenCalledWith('/account/datasets/4932179f-1c9c-40a0-81b5-9b499aff7a64');
            });
        });

        describe('And the Make a decision button is clicked', () => {
            beforeAll(async () => {
                await waitFor(() => expect(wrapper.getByText('Make a decision')).toBeTruthy());

                const button = wrapper.getByText('Make a decision');

                await fireEvent.click(button);
            });

            it('Then loads the Make a decision overlay', () => {
                expect(wrapper.container).toMatchSnapshot();
            });

            describe('And the Reject button is clicked', () => {
                beforeAll(async () => {
                    await waitFor(() => expect(wrapper.getByText('Reject')).toBeTruthy());

                    const button = wrapper.queryAllByText('Reject')[0];

                    await fireEvent.click(button);
                });

                afterAll(() => {
                    const closeModalButton = wrapper.queryByTestId('close-modal');
                    if (closeModalButton) {
                        fireEvent.click(closeModalButton);
                    }
                });

                it('Then loads the Reject dataset modal', () => {
                    const { queryByText } = wrapper;
                    expect(queryByText('Reject this version of this dataset metadata')).toBeTruthy();
                });

                it('Then does not load the Approve dataset modal', () => {
                    const { queryByText } = wrapper;
                    expect(queryByText('Approve this version of this dataset metadata')).toBeFalsy();
                });
            });

            describe('And the Approve button is clicked', () => {
                beforeAll(async () => {
                    await waitFor(() => expect(wrapper.getByText('Approve')).toBeTruthy());

                    const button = wrapper.queryAllByText('Approve')[0];

                    await fireEvent.click(button);
                });

                afterAll(() => {
                    const closeModalButton = wrapper.queryByTestId('close-modal');
                    if (closeModalButton) {
                        fireEvent.click(closeModalButton);
                    }
                });

                it('Then loads the Approve dataset modal', () => {
                    const { queryByText } = wrapper;
                    expect(queryByText('Approve this version of this dataset metadata')).toBeTruthy();
                });

                it('Then does not load the Reject dataset modal', () => {
                    const { queryByText } = wrapper;
                    expect(queryByText('Reject this version of this dataset metadata')).toBeFalsy();
                });
            });
        });

        describe('And the previous button is clicked', () => {
            beforeAll(async () => {
                await waitFor(() => expect(wrapper.queryAllByText('Previous')).toBeTruthy());

                const button = wrapper.queryAllByText('Previous')[0];

                await fireEvent.click(button);
            });

            afterAll(() => {
                mockPush.mockReset();
            });

            it('Then loads the new dataset', () => {
                expect(mockPush).toHaveBeenCalledWith('/account/datasets/0a048419-0796-46fb-ad7d-91e650a6c742');
            });
        });
    });

    describe('When the dataset is not in review', () => {
        beforeAll(async () => {
            jest.spyOn(reactRouterDom, 'useParams').mockReturnValue({
                id: '1f509fe7-e94f-48fe-af6a-81f2bf8a5270',
            });

            wrapper = render(<AccountDataset {...props} />, {
                wrapper: Providers,
            });
        });

        it('Then loads the new dataset', async () => {
            await waitFor(() =>
                expect(mockRedirect).toHaveBeenCalledWith({
                    to: '/account?tab=datasets',
                })
            );
        });
    });

    describe('When the dataset is not valid', () => {
        beforeAll(async () => {
            jest.spyOn(reactRouterDom, 'useParams').mockReturnValue({
                id: 'invalid',
            });

            wrapper = render(<AccountDataset {...props} />, {
                wrapper: Providers,
            });
        });

        afterAll(() => {
            mockPush.mockReset();
        });

        it('Then loads the new dataset', async () => {
            await waitFor(() =>
                expect(mockRedirect).toHaveBeenCalledWith({
                    to: '/account?tab=datasets',
                })
            );
        });
    });
});
