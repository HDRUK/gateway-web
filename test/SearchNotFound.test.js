
import React from 'react';
import NotFound from '../src/pages/commonComponents/NotFound';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {notFoundData} from './mocks/dataMock';

Enzyme.configure({ adapter: new Adapter() });

describe('NotFound', () => {
    it('renders without crashing', () => {
        const wrapper = mount(<NotFound data = {notFoundData} />);
    });
});
