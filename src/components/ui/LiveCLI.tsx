import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface LiveCLIProps {
    steps: {
        cmd: string;
        output?: string;
        delay?: number; // Delay before this step starts
    }[];
    autoPlay?: boolean;
    loop?: boolean;
    className?: string;
}

export function LiveCLI({ steps, autoPlay = true, loop = true, className }: LiveCLIProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [displayedCmd, setDisplayedCmd] = useState('');
    const [showOutput, setShowOutput] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const started = autoPlay;

    const timeoutRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!started) return;

        const currentStep = steps[currentStepIndex];
        let charIndex = 0;

        // Reset state for new step
        setDisplayedCmd('');
        setShowOutput(false);

        const typeCommand = () => {
            if (charIndex <= currentStep.cmd.length) {
                setDisplayedCmd(currentStep.cmd.slice(0, charIndex));
                charIndex++;
                timeoutRef.current = setTimeout(typeCommand, 50 + Math.random() * 50); // Random typing speed
            } else {
                // Finished typing
                timeoutRef.current = setTimeout(() => {
                    setShowOutput(true);

                    // Wait before next step
                    const nextDelay = currentStep.output ? 2000 : 1000;
                    timeoutRef.current = setTimeout(() => {
                        if (currentStepIndex < steps.length - 1) {
                            setCurrentStepIndex(prev => prev + 1);
                        } else if (loop) {
                            setCurrentStepIndex(0);
                            setDisplayedCmd('');
                            setShowOutput(false);
                        }
                    }, nextDelay);

                }, 300);
            }
        };

        timeoutRef.current = setTimeout(typeCommand, 300);

        return () => clearTimeout(timeoutRef.current);
    }, [currentStepIndex, started, loop, steps]);

    const handleCopy = () => {
        const fullScript = steps.map(s => s.cmd).join('\n');
        navigator.clipboard.writeText(fullScript);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className={clsx("rounded-lg overflow-hidden border border-white/10 bg-[#0d1117] font-mono text-sm", className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-2 text-slate-400">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs">simulated-terminal</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="text-slate-500 hover:text-white transition-colors"
                    title="Copy to clipboard"
                >
                    {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            {/* Terminal Content */}
            <div className="p-4 min-h-[160px] text-slate-300">
                {/* Previous completed steps */}
                {steps.slice(0, currentStepIndex).map((step, idx) => (
                    <div key={idx} className="mb-4">
                        <div className="flex gap-2 text-blue-400">
                            <span>$</span>
                            <span className="text-slate-200">{step.cmd}</span>
                        </div>
                        {step.output && (
                            <div className="mt-1 text-slate-500 whitespace-pre-wrap">{step.output}</div>
                        )}
                    </div>
                ))}

                {/* Current Step */}
                <div className="mb-4">
                    <div className="flex gap-2 text-blue-400">
                        <span>$</span>
                        <span className="text-slate-200">
                            {displayedCmd}
                            <span className="animate-pulse inline-block w-2 H-4 bg-blue-500/50 align-middle ml-1">&nbsp;</span>
                        </span>
                    </div>
                    {showOutput && steps[currentStepIndex].output && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-1 text-slate-500 whitespace-pre-wrap"
                        >
                            {steps[currentStepIndex].output}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
