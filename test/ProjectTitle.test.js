
import React from 'react';
import ProjectTitle from '../src/pages/project/components/ProjectTitle';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {projectTitleData} from './mocks/dataMock';

Enzyme.configure({ adapter: new Adapter() });

describe('ProjectTitle', () => {
    it('renders without crashing', () => {
        // var dataProject = {
        //     "_id": "5e544facbd427b6e9cd90597",
        //     "id": 900000003,
        //     "type": "project",
        //     "name": "Confusion in the nomenclature of ketogenic diets blurs evidence",
        //     "description": "Ketogenic diets have been proposed as a non-pharmacological strategy for the management of several chronic conditions. Their efficacy and safety have been evaluated in the field of neurology, oncology and endocrinology for disorders including cancer, dementia, drug-resistant epilepsy, migraines, obesity, polycystic ovary syndrome and type 2 diabetes mellitus. The nutritional requirements of these subjects are expected to differ significantly. Indeed, although all ketogenic diets restrict carbohy...",
        //     "link": "https://www.ncbi.nlm.nih.gov/pubmed/32080796",
        //     "toolids":[900000007, 900000010],
        //     "creatorids":[900000012, 900000011, 900000014],
        //     "_v": 0,
        //     "categories": {category: "Article"},
        //     "tags": {topics: ["Classification", "Nomenclature", "Ketogenic diet"]}

        //   };
        // const wrapper = mount(<ProjectTitle data={dataProject}/>);
        const wrapper = mount(<ProjectTitle data={projectTitleData}/>);

    });
});
