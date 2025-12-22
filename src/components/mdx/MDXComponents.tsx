import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { LiveCLI } from '../ui/LiveCLI';
import { DAGDiagram } from '../viz/DAGDiagram';

const components = {
    LiveCLI,
    DAGDiagram,
    h1: (props: any) => (
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-8 mt-2" {...props} />
    ),
    h2: (props: any) => (
        <h2 className="text-2xl font-semibold text-slate-100 mt-12 mb-6 border-b border-white/10 pb-2" {...props} />
    ),
    h3: (props: any) => (
        <h3 className="text-xl font-medium text-slate-200 mt-8 mb-4" {...props} />
    ),
    p: (props: any) => (
        <p className="text-slate-400 leading-relaxed mb-6" {...props} />
    ),
    ul: (props: any) => (
        <ul className="list-disc list-outside ml-6 space-y-2 mb-6 text-slate-400" {...props} />
    ),
    ol: (props: any) => (
        <ol className="list-decimal list-outside ml-6 space-y-2 mb-6 text-slate-400" {...props} />
    ),
    li: (props: any) => (
        <li className="pl-1" {...props} />
    ),
    blockquote: (props: any) => (
        <blockquote className="border-l-4 border-blue-500/50 bg-blue-500/5 px-6 py-4 rounded-r-lg my-8 text-slate-300 italic" {...props} />
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
            <div className="relative group my-6">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100" />
                <div className="relative rounded-lg overflow-hidden border border-white/10 bg-[#0d1117]">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                        <span className="text-xs text-slate-500 font-mono">{match[1]}</span>
                    </div>
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
            </div>
        ) : (
            <code className="bg-slate-800/50 text-blue-200 px-1.5 py-0.5 rounded font-mono text-sm border border-white/5" {...props}>
                {children}
            </code>
        );
    },
    // Custom Components can be added here
    Note: ({ children, type = 'info' }: { children: React.ReactNode, type?: 'info' | 'warning' }) => (
        <div className={`my-6 p-4 rounded-lg flex gap-4 ${type === 'warning' ? 'bg-orange-500/10 border border-orange-500/20 text-orange-200' : 'bg-blue-500/10 border border-blue-500/20 text-blue-200'
            }`}>
            <div>{children}</div>
        </div>
    )
};

export default components;
