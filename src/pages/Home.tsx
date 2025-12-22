import React from 'react';
import { ChevronRight, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    Determine the Future of Consensus
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                    DagDev is the first developer framework designed specifically for BlockDAG protocols.
                    Simulate complex DAG topologies, visualize GHOSTDAG ordering, and deploy EVM-compatible contracts in a deterministic local environment.
                </p>

                <div className="flex gap-4">
                    <Link
                        to="/installation"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                    >
                        Get Started <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link
                        to="/concepts/ghostdag"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-200 rounded-lg font-medium transition-colors border border-white/10"
                    >
                        Learn Concepts
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                    <Terminal className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">CLI First</h3>
                    <p className="text-slate-400">
                        Native command line tools for spinning up local DAGs, mining blocks, and inspecting the graph.
                    </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                    <div className="w-8 h-8 rounded-full border-2 border-red-500 mb-4 relative">
                        <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Visual Consensus</h3>
                    <p className="text-slate-400">
                        See the GHOSTDAG algorithm in action. Identify blue sets, anticones, and confirmation paths visually.
                    </p>
                </div>
            </div>
        </div>
    );
}
