
import React from 'react';
import Person from '../src/pages/commonComponents/Person';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Person', () => {
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
            "objects" : [{"_id":"5ebd4cecd67943702f091d54","categories":{"category":"Code snippet","programmingLanguage":["Matlab"],"programmingLanguageVersion":""},"tags":{"features":["Bayesian Statistics","Clustering"],"topics":["Cardiovascular","Ear"]},"authors":[947228017269611,900000015,900000014],"id":21722367105393390,"type":"tool","name":"test editing","link":"test","description":"test","license":"Common Development and Distribution License","activeflag":"review","updatedon":"2020-05-14T13:51:40.453Z","createdAt":"2020-05-14T13:51:40.456Z","updatedAt":"2020-05-20T08:43:42.131Z","__v":0,"counter":2,"datasetids":null,"toolids":null}]
                    
          };

        const wrapper = mount(<Person data={dataPerson}/>);
    });
});
