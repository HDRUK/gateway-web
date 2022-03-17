import { render, waitFor } from '@testing-library/react';
import React from 'react';
import FilterTree from '.';
import { findAllByKey } from '../../../../utils/GeneralHelper.util';
import { mockDatasetFilters } from '../../../../services/search/mockMsw';

const spatialNode = findAllByKey(mockDatasetFilters, (key, value) => {
    return key === 'key' && value === 'spatial';
})[0];

const props = {
    node: spatialNode,
    filters: spatialNode.filtersv2,
    highlighted: ['UK', 'UK, Wales'],
    checked: ['UK', 'UK, Wales'],
    expanded: ['UK', 'UK, Wales'],
    onCheck: jest.fn(),
};

let wrapper;

describe('Give a FilterTree component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<FilterTree {...props} />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct nodes highlighted', () => {
            expect(wrapper.getByText('UK')).toBeTruthy();
            expect(wrapper.getByText('Wales')).toBeTruthy();
        });

        it('Then has the correct nodes not highlighted', () => {
            expect(wrapper.queryByText('India').classList[0]).toEqual('checkbox-text');
            expect(wrapper.queryByText('International').classList[0]).toEqual('checkbox-text');
            expect(wrapper.queryByText('Worldwide').classList[0]).toEqual('checkbox-text');
        });

        describe('And the label is clicked', () => {
            it('Then has called onCheck', async () => {
                const label = wrapper.container.querySelectorAll('label')[0];

                fireEvent.click(label, { target: { checked: true } });

                await waitFor(() => expect(props.onCheck).toHaveBeenCalled());
            });
        });

        describe('And it is searched', () => {
            beforeAll(() => {
                wrapper.rerender(<FilterTree {...props} searchValue='Wales' />, {
                    wrapper: Providers,
                });
            });

            it('Then has the correct nodes highlighted', () => {
                expect(wrapper.getByText('UK')).toBeTruthy();
                expect(wrapper.getByText('Wales')).toBeTruthy();
            });

            it('Then has the correct nodes not highlighted', () => {
                expect(wrapper.queryByText('India')).toBeFalsy();
                expect(wrapper.queryByText('International')).toBeFalsy();
                expect(wrapper.queryByText('Worldwide')).toBeFalsy();
            });
        });
    });
});
