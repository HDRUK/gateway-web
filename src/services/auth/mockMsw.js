import { rest } from 'msw';
import { addCmsGatewayApiHostname, apiPath } from '../../configs/url.config';
import { mockUser } from './mockData';

const mswGetAuthStatus = rest.get(addCmsGatewayApiHostname(`${apiPath}/auth/status`), (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            ...mockUser,
        })
    );
});

export default [mswGetAuthStatus];
