
import React from 'react';
import Reviews from '../src/pages/commonComponents/Reviews';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {reviewsData} from './mocks/dataMock';

Enzyme.configure({ adapter: new Adapter() });

describe('Reviews', () => {
    it('renders without crashing', () => {  
        const wrapper = mount(<Reviews reviewData={reviewsData.reviewData} userState={reviewsData.userState} data={reviewsData.data}/>);      
    });
});
