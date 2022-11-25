import React from 'react';
import MessageHeader from './MessageHeader';
import { activeTopic, userStateData, activeTopicMultipleDatasets } from '../../../../../test/mocks/dataMock';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

let wrapper;

describe('<MessageHeader />', () => {
    it('renders with correct custodian and one dataset tag', () => {
        wrapper = shallow(<MessageHeader userState={userStateData} topic={activeTopic} modalRequired />);
        expect(wrapper.find('[data-testid="headerTitle"]').text().trim()).toEqual('ALLIANCE > SAIL');
        expect(wrapper.find('[data-testid="headerTag-0"]').exists()).toEqual(true);
        expect(wrapper.find('[data-testid="headerTag-0"]').text().trim()).toEqual('Care Home Dataset');
    });
});

describe('<MessageHeader />', () => {
    it('renders with correct custodian and three dataset tags', () => {
        wrapper = shallow(<MessageHeader userState={userStateData} topic={activeTopicMultipleDatasets} modalRequired />);
        expect(wrapper.find('[data-testid="headerTitle"]').text().trim()).toEqual('ALLIANCE > HQIP');
        expect(wrapper.find('[data-testid="headerTag-0"]').exists()).toEqual(true);
        expect(wrapper.find('[data-testid="headerTag-0"]').text().trim()).toEqual('Epilepsy 12 - clinical audit');
        expect(wrapper.find('[data-testid="headerTag-1"]').exists()).toEqual(true);
        expect(wrapper.find('[data-testid="headerTag-1"]').text().trim()).toEqual(
            'Falls and Fragility Fracture Audit Programme National Hip Database Facilities Survey 2019'
        );
        expect(wrapper.find('[data-testid="headerTag-2"]').exists()).toEqual(true);
        expect(wrapper.find('[data-testid="headerTag-2"]').text().trim()).toEqual(
            'National Joint Registry - Revision Shoulder Replacement dataset'
        );
    });
});
