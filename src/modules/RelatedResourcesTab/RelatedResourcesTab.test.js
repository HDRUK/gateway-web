import RelatedResourcesTab from './RelatedResourcesTab';
import '@testing-library/jest-dom/extend-expect';
import { server } from '../../services/mockServer';
import { testUtils, handlers, mocks } from '../../../test';

describe('RelatedResourcesTab', () => {
    beforeAll(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
        testUtils.cleanup();
    });

    afterAll(() => {
        server.close();
    });

    it('should render "No related resources found" when none are passed in', async () => {
        testUtils.act(() => {
            testUtils.render(<RelatedResourcesTab relatedObjects={[]} authorId={76482376438726} />);
        });
        await testUtils.waitFor(() => {
            expect(testUtils.screen.getByText('No related resources found')).toBeInTheDocument();
        });
    });

    it('should render "active" related resource', async () => {
        const uuid = mocks.generateData.generateMockUuid();
        const mockRelatedObjectV1 = handlers.generateMockRelatedObjectV1({ id: uuid, activeflag: 'active', type: 'tool' });
        const mockRelatedObjects = [
            {
                objectId: uuid,
                objectType: 'tool',
            },
        ];
        server.use(handlers.getRelatedObjectV1(mockRelatedObjectV1));
        testUtils.act(() => {
            testUtils.render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={mockRelatedObjectV1.authors[0]} />);
        });
        await testUtils.waitFor(() => {
            expect(testUtils.screen.getByText(mockRelatedObjectV1.name)).toBeInTheDocument();
        });
    });

    it('should not render "rejected" related resource', async () => {
        const uuid = mocks.generateData.generateMockUuid();
        const mockRelatedObjectV1 = handlers.generateMockRelatedObjectV1({ id: uuid, activeflag: 'rejected', type: 'tool' });
        const mockRelatedObjects = [
            {
                objectId: uuid,
                objectType: 'tool',
            },
        ];
        server.use(handlers.getRelatedObjectV1(mockRelatedObjectV1));
        testUtils.act(() => {
            testUtils.render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={mockRelatedObjectV1.authors[0]} />);
        });
        await testUtils.waitFor(() => {
            expect(testUtils.screen.getByText('No related resources found')).toBeInTheDocument();
        });
    });

    it('should render "review" related resource when author id matches', async () => {
        const uuid = mocks.generateData.generateMockUuid();
        const mockRelatedObjectV1 = handlers.generateMockRelatedObjectV1({ id: uuid, activeflag: 'review', type: 'tool' });
        const mockRelatedObjects = [
            {
                objectId: uuid,
                objectType: 'tool',
            },
        ];
        server.use(handlers.getRelatedObjectV1(mockRelatedObjectV1));
        testUtils.act(() => {
            testUtils.render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={mockRelatedObjectV1.authors[0]} />);
        });
        await testUtils.waitFor(() => {
            expect(testUtils.screen.getByText(mockRelatedObjectV1.name)).toBeInTheDocument();
        });
    });

    it('should not render "review" related resource if author id does not match', async () => {
        const uuid = mocks.generateData.generateMockUuid();
        const mockRelatedObjectV1 = handlers.generateMockRelatedObjectV1({ id: uuid, activeflag: 'review', type: 'tool' });
        const mockRelatedObjects = [
            {
                objectId: uuid,
                objectType: 'tool',
            },
        ];
        server.use(handlers.getRelatedObjectV1(mockRelatedObjectV1));
        testUtils.act(() => {
            testUtils.render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={76482376438726} />);
        });
        await testUtils.waitFor(() => {
            expect(testUtils.screen.queryByText(mockRelatedObjectV1.name)).not.toBeInTheDocument();
        });
    });

    describe('Filter by type', () => {
        let mockRelatedObjects = [];
        let mockRelatedObjectV1;
        let mockRelatedObjectV2;
        let mockRelatedObjectV3;

        beforeEach(() => {
            const uuid1 = mocks.generateData.generateMockUuid();
            const uuid2 = mocks.generateData.generateMockUuid();
            const uuid3 = mocks.generateData.generateMockUuid();

            mockRelatedObjectV1 = handlers.generateMockRelatedObjectV1({ id: uuid1, activeflag: 'active', type: 'tool' });
            mockRelatedObjectV2 = handlers.generateMockRelatedObjectV1({ id: uuid2, activeflag: 'active', type: 'dataUseRegister' });
            mockRelatedObjectV3 = handlers.generateMockRelatedObjectV1({ id: uuid3, activeflag: 'active', type: 'tool' });

            mockRelatedObjects = [
                {
                    objectId: uuid1,
                    objectType: 'tool',
                },
                {
                    objectId: uuid2,
                    objectType: 'dataUseRegister',
                },
                {
                    objectId: uuid3,
                    objectType: 'tool',
                },
            ];
            server.use(handlers.getRelatedObjectV1(mockRelatedObjectV1));
            server.use(handlers.getRelatedObjectV1(mockRelatedObjectV2));
            server.use(handlers.getRelatedObjectV1(mockRelatedObjectV3));
        });
        it('should display count of each type within dropdown when expanded', async () => {
            testUtils.act(() => {
                testUtils.render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={76482376438726} />);
            });

            await testUtils.waitFor(() => {
                expect(testUtils.screen.getByText('Show all resources (3)')).toBeInTheDocument();
            });

            testUtils.act(() => {
                testUtils.screen.getByText('Show all resources (3)').click();
            });

            expect(testUtils.screen.getByText('Show data uses (1)')).toBeInTheDocument();
            expect(testUtils.screen.getByText('Show tools (2)')).toBeInTheDocument();
        });
        it('should filter related resources by type', async () => {
            testUtils.act(() => {
                testUtils.render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={76482376438726} />);
            });

            await testUtils.waitFor(() => {
                expect(testUtils.screen.getByText('Show all resources (3)')).toBeInTheDocument();
            });

            testUtils.act(() => {
                testUtils.screen.getByText('Show all resources (3)').click();
            });

            expect(testUtils.screen.getAllByText('Show data uses (1)')).toHaveLength(1);
            expect(testUtils.screen.getAllByText('Data use')).toHaveLength(1);
            expect(testUtils.screen.getAllByText('Tool')).toHaveLength(2);

            testUtils.act(() => {
                testUtils.screen.getByText('Show data uses (1)').click();
            });

            expect(testUtils.screen.getAllByText('Show data uses (1)')).toHaveLength(2);
            expect(testUtils.screen.getAllByText('Data use')).toHaveLength(1);
            expect(testUtils.screen.queryAllByText('Tool')).toHaveLength(0);
        });
    });

    it('should filter related resources by search value', async () => {
        let wrapper;
        const uuid = mocks.generateData.generateMockUuid();
        const mockRelatedObjectV1 = handlers.generateMockRelatedObjectV1({ id: uuid, activeflag: 'active', type: 'tool' });
        const mockRelatedObjects = [
            {
                objectId: uuid,
                objectType: 'tool',
            },
        ];
        server.use(handlers.getRelatedObjectV1(mockRelatedObjectV1));

        testUtils.act(() => {
            wrapper = testUtils.render(<RelatedResourcesTab relatedObjects={mockRelatedObjects} authorId={76482376438726} />);
        });

        await testUtils.waitFor(() => {
            expect(testUtils.screen.getByText('Tool')).toBeInTheDocument();
            expect(testUtils.screen.getByText('Show all resources (1)')).toBeInTheDocument();
        });

        const input = wrapper.container.querySelector('input');

        testUtils.act(() => {
            testUtils.fireEvent.change(input, { target: { value: 'value not in name' } });
            testUtils.fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
        });

        await testUtils.waitFor(() => {
            expect(testUtils.screen.getByText('Show all resources (0)')).toBeInTheDocument();
        });
    });
});
