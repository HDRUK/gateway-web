
import React from 'react';
import SearchBar from '../src/pages/components/SearchBar';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('SearchBar', () => {
    it('renders without crashing', () => {
        var data = {data:[{id:"test"}]};
        const wrapper = mount(<SearchBar data={data}/>);
    });
});
