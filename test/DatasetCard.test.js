import { userStateData } from './mocks/dataMock';
import moxios from 'moxios';
import { act } from 'react-dom/test-utils';
import DatasetCard from '../src/pages/commonComponents/DatasetCard';

let wrapper;

describe('<DatasetCard />', () => {
	it('renders a DatasetCard without crashing', async done => {
		// let wrapper = shallow(<DatasetCard title='test'></DatasetCard>);
		// expect(wrapper.find('[data-testid="dataset_card_test"]').length).toBe(1);
	});
});
