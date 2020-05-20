
import React from 'react';
import PersonTitle from '../../hdruk-rdt-web/src/pages/person/components/PersonTitle';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('PersonTitle', () => {
    it('renders without crashing', () => {
        var dataPerson = {
            "_id" : "5e544facbd427b6e9cd905a1",
            "activeflag" : "active",
            "bio" : "Jefferson Comprehensive Epilepsy Center, Philadelphia",
            "firstname" : "Michael",
            "lastname" : "Sperling",
            "id" : 900000014,
            "type" : "person",
            "isLoading" : false,
            "orcid" : "https://orcid.org/0000-0003-2446-4558",
            "link" : "https://orcid.org/0000-0001-5022-5265"
          };
        const wrapper = mount(<PersonTitle data={dataPerson}/>);
    });
});
