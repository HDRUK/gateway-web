
import React from 'react';
import Reviews from '../src/pages/commonComponents/Reviews';
import {reviewsData} from './mocks/dataMock';

describe('<Reviews /> rendering', () => {
    it('renders without crashing', () => {  
        const wrapper = shallow(<Reviews reviewData={reviewsData.reviewData} userState={reviewsData.userState} data={reviewsData.data}/>);      
    });
}); 
