
import React from 'react';
import PersonTitle from '../../hdruk-rdt-web/src/pages/person/components/PersonTitle';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {personTitleData} from './mocks/dataMock';

Enzyme.configure({ adapter: new Adapter() });

describe('PersonTitle', () => {
    it('renders without crashing', () => {
      const wrapper = mount(<PersonTitle data={personTitleData}/>);
    });
});
