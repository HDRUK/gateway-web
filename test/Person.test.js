
import React from 'react';
import Person from '../src/pages/commonComponents/Person';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {personData} from './mocks/dataMock';

Enzyme.configure({ adapter: new Adapter() });

describe('Person', () => {
    it('renders without crashing', () => {
        const wrapper = mount(<Person data={personData}/>);
    });
});
