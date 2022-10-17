import { getRolesList } from './auth';

describe('Given the auth helpers', () => {
    describe('When getRolesList is called', () => {
        it('Then returns the correct value', () => {
            expect(getRolesList(['manager', 'custodian', 'admin'])).toEqual('Admin, Custodian, Manager');
        });
    });
});
