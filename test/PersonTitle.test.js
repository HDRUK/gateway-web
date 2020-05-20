
import React from 'react';
import PersonTitle from '../src/pages/components/PersonTitle';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('PersonTitle', () => {
    it('renders without crashing', () => {
        var dataPerson = {
            "tags": [
              "Tech Director"
            ],
            "_id": "5e3bf4231c9d440000e8d4a7",
            "id": 89522471,
            "type": "person",
            "name": "Tony Espley",
            "description": "A 32bit process in a 64bit world.",
            "rating": 4,
            "link": "https://www.paconsulting.com",
            "likedids": [89522470,89522469,89522468]
          };
        const wrapper = mount(<PersonTitle data={dataPerson}/>);
    });
});
