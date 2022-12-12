import React, { Fragment } from 'react';
import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';

const Guidance = ({ activeGuidance }) => {
    function compile(val) {
        const processor = unified()
            .use(remarkParse)
            .use(remarkRehype, { allowDangerousHTML: true })
            .use(rehypeRaw)
            .use(rehypeFormat)
            .use(rehypeStringify);

        const ast = processor.runSync(processor.parse(val));

        return {
            contents: processor.stringify(ast),
        };
    }

    const { contents } = compile(activeGuidance);

    return (
        <Fragment>
            {activeGuidance ? (
                <Fragment>
                    <main className='gray800-14'>
                        <section dangerouslySetInnerHTML={{ __html: contents }}></section>
                    </main>
                </Fragment>
            ) : (
                <div className='darTab-guidance'>Click on a question guidance to view details</div>
            )}
        </Fragment>
    );
};

export default Guidance;
