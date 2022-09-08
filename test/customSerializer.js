import { createSerializer } from '@emotion/jest';

// configures @emotion/jest to not insert styles
expect.addSnapshotSerializer(createSerializer({ includeStyles: false }));
