import React from 'react';
import AccountAnalyticsDashboard from '../src/pages/dashboard/AccountAnalyticsDashboard';
import DashboardKPI from '../src/pages/dashboard/DARComponents/DashboardKPI';
import { userStateData } from './mocks/dataMock';

let wrapper;

describe('<AccountAnalyticsDashboard /> rendering', () => {
	it('renders without crashing', () => {
		wrapper = shallow(<AccountAnalyticsDashboard UserState={userStateData} />);
	});

	it('renders with <Loading /> component', () => {
		wrapper = shallow(<AccountAnalyticsDashboard UserState={userStateData} />);
		expect(wrapper.find('[data-testid="isLoading"]').exists()).toEqual(true);
	});

	it('renders 7 <DashboardKPI /> components', () => {
		wrapper = shallow(<AccountAnalyticsDashboard UserState={userStateData} />);
		wrapper.setState({ isLoading: false });
		expect(wrapper.find(DashboardKPI).length).toBe(8);
	});
});
