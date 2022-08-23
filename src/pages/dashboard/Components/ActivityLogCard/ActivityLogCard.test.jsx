import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import DatasetOnboardingHelper from '../../../../utils/DatasetOnboardingHelper.util';
import { dateFormats } from '../../../../utils/GeneralHelper.util';
import ActivityLogCard from './ActivityLogCard';
import mockData from './mockData';
import { server } from '../../../../services/mockServer';

const props = {
    ...mockData,
};
let wrapper;

describe('Given the ActivityLogCard component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            server.listen();
            wrapper = render(<ActivityLogCard {...props} />, {
                wrapper: Providers,
            });
        });

        afterAll(() => {
            server.close();
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then  Title should be rendered with  Submitted Date', async () => {
            expect(screen.getByTestId(`version-title`)).toHaveTextContent(`Version ${props.versionNumber}`);
            await waitFor(() => expect(wrapper.queryByText('Submitted 8 November 2021')).toBeTruthy());
        });
        it('Then  Status should be rendered', () => {
            const statusText = DatasetOnboardingHelper.datasetSLAText[props.meta.applicationStatus];
            expect(screen.getByTestId('status')).toHaveTextContent(statusText);
        });

        it('Then  all events should be rendered', () => {
            props.events.map((event, i) => {
                const timestamp = dateFormats(event.timestamp);
                expect(screen.getByTestId(`event-time-${i}`)).toHaveTextContent(timestamp.timeOnly);
            });
        });

        it.skip('Then updates submitted log be rendered', async () => {
            await waitFor(() =>
                expect(screen.getByTestId('event-status-text-0')).toHaveTextContent(
                    `Version 2 of this dataset been approved by admin Callum Reekie`
                )
            );
            await waitFor(() =>
                expect(screen.getByTestId('event-status-text-1')).toHaveTextContent('Updates submitted by data custodian Callum Reekie')
            );

            await waitFor(() =>
                expect(screen.getByTestId('event-status-text-2')).toHaveTextContent(
                    'Version 2 of this dataset been submitted by data custodian Callum Reekie'
                )
            );
            await waitFor(() => expect(wrapper.queryAllByText('Question')).toBeTruthy());
            await waitFor(() => expect(wrapper.queryAllByText('Previous Answer')).toBeTruthy());
            await waitFor(() => expect(wrapper.queryAllByText('Updated Answer')).toBeTruthy());
            await waitFor(() => expect(wrapper.queryAllByText('Provenance | Temporal')).toBeTruthy());
            await waitFor(() => expect(wrapper.queryAllByText('Distribution Release Date')).toBeTruthy());
        });
    });
});
