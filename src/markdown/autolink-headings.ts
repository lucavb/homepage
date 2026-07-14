import { defineHastPlugin } from 'satteri';

const LINK_ICON_PATH =
    'M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z';

export function autolinkHeadingsPlugin() {
    return defineHastPlugin({
        name: 'autolink-headings',
        element: {
            filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            visit(node, ctx) {
                const id = node.properties?.id;
                if (typeof id !== 'string' || id.length === 0) {
                    return;
                }

                ctx.appendChild(node, {
                    type: 'element',
                    tagName: 'a',
                    properties: {
                        href: `#${id}`,
                        className: ['heading-anchor'],
                        ariaLabel: 'Link to this heading',
                    },
                    children: [
                        {
                            type: 'element',
                            tagName: 'svg',
                            properties: {
                                width: 20,
                                height: 20,
                                viewBox: '0 0 16 16',
                                fill: 'currentColor',
                                xmlns: 'http://www.w3.org/2000/svg',
                                className: ['heading-anchor-icon'],
                            },
                            children: [
                                {
                                    type: 'element',
                                    tagName: 'path',
                                    properties: {
                                        d: LINK_ICON_PATH,
                                    },
                                    children: [],
                                },
                            ],
                        },
                    ],
                });
            },
        },
    });
}
