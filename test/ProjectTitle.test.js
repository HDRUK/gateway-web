
import React from 'react';
import ProjectTitle from '../src/pages/project/components/ProjectTitle';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {projectTitleData} from './mocks/dataMock';

Enzyme.configure({ adapter: new Adapter() });

describe('ProjectTitle', () => {
    it('renders without crashing', () => {
        const wrapper = mount(<ProjectTitle data={projectTitleData}/>);
    });
});
