import { rest } from 'msw';
import { addCmsGatewayApiHostname, apiPathV1 } from '../../configs/url.config';
import { mockUser } from './mockData';

const mswGetAuthStatus = rest.get(addCmsGatewayApiHostname(`${apiPathV1}/auth/status`), (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            ...mockUser,
        })
    );
});

export default [mswGetAuthStatus];
