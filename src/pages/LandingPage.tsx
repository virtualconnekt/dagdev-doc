// React imported for JSX

import {
    HeroSection,
    InstallSection,
    WhatIsSection,
    ConceptualFlow,
    CLIWorkflow,
    TutorialVideo,
    CoreFeatures,
    GhostDagSimulator,
    MinimalFooter
} from './LandingComponents';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-blue-500/30">
            {/* 1. Hero */}
            <HeroSection />

            {/* 2. Install (Above fold) */}
            <InstallSection />

            {/* 3 & 4. What is DagDev & The Problem */}
            <WhatIsSection />

            {/* 5. Conceptual Flow */}
            <ConceptualFlow />

            {/* 6. CLI Workflow */}
            <CLIWorkflow />

            {/* 7. Tutorial Video (New!) */}
            <TutorialVideo />

            {/* 8. Core Features */}
            <CoreFeatures />

            {/* 9. Visualizer Preview (Teaser) */}
            <GhostDagSimulator />

            {/* 10. CTA */}
            <CTASection />

            {/* 11. Footer */}
            <MinimalFooter />
        </div>
    );
}

const CTASection = () => {
    return (
        <section className="py-32 px-6 text-center bg-[#050505] border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full transform translate-y-1/2 pointer-events-none" />

            <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tighter">Start Building.</h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <Link
                        to="/docs/intro"
                        className="px-8 py-4 bg-white text-black rounded-lg font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
                    >
                        Read Documentation <ChevronRight className="w-4 h-4" />
                    </Link>
                    <a
                        href="#"
                        className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-lg font-medium hover:bg-white/5 transition-all"
                    >
                        View on GitHub
                    </a>
                    <div className="px-8 py-4 font-mono text-slate-500">
                        npm install -g dagdev
                    </div>
                </div>
            </div>
        </section>
    )
}
