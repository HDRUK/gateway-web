import UploaderUtil from './Uploader.util';
import { server } from '../services/mockServer';

let wrapper;
let input;
const handler = jest.fn();

describe('Given the UploaderUtil component', () => {
    beforeAll(async () => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close();
    });

    describe('UploaderUtil getUserInfo', () => {
        it('Should return userInfo object', async () => {
            const userInfo = await UploaderUtil.getUserInfo('123');
            expect(userInfo.id).toEqual(123);
            expect(userInfo.firstname).toEqual('Test1');
            expect(userInfo.lastname).toEqual('Test1');
        });
    });
    describe('UploaderUtil buildListOfUploaders', () => {
        it('Should array of only current userInfo object', async () => {
            const uploders = await UploaderUtil.buildListOfUploaders([], { id: 1234, name: 'Test' });
            expect(uploders.length).toEqual(1);
            expect(uploders[0].id).toEqual(1234);
            expect(uploders[0].name).toEqual('Test (You)');
        });
    });

    describe('UploaderUtil buildListOfUploaders', () => {
        it('Should array of all userInfo object', async () => {
            const uploders = await UploaderUtil.buildListOfUploaders([123, 1234], { id: 1234, name: 'Test' });
            expect(uploders[0].id).toEqual(1234);
            expect(uploders[0].name).toEqual('Test (You)');
            expect(uploders[1].id).toEqual(123);
            expect(uploders[1].name).toEqual('Test1 Test1');
        });
    });
});
