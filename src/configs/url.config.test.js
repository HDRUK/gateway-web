import { addCmsGatewayApiHostname, addCmsGatewayHostname } from './url.config';

describe('Given the addCmsGatewayHostname helper', () => {
    describe('When it is called with hostname uat.', () => {
        it('Then returns the correct url', () => {
            window.location.hostname = 'uat.healthdatagateway.org';
            expect(addCmsGatewayHostname('path/to/something')).toEqual('https://web.uat.healthdatagateway.org/path/to/something');
        });
    });

    describe('When it is called with hostname preprod.', () => {
        it('Then returns the correct url', () => {
            window.location.hostname = 'preprod.';
            expect(addCmsGatewayHostname('path/to/something')).toEqual('https://web.preprod.hdruk.dev/path/to/something');
        });
    });

    describe('When it is called with hostname cloudshell.dev', () => {
        it('Then returns the correct url', () => {
            window.location.hostname = 'test.cloudshell.dev';
            expect(addCmsGatewayHostname('path/to/something')).toEqual('https://web.test.cloudshell.dev/path/to/something');
        });
    });

    describe('When it is called with hostname localhost', () => {
        it('Then returns the correct url', () => {
            window.location.hostname = 'localhost';
            expect(addCmsGatewayHostname('path/to/something')).toEqual('http://localhost:3000/path/to/something');
        });
    });

    describe('When it is called with any other hostname', () => {
        it('Then returns the correct url', () => {
            window.location.hostname = 'test';
            expect(addCmsGatewayHostname('path/to/something')).toEqual('https://web.www.healthdatagateway.org/path/to/something');
        });
    });
});

describe('Given the addCmsGatewayApiHostname helper', () => {
    describe('When it is called with hostname uat.', () => {
        it('Then returns the correct url', () => {
            window.location.hostname = 'uat.healthdatagateway.org';
            expect(addCmsGatewayApiHostname('path/to/something')).toEqual('https://api.web.uat.healthdatagateway.org/path/to/something');
        });
    });

    describe('When it is called with hostname preprod.', () => {
        it('Then returns the correct url', () => {
            window.location.hostname = 'preprod.';
            expect(addCmsGatewayApiHostname('path/to/something')).toEqual('https://api.web.preprod.hdruk.dev/path/to/something');
        });
    });

    describe('When it is called with hostname cloudshell.dev', () => {
        it('Then returns the correct url', () => {
            window.location.hostname = 'test.cloudshell.dev';
            expect(addCmsGatewayApiHostname('path/to/something')).toEqual('http://localhost:3001/path/to/something');
        });
    });

    describe('When it is called with hostname localhost', () => {
        it('Then returns the correct url', () => {
            window.location.hostname = 'localhost';
            expect(addCmsGatewayApiHostname('path/to/something')).toEqual('http://localhost:3001/path/to/something');
        });
    });

    describe('When it is called with any other hostname', () => {
        it('Then returns the correct url', () => {
            window.location.hostname = 'test';
            expect(addCmsGatewayApiHostname('path/to/something')).toEqual('https://api.web.www.healthdatagateway.org/path/to/something');
        });
    });
});
