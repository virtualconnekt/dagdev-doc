import { useState, useEffect, useRef, useCallback } from 'react'; // React imported for hooks
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Terminal, Copy, Check, Play, Server, Layers, Cpu, Code2, Network } from 'lucide-react'; // Removed unused icons
import { Link } from 'react-router-dom';
import * as THREE from 'three';


const ScrambleText = ({ text, trigger }: { text: string, trigger: boolean }) => {
    const [display, setDisplay] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

    useEffect(() => {
        if (!trigger) {
            setDisplay(text);
            return;
        }

        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(prev =>
                text.split("").map((letter, index) => {
                    if (index < iterations) {
                        return text[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );

            if (iterations >= text.length) {
                clearInterval(interval);
            }

            iterations += 1 / 3; // Speed control
        }, 30);

        return () => clearInterval(interval);
    }, [trigger, text]);

    return <span>{display}</span>;
}

export const HeroSection = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);

    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center px-6 pt-20 overflow-hidden bg-[#050505]">
            <BackgroundParticles />

            <div className="relative z-10 max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
                <motion.div style={{ y: y1 }} className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6">
                            DagDev
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-xl h-20">
                            <ScrambleText text="Development environment for BlockDAG networks." trigger={true} />
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-slate-500 max-w-lg border-l-2 border-slate-800 pl-6"
                    >
                        Build, test, and visualize DAG-based blockchains using a familiar CLI workflow.
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap gap-4 pt-4"
                    >
                        <Link
                            to="/docs/intro"
                            className="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-slate-200 transition-colors"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/docs/intro"
                            className="text-slate-400 px-8 py-3 rounded-md font-medium hover:text-white transition-colors border border-transparent hover:border-slate-800"
                        >
                            Documentation
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Conceptual DAG visual on the right */}
                <motion.div style={{ y: y2 }} className="hidden md:block relative h-[500px] w-full opacity-60">
                    <InteractiveDagViz />
                </motion.div>
            </div>
        </section>
    );
};

// --- Background Particles ---
const BackgroundParticles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Reuse specific particle logic or simplified version here
    // For now, a placeholder generic starfield/network effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        const particles = Array.from({ length: 50 }).map(() => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: Math.random() * 2 + 1
        }));

        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#1e293b'; // slate-800

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(animate);
        };
        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        animate();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />;
};



// --- Interactive DAG Viz in Hero (Three.js) ---
const InteractiveDagViz = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Setup
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 40;
        camera.position.y = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // DAG Generation Logic
        const nodes: { x: number, y: number, z: number, id: number }[] = [];
        const edges: { source: number, target: number }[] = [];
        const layers = 6;
        const nodesPerLayer = 3;

        // Create Nodes
        let nodeId = 0;
        for (let l = 0; l < layers; l++) {
            for (let i = 0; i < nodesPerLayer; i++) {
                // Randomize position slightly
                const jitter = () => (Math.random() - 0.5) * 4;
                nodes.push({
                    x: (l - layers / 2) * 8 + jitter(),
                    y: (i - nodesPerLayer / 2) * 8 + jitter(),
                    z: jitter() * 2,
                    id: nodeId++
                });
            }
        }

        // Create Edges (Connect to random nodes in previous layer)
        for (let i = nodesPerLayer; i < nodes.length; i++) {
            const currentLayer = Math.floor(i / nodesPerLayer);
            const prevLayerStart = (currentLayer - 1) * nodesPerLayer;

            // Connect to 1-2 parents
            const parentsCount = Math.floor(Math.random() * 2) + 1;
            for (let p = 0; p < parentsCount; p++) {
                const parentIndex = prevLayerStart + Math.floor(Math.random() * nodesPerLayer);
                if (parentIndex >= 0 && parentIndex < nodes.length) {
                    edges.push({ source: i, target: parentIndex });
                }
            }
        }

        // Add Objects to Scene
        const group = new THREE.Group();
        scene.add(group);

        // Materials
        const boxGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const boxMaterial = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0x60a5fa,
            transparent: true,
            opacity: 0.8
        });
        const coreGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

        // Render Nodes
        nodes.forEach(node => {
            const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
            mesh.position.set(node.x, node.y, node.z);
            group.add(mesh);

            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            core.position.set(node.x, node.y, node.z);
            group.add(core);
        });

        // Render Edges
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.2
        });

        edges.forEach(edge => {
            const source = nodes[edge.source];
            const target = nodes[edge.target];
            const points = [];
            points.push(new THREE.Vector3(source.x, source.y, source.z));
            points.push(new THREE.Vector3(target.x, target.y, target.z));
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial);
            group.add(line);
        });

        // Animation
        let frameId: number;
        const animate = () => {
            frameId = requestAnimationFrame(animate);

            group.rotation.y += 0.002;
            group.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;

            renderer.render(scene, camera);
        };

        animate();

        // Handle Resize
        const handleResize = () => {
            if (!mountRef.current) return;
            const w = mountRef.current.clientWidth;
            const h = mountRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
            mountRef.current?.removeChild(renderer.domElement);
            // Dispose
            boxGeometry.dispose();
            boxMaterial.dispose();
            coreGeometry.dispose();
            coreMaterial.dispose();
            lineMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={mountRef} className="absolute inset-0 flex items-center justify-center opacity-80" />
    );
};


// --- 2. Install Section ---
export const InstallSection = () => {
    const [copied, setCopied] = useState(false);
    const cmd = "npm install -g dagdev";

    const copy = () => {
        navigator.clipboard.writeText(cmd);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="bg-slate-900 border-y border-white/5 py-12 px-6">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4 text-slate-400">
                    <Terminal className="w-5 h-5" />
                    <span className="font-mono text-sm">Install via NPM</span>
                </div>

                <div className="group relative flex items-center gap-4 bg-black/50 p-4 pr-12 rounded-lg border border-white/10 font-mono text-sm min-w-[300px] hover:border-blue-500/50 transition-colors cursor-pointer" onClick={copy}>
                    <span className="text-blue-400">$</span>
                    <span className="text-slate-200">{cmd}</span>
                    <span className="text-slate-600 block opacity-50 group-hover:opacity-100 transition-opacity">
                        && npx dagdev init my-dag
                    </span>

                    <button className="absolute right-4 text-slate-500 hover:text-white transition-colors">
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {copied && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: -20 }}
                            exit={{ opacity: 0 }}
                            className="absolute right-0 -top-2 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded"
                        >
                            Copied!
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

// --- 3. What is DagDev / Comparison ---
export const WhatIsSection = () => {
    return (
        <section className="py-24 px-6 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">What is DagDev?</h2>
                    <p className="text-slate-400 leading-relaxed text-lg">
                        DagDev is the developer toolkit for BlockDAG networks — think of it as <span className="text-white font-medium">"The definitive toolkit for DAGs."</span>
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                        It provides a local BlockDAG node, EVM compatibility, DAG-aware testing helpers, a runtime environment (DRE) for scripts, and a real-time visualizer so developers can build, test and deploy smart contracts on DAG architectures with the same ergonomics they expect from modern tooling.
                    </p>
                    <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg text-blue-300/80 text-sm">
                        <span className="font-semibold text-blue-400">Key Idea:</span> Instead of assuming a linear chain, DagDev understands DAGs (multiple parents per block), parallel mining, and GHOSTDAG consensus.
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">The Problem</h2>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Traditional Tooling</h3>
                            <ul className="space-y-3 text-slate-400 text-sm">
                                <li className="flex items-start gap-2 text-red-400/80"><span className="mt-1.5 w-1 h-1 bg-red-500 rounded-full shrink-0" />Built for linear chain: single parent</li>
                                <li className="flex items-start gap-2 text-red-400/80"><span className="mt-1.5 w-1 h-1 bg-red-500 rounded-full shrink-0" />Assumes sequential longest-chain</li>
                                <li className="flex items-start gap-2 text-red-400/80"><span className="mt-1.5 w-1 h-1 bg-red-500 rounded-full shrink-0" />Hard to visualize parallel blocks</li>
                                <li className="flex items-start gap-2 text-red-400/80"><span className="mt-1.5 w-1 h-1 bg-red-500 rounded-full shrink-0" />Tests assume one block at a time</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">BlockDAG Reality</h3>
                            <ul className="space-y-3 text-slate-400 text-sm">
                                <li className="flex items-start gap-2 text-blue-400"><span className="mt-1.5 w-1 h-1 bg-blue-500 rounded-full shrink-0" />Multiple parents (DAG) — parallel</li>
                                <li className="flex items-start gap-2 text-blue-400"><span className="mt-1.5 w-1 h-1 bg-blue-500 rounded-full shrink-0" />GHOSTDAG: blue/red coloring</li>
                                <li className="flex items-start gap-2 text-blue-400"><span className="mt-1.5 w-1 h-1 bg-blue-500 rounded-full shrink-0" />Visibility is critical</li>
                                <li className="flex items-start gap-2 text-blue-400"><span className="mt-1.5 w-1 h-1 bg-blue-500 rounded-full shrink-0" />Need DAG-aware testing</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- 5. ConceptualFlow (Scramble) ---
export const ConceptualFlow = () => {
    const steps = [
        { label: "Block Creation", icon: Code2, desc: "Miners produce blocks with multiple parents (parallel mining)" },
        { label: "DAG Graph", icon: Network, desc: "New blocks added to the block DAG (topological structure)" },
        { label: "GHOSTDAG", icon: Layers, desc: "Colors blocks Blue (confirmed) or Red (conflicting) via anticone analysis" },
        { label: "Ordering", icon: Server, desc: "Derives a deterministic total order over the Blue set" },
        { label: "EVM State", icon: Cpu, desc: "EVM executes transactions sequentially in that total order" },
    ];

    return (
        <section className="py-32 bg-[#080808] border-y border-white/5 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-3 py-1 mb-4 text-xs font-mono text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20"
                    >
                        PIPELINE
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">How DagDev Works</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Pipelined execution model: from parallel block creation to sequential EVM state transitions.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center">
                    {steps.map((step, i) => (
                        <div key={i} className="contents">
                            {/* Step Card Extracted for Hover State */}
                            <StepCard step={step} index={i} />

                            {/* Connector (Horizontal for Desktop, Vertical for Mobile) */}
                            {i < steps.length - 1 && (
                                <div className="relative flex-shrink-0 flex md:items-center justify-center">
                                    {/* Desktop Connector */}
                                    <div className="hidden md:flex items-center w-8 lg:w-16 h-full relative">
                                        <div className="w-full h-[1px] bg-white/5 overflow-hidden relative">
                                            <motion.div
                                                animate={{ x: ["-100%", "200%"] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                                                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"
                                            />
                                        </div>
                                    </div>

                                    {/* Mobile Connector */}
                                    <div className="md:hidden h-12 w-[1px] bg-white/5 relative overflow-hidden my-2">
                                        <motion.div
                                            animate={{ y: ["-100%", "200%"] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                                            className="absolute inset-0 h-1/2 bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-50"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const StepCard = ({ step, index }: { step: any, index: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(59,130,246,0.15)" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative w-full md:w-56 h-64 flex flex-col items-center p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl md:rounded-3xl z-10 hover:border-blue-500/30 transition-all duration-300"
        >
            {/* Step Number */}
            <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-700 group-hover:text-blue-500 transition-colors">
                0{index + 1}
            </div>

            {/* Icon */}
            <div className="w-12 h-12 mb-6 rounded-2xl bg-white/[0.03] flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-300">
                <step.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
            </div>

            {/* Content */}
            <h3 className="text-sm font-semibold text-slate-200 mb-3 text-center h-5">
                <ScrambleText text={step.label} trigger={isHovered} />
            </h3>
            <p className="text-xs leading-relaxed text-slate-500 text-center group-hover:text-slate-400 transition-colors">
                {step.desc}
            </p>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/50 transition-all duration-500" />
        </motion.div>
    );
}

// --- 6. CLI Workflow (Interactive) ---
export const CLIWorkflow = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const commands = [
        {
            cmd: "dagdev init my-dapp",
            desc: "Initialize a new project",
            output: [
                { text: "Creating new DagDev project in /my-dapp...", color: "text-slate-400", delay: 100 },
                { text: "✔ Downloaded template 'basic-typescript'", color: "text-green-400", delay: 400 },
                { text: "✔ Installed dependencies (npm)", color: "text-green-400", delay: 800 },
                { text: "✔ Initialized git repository", color: "text-green-400", delay: 1000 },
                { text: "Project ready! Run 'cd my-dapp' to get started.", color: "text-blue-400", delay: 1200 }
            ]
        },
        {
            cmd: "dagdev node",
            desc: "Start a local DAG node",
            output: [
                { text: "Starting local GHOSTDAG node...", color: "text-slate-400", delay: 100 },
                { text: "✔ Network: local-dev | Port: 16110", color: "text-green-400", delay: 500 },
                { text: "✔ Miner worker started (4 threads)", color: "text-slate-300", delay: 800 },
                { text: "INFO: Genesis block created 0x00...00", color: "text-slate-500", delay: 1200 },
                { text: "INFO: Block added 0x3f...a2 (Blue Score: 1)", color: "text-blue-400", delay: 1800 },
                { text: "INFO: Block added 0x8b...19 (Blue Score: 2)", color: "text-blue-400", delay: 2400 }
            ]
        },
        {
            cmd: "dagdev visualize",
            desc: "Open real-time visualizer",
            output: [
                { text: "Launching visualizer UI...", color: "text-slate-400", delay: 100 },
                { text: "✔ Connected to node ws://localhost:16110", color: "text-green-400", delay: 400 },
                { text: "✔ Serving at http://localhost:3000", color: "text-green-400", delay: 600 },
                { text: "[READY] Waiting for blocks...", color: "text-blue-400", delay: 800 },
                { text: "Opening browser...", color: "text-slate-500", delay: 1200 }
            ]
        },
        {
            cmd: "dagdev compile",
            desc: "Compile smart contracts",
            output: [
                { text: "Compiling 4 Solidity files...", color: "text-slate-400", delay: 100 },
                { text: "✔ artifacts/MyContract.json", color: "text-slate-300", delay: 400 },
                { text: "✔ artifacts/Token.json", color: "text-slate-300", delay: 500 },
                { text: "✔ Compilation finished successfully (1.2s)", color: "text-green-400", delay: 900 }
            ]
        },
        {
            cmd: "dagdev run scripts/deploy.js",
            desc: "Run deployment script",
            output: [
                { text: "Running script 'scripts/deploy.js'...", color: "text-slate-400", delay: 100 },
                { text: "Deploying MyContract to local-dev...", color: "text-slate-300", delay: 600 },
                { text: "✔ Transaction sent: 0x99...2a", color: "text-green-400", delay: 1200 },
                { text: "✔ Contract deployed at: 0x71C...9A", color: "text-blue-400", delay: 1800 }
            ]
        },
        {
            cmd: "dagdev test",
            desc: "Run DAG-aware tests",
            output: [
                { text: "Running 12 tests in test/DagTests.ts", color: "text-slate-400", delay: 100 },
                { text: "✔ Should order blue blocks correctly (45ms)", color: "text-green-400", delay: 500 },
                { text: "✔ Should detect double-spends in anticones (12ms)", color: "text-green-400", delay: 600 },
                { text: "✔ Should confirm transaction after 50 DAA score (120ms)", color: "text-green-400", delay: 900 },
                { text: "12 passing (1.4s)", color: "text-green-400 font-bold", delay: 1100 }
            ]
        },
    ];

    return (
        <section className="py-24 px-6 bg-black relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-6">CLI-First Workflow</h2>
                    <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                        Familiar commands for quick iteration. CI-friendly, compatible with standard Ethereum tooling, but built for DAGs.
                    </p>

                    <div className="space-y-3">
                        {commands.map((c, i) => (
                            <div
                                key={i}
                                className={`group p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between
                                    ${i === activeIndex
                                        ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/5'
                                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                                    }`}
                                onMouseEnter={() => setActiveIndex(i)}
                            >
                                <div>
                                    <div className={`font-mono text-sm mb-1 transition-colors ${i === activeIndex ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-300'}`}>
                                        <span className="opacity-50 mr-2">$</span>{c.cmd}
                                    </div>
                                    <div className="text-slate-500 text-xs">{c.desc}</div>
                                </div>

                                <div className={`transform transition-all duration-300 ${i === activeIndex ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="rounded-xl overflow-hidden bg-[#0a0a0b] border border-white/10 shadow-2xl ring-1 ring-white/5">
                        {/* Windows Controls reflecting active state */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                            </div>
                            <div className="text-xs font-mono text-slate-600 flex items-center gap-2">
                                <Server className="w-3 h-3" />
                                bash — 80x24
                            </div>
                        </div>

                        {/* Interactive Terminal Content */}
                        <div className="p-6 font-mono text-xs md:text-sm text-slate-300 h-[380px] overflow-hidden relative">
                            <AnimatePresence mode="wait">
                                <TerminalWindow key={activeIndex} command={commands[activeIndex]} />
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const TerminalWindow = ({ command }: { command: any }) => {
    const [typedCmd, setTypedCmd] = useState("");
    const [visibleLines, setVisibleLines] = useState<number[]>([]);

    useEffect(() => {
        // 1. Type command
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex <= command.cmd.length) {
                setTypedCmd(command.cmd.slice(0, charIndex));
                charIndex++;
            } else {
                clearInterval(typeInterval);
                // 2. Start showing output lines after command finishes
                command.output.forEach((line: any, idx: number) => {
                    setTimeout(() => {
                        setVisibleLines(prev => [...prev, idx]);
                    }, 300 + line.delay); // 300ms pause after typing
                });
            }
        }, 30); // Typing speed

        return () => clearInterval(typeInterval);
    }, [command]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col"
        >
            {/* Command Line */}
            <div className="flex items-center gap-2 mb-4 text-blue-400">
                <span>➜</span>
                <span>~</span>
                <span className="text-slate-200">{typedCmd}</span>
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-slate-400 block"
                />
            </div>

            {/* Output Lines */}
            <div className="space-y-1">
                {command.output.map((line: any, i: number) => (
                    visibleLines.includes(i) && (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${line.color}`}
                        >
                            {line.text}
                        </motion.div>
                    )
                ))}
            </div>
        </motion.div>
    );
};

// --- 7. Tutorial Video ---
export const TutorialVideo = () => {
    return (
        <section className="py-24 px-6 bg-[#050505] border-t border-white/5">
            <div className="max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono uppercase tracking-widest">
                    <Play className="w-3 h-3" /> Watch Demo
                </div>
                <h2 className="text-3xl font-bold text-white mb-12">See DagDev in Action</h2>

                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group cursor-pointer shadow-2xl shadow-blue-900/10">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/40 transition-colors">
                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white font-bold text-xl">From Init to Deploy in 3 Minutes</h3>
                        <p className="text-slate-400">Learn how to bootstrap a local DAG and deploy your first Smart Contract.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

// --- 8. Core Features ---
// --- 8. Core Features (Interactive Spotlight + Scramble) ---
export const CoreFeatures = () => {
    const features = [
        { title: "Local Node", icon: Server, desc: "Fast, in-process BlockDAG node with configurable parallelism, k parameter and mining interval." },
        { title: "Parallel Mining", icon: Layers, desc: "Simulate 1–10+ parallel blocks per mining round to test concurrent scenarios." },
        { title: "GHOSTDAG Consensus", icon: Network, desc: "Blue/red coloring and anticone analysis for correct confirmation rules." },
        { title: "EVM Compatibility", icon: Cpu, desc: "Deploy and run Solidity contracts using standard Ethereum tooling." },
        { title: "Runtime (DRE)", icon: Play, desc: "Scriptable runtime API: helpers for mining, DAG inspection, and EVM interactions." },
        { title: "DAG-Aware Testing", icon: Check, desc: "Mocha-based runner with custom matchers like toBeInBlueSet() and confirmation helpers." },
        { title: "Real-Time Visualizer", icon: Network, desc: "D3-based force-directed DAG graph with live WebSocket updates and block inspector." },
        { title: "CLI Tools", icon: Terminal, desc: "Familiar commands (init, compile, run, node, test, visualize) for quick iteration." },
    ];

    // Mouse tracking for spotlight effect
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <section className="py-32 px-6 max-w-7xl mx-auto" onMouseMove={handleMouseMove}>
            <div className="mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block px-3 py-1 mb-4 text-xs font-mono text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20"
                >
                    CORE INFRASTRUCTURE
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Everything you need to <br /> build on BlockDAGs.</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {features.map((f, i) => (
                    <FeatureCard key={i} feature={f} index={i} mousePosition={mousePosition} />
                ))}
            </div>
        </section>
    );
};

const FeatureCard = ({ feature, index, mousePosition }: { feature: any, index: number, mousePosition: { x: number, y: number } }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden hover:bg-white/[0.04] transition-colors"
        >
            {/* Spotlight Effect */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59,130,246,0.1), transparent 40%)`
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                <div className="w-10 h-10 mb-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                    <feature.icon className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-bold text-slate-200 mb-3 group-hover:text-white transition-colors h-7">
                    <ScrambleText text={feature.title} trigger={isHovered} />
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
                    {feature.desc}
                </p>
            </div>
        </motion.div>
    );
}



// --- Footer ---
// --- 9. Interactive GHOSTDAG Simulator ---

export const GhostDagSimulator = () => {
    const [blocks, setBlocks] = useState<{ id: number, x: number, y: number, parents: number[], color: string }[]>([
        { id: 0, x: 50, y: 150, parents: [], color: "bg-blue-500" } // Genesis
    ]);
    const [isMining, setIsMining] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const addBlock = useCallback(() => {
        setBlocks(prev => {
            const id = prev.length;
            // Simple DAG logic: pick 1-3 random parents from recent blocks (last 8 to avoid long dormant tips)
            const possibleParents = prev.slice(Math.max(0, prev.length - 8));
            const numParents = Math.min(possibleParents.length, Math.floor(Math.random() * 3) + 1);

            // Prefer tips (blocks with no children yet) - but for sim simplicity just random recent
            const parents = possibleParents
                .sort(() => 0.5 - Math.random()) // Shuffle
                .slice(0, numParents)
                .map(b => b.id);

            // Simple GHOSTDAG simulation: Randomly Blue (mostly) or Red (rarely)
            const isRed = Math.random() > 0.85;
            const color = isRed ? "bg-red-500" : "bg-blue-500";

            // Position: move right, random y jitter within bounds
            const x = 50 + (id * 50);
            const y = 50 + Math.random() * 250;

            return [...prev, { id, x, y, parents, color }];
        });
    }, []);

    // Auto-mine loop
    useEffect(() => {
        if (!isMining) return;

        const interval = setInterval(() => {
            if (blocks.length < 100) { // Safety cap
                addBlock();
            } else {
                setIsMining(false); // Stop after 100 blocks
            }
        }, 800); // New block every 800ms

        return () => clearInterval(interval);
    }, [isMining, blocks.length, addBlock]);

    // Auto-scroll to right
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [blocks]);

    return (
        <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-b from-[#050505] to-[#0a0a0b] overflow-hidden">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                {/* Simulator UI */}
                <div className="order-2 md:order-1 relative h-[400px] w-full rounded-xl border border-white/10 bg-black/50 overflow-hidden shadow-2xl">
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                        <button
                            onClick={addBlock}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-colors shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            <Play className="w-3 h-3" /> MINE
                        </button>
                        <button
                            onClick={() => setIsMining(!isMining)}
                            className={`px-4 py-2 text-white text-xs font-bold rounded-md transition-colors shadow-lg active:scale-95 flex items-center gap-2 ${isMining ? 'bg-amber-600 hover:bg-amber-500' : 'bg-green-600 hover:bg-green-500'}`}
                        >
                            {isMining ? 'PAUSE' : 'AUTO START'}
                        </button>
                        <div className="px-3 py-2 bg-black/40 border border-white/10 rounded-md text-xs text-slate-400 font-mono">
                            BLOCKS: {blocks.length}
                        </div>
                    </div>

                    {/* Visualization Area */}
                    <div ref={scrollRef} className="absolute inset-0 overflow-x-auto overflow-y-hidden scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
                        <div className="relative h-full min-w-[800px]" style={{ width: Math.max(800, blocks.length * 50 + 200) }}>
                            {/* Edges (SVG Overlay) */}
                            <svg className="absolute inset-0 pointer-events-none w-full h-full">
                                {blocks.map(block =>
                                    block.parents.map(parentId => {
                                        // Only render if parent still exists (though we don't delete yet)
                                        const parent = blocks[parentId];
                                        if (!parent) return null;
                                        return (
                                            <motion.line
                                                key={`${block.id}-${parentId}`}
                                                x1={block.x + 16} y1={block.y + 16}
                                                x2={parent.x + 16} y2={parent.y + 16}
                                                stroke="rgba(255,255,255,0.1)"
                                                strokeWidth="1.5"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        );
                                    })
                                )}
                            </svg>

                            {/* Nodes */}
                            <AnimatePresence>
                                {blocks.map(block => (
                                    <motion.div
                                        key={block.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={`absolute w-8 h-8 rounded-full ${block.color} flex items-center justify-center text-[10px] font-bold text-white shadow-lg border border-white/20 z-10 cursor-pointer hover:scale-110 transition-transform`}
                                        style={{ left: block.x, top: block.y }}
                                        whileHover={{ boxShadow: "0 0 15px rgba(59,130,246,0.6)" }}
                                    >
                                        {block.id}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="order-1 md:order-2">
                    <h2 className="text-3xl font-bold text-white mb-6">Understand GHOSTDAG in real time.</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                        Visualizing high-throughput DAGs is hard. DagDev's simulator helps you identify
                        <span className="text-blue-400 mx-1 font-semibold">Blue Sets</span> (accepted),
                        <span className="text-red-400 mx-1 font-semibold">Red Sets</span> (merged but unordered), and confirmation paths instantly.
                    </p>
                    <p className="text-slate-500 font-medium border-l-2 border-slate-700 pl-4">
                        "Blocks are self-mining to demonstrate the high-throughput nature of the K-heavy DAG."
                    </p>
                </div>
            </div>
        </section>
    );
};

export const MinimalFooter = () => {
    return (
        <footer className="py-12 border-t border-white/10 text-center">
            <div className="flex justify-center flex-wrap gap-8 mb-8 text-sm font-medium text-slate-400">
                <a href="https://github.com/virtualconnekt/dag-dev#readme" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Documentation</a>
                <a href="https://github.com/virtualconnekt/dag-dev" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
                <a href="https://www.npmjs.com/package/dagdev" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">npm</a>
                <a href="https://github.com/virtualconnekt/dag-dev/releases" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Changelog</a>
            </div>
            <p className="text-slate-600 text-xs">
                © 2025 DagDev. MIT License.
            </p>
        </footer>
    );
};
