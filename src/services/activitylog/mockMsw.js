import { rest } from 'msw';
import { apiV2URL } from '../../configs/url.config';

export const mockDatasetActivityLog = {
    success: true,
    logs: [
        {
            version: 'Version 4.0.0',
            versionNumber: 4,
            meta: {
                dateSubmitted: '2021-09-03T09:51:44.842Z',
                dateCreated: '2021-09-02T15:41:16.392Z',
                applicationStatus: 'rejected',
            },
            events: [],
        },
        {
            version: 'Version 3.0.0',
            versionNumber: 3,
            meta: {
                dateSubmitted: '2021-09-02T15:38:29.571Z',
                dateCreated: '2021-09-02T15:37:57.159Z',
                applicationStatus: 'archive',
            },
            events: [],
        },
        {
            version: 'Version 2.0.0',
            versionNumber: 2,
            meta: {
                dateSubmitted: '2021-09-02T14:47:48.056Z',
                dateCreated: '2021-09-02T14:44:08.889Z',
                applicationStatus: 'rejected',
            },
            events: [],
        },
        {
            version: 'Version 1.0.0',
            versionNumber: 1,
            meta: {
                dateSubmitted: '2021-09-02T13:29:59.320Z',
                dateCreated: '2021-09-02T13:26:05.761Z',
                applicationStatus: 'archive',
            },
            events: [],
        },
    ],
};

export const mswPostDatasetActivityLog = rest.post(`${apiV2URL}/activitylog`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockDatasetActivityLog));
});

export default [mswPostDatasetActivityLog];
