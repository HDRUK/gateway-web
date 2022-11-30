import { rest } from 'msw';
import { apiUrlV1 } from '../../../../src/configs/url.config';
import { generateMockRelatedObjectV1 } from './data';

const mockGetRelatedObjectActiveV1 = generateMockRelatedObjectV1();

const getRelatedObjectV1 = (data = mockGetRelatedObjectActiveV1, status = 200) => {
    return rest.get(`${apiUrlV1}/relatedobject/:id`, (req, res, ctx) => {
        return res(
            ctx.status(status),
            ctx.json({
                data: [data],
            })
        );
    });
};

const getRelatedObjectTypeV1 = (data = mockGetRelatedObjectActiveV1, status = 200) =>
    rest.get(`${apiUrlV1}/relatedobject/:type/:id`, (req, res, ctx) => {
        return res(
            ctx.status(status),
            ctx.json({
                data: [data],
            })
        );
    });

export { getRelatedObjectV1, getRelatedObjectTypeV1 };
