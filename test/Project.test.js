
import React from 'react';
import Project from '../src/pages/commonComponents/Project';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {projectData} from './mocks/dataMock';

// jest.mock('projectData');

Enzyme.configure({ adapter: new Adapter() });

describe('Project', () => {
    it('renders without crashing', () => {
        const wrapper = mount(<Project data={projectData}/>);
    });
});
