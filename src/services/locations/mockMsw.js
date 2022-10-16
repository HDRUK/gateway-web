import { rest } from 'msw';
import { locationAPIURL } from '../../configs/url.config';

const mswGetLocations = rest.get(`${locationAPIURL}/locations/test`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            data: [
                { location: 'Colchester', hierarchy: 'United Kingdon,Colchester' },
                { location: 'Ireland', hierarchy: 'Ireland' },
            ],
        })
    );
});

export default [mswGetLocations];
