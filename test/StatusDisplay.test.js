import { shallow } from 'enzyme';
import StatusDisplay from '../src/pages/commonComponents/StatusDisplay';

describe('<StatusDisplay />', () => {
	it('renders summary done', async done => {
		let wrapper = shallow(<StatusDisplay section='summary' status='done' />);
		expect(wrapper.find('[data-testid="summary-done"]').length).toBe(1);
		done();
	});

	it('renders documentation partial', async done => {
		let wrapper = shallow(<StatusDisplay section='documentation' status='partial' />);
		expect(wrapper.find('[data-testid="documentation-partial"]').length).toBe(1);
		done();
	});

	it('renders observations empty', async done => {
		let wrapper = shallow(<StatusDisplay section='observations' status='empty' />);
		expect(wrapper.find('[data-testid="observations-empty"]').length).toBe(1);
		done();
	});

	it('does not render without status', async done => {
		let wrapper = shallow(<StatusDisplay section='observations' />);
		expect(wrapper.find('[data-testid="observations-"]').length).toBe(0);
		done();
	});
});
