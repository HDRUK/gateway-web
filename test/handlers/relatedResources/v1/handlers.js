import { rest } from 'msw';
import { apiV1Url } from '../../../../src/configs/url.config';
import { generateMockRelatedObjectV1 } from './data';

const mockGetRelatedObjectActiveV1 = generateMockRelatedObjectV1();

const getRelatedObjectV1 = (data = mockGetRelatedObjectActiveV1, status = 200) => {
    return rest.get(`${apiV1Url}/relatedobject/:id`, (req, res, ctx) => {
        return res(
            ctx.status(status),
            ctx.json({
                data: [data],
            })
        );
    });
};

const getRelatedObjectTypeV1 = (data = mockGetRelatedObjectActiveV1, status = 200) =>
    rest.get(`${apiV1Url}/relatedobject/:type/:id`, (req, res, ctx) => {
        return res(
            ctx.status(status),
            ctx.json({
                data: [data],
            })
        );
    });

export { getRelatedObjectV1, getRelatedObjectTypeV1 };
