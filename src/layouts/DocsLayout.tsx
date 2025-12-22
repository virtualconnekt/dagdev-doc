import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Background } from '../components/ui/Background';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

interface SidebarItem {
    title: string;
    path?: string;
    children?: SidebarItem[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
    {
        title: 'Introduction',
        children: [
            { title: 'What is DagDev', path: '/docs/intro' },
            { title: 'Why BlockDAG', path: '/docs/why-blockdag' },
            { title: 'Architecture', path: '/docs/architecture' },
        ],
    },
    {
        title: 'Getting Started',
        children: [
            { title: 'Installation', path: '/docs/installation' },
            { title: 'Project Setup', path: '/docs/setup' },
            { title: 'Local Node', path: '/docs/local-node' },
        ],
    },
    {
        title: 'Core Concepts',
        children: [
            { title: 'GHOSTDAG Consensus', path: '/docs/concepts/ghostdag' },
            { title: 'Blue & Red Blocks', path: '/docs/concepts/blue-red' },
            { title: 'Ordering', path: '/docs/concepts/ordering' },
        ],
    },
    {
        title: 'CLI Reference',
        children: [
            { title: 'dagdev init', path: '/docs/cli/init' },
            { title: 'dagdev run', path: '/docs/cli/run' },
        ],
    },
];

export function DocsLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Mobile Navbar */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0b] sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                    <img src="/logo.png" alt="DagDev Logo" className="h-8 w-8 object-cover rounded-full" />
                </Link>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
                    {sidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0b] border-r border-white/10 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen md:overflow-y-auto",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 hidden md:block">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                        <img src="/logo.png" alt="DagDev Logo" className="h-20 w-20 object-cover rounded-full" />
                    </Link>
                </div>

                <nav className="px-4 pb-6 space-y-6">
                    {SIDEBAR_ITEMS.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                                {section.title}
                            </h3>
                            <ul className="space-y-1">
                                {section.children?.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <li key={item.title}>
                                            <Link
                                                to={item.path || '#'}
                                                onClick={() => setSidebarOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                                                    isActive
                                                        ? "bg-blue-500/10 text-blue-400"
                                                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                                )}
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 md:py-10 md:px-12 px-4 py-8 overflow-y-auto relative bg-[#0a0a0b]">
                <Background />

                <div className="relative z-10 max-w-4xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
