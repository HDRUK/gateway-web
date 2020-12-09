import React from 'react';
import DashboardKPI from '../src/pages/dashboard/DARComponents/DashboardKPI';
import { dashboardKPIData } from './mocks/dataMock';

let wrapper;

describe('<DashboardKPI /> rendering', () => {
	it('renders without crashing', () => {
		wrapper = shallow(
			<DashboardKPI
				kpiText={dashboardKPIData.kpiText}
				kpiValue={dashboardKPIData.kpiValue}
				percentageFlag={dashboardKPIData.percentageFlag}
			/>
		);
	});

	it('will render with "uptime this month"', () => {
		wrapper = shallow(
			<DashboardKPI
				kpiText={dashboardKPIData.kpiText}
				kpiValue={dashboardKPIData.kpiValue}
				percentageFlag={dashboardKPIData.percentageFlag}
			/>
		);
		expect(wrapper.find('[data-testid="kpiText"]').text().trim()).toEqual('uptime this month');
	});

	it('will render with "97%"', () => {
		wrapper = shallow(
			<DashboardKPI
				kpiText={dashboardKPIData.kpiText}
				kpiValue={dashboardKPIData.kpiValue}
				percentageFlag={dashboardKPIData.percentageFlag}
			/>
		);
		expect(wrapper.find('[data-testid="kpiValue"]').text().trim()).toEqual('97%');
	});
});
