import { rest } from 'msw';
import { apiUrlV1 } from '../../../../src/configs/url.config';
import { generateMockPublisherV1 } from './data';

const mockGetPublisherV1 = generateMockPublisherV1();

const getPublisherV1 = (data = mockGetPublisherV1, status = 200) => {
    return rest.get(`${apiUrlV1}/publishers/:id`, (req, res, ctx) => {
        return res(
            ctx.status(status),
            ctx.json({
                data: [data],
            })
        );
    });
};

export { getPublisherV1 };
