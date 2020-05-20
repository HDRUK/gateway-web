
import React from 'react';
import Tool from '../src/pages/commonComponents/Tool';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {toolData} from './mocks/dataMock';

Enzyme.configure({ adapter: new Adapter() });

describe('Tool', () => {
    it('renders without crashing', () => {
        const wrapper = mount(<Tool data={toolData}/>);
    });
});

