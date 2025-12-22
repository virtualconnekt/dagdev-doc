import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import components from './MDXComponents';

export function MDXWrapper({ children }: { children: React.ReactNode }) {
    return <MDXProvider components={components}>{children}</MDXProvider>;
}
