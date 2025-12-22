import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import clsx from 'clsx';

interface Node {
    id: string;
    group: 'blue' | 'red' | 'pending';
    height: number;
}

interface Link {
    source: string;
    target: string;
}

interface DAGDiagramProps {
    blockCount?: number;
    className?: string;
}

export function DAGDiagram({ blockCount = 20, className }: DAGDiagramProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

    useEffect(() => {
        if (!containerRef.current) return;
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: 400 });
    }, []);

    useEffect(() => {
        if (!svgRef.current) return;

        // Generate random DAG data
        const nodes: Node[] = [];
        const links: Link[] = [];

        // Genesis
        nodes.push({ id: '0', group: 'blue', height: 0 });

        for (let i = 1; i < blockCount; i++) {
            const height = i; // Simplified time/height
            // Determine group (Blue vs Red) - simplified simulation
            const isRed = Math.random() > 0.8;

            nodes.push({
                id: String(i),
                group: isRed ? 'red' : 'blue',
                height
            });

            // Connect to recent blocks (1 to 3 parents)
            const numParents = Math.floor(Math.random() * 3) + 1;
            const potentialParents = nodes.filter(n => n.id !== String(i) && parseInt(n.id) < i).slice(-5); // Recent 5

            // Always pick at least one
            if (potentialParents.length > 0) {
                const parents = d3.shuffle(potentialParents).slice(0, numParents);
                parents.forEach((p: Node) => {
                    links.push({ source: String(i), target: p.id });
                });
            }
        }

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous

        const width = dimensions.width;
        const height = dimensions.height;

        // Force Simulation
        const simulation = d3.forceSimulation(nodes as any)
            .force("link", d3.forceLink(links).id((d: any) => d.id).distance(50))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("y", d3.forceY((d: any) => height - (d.height * 20)).strength(0.1)) // Flow upwards or downwards? Let's flow Left to Right
            .force("x", d3.forceX((d: any) => (d.height * 50)).strength(0.5));

        // Re-adjust for Left-to-Right flow
        simulation.force("x", d3.forceX((d: any) => 50 + (d.height * 40)).strength(1))
            .force("y", d3.forceY(height / 2).strength(0.1));


        const link = svg.append("g")
            .attr("stroke", "#334155")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 1.5);

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 6)
            .attr("fill", (d: any) => d.group === 'blue' ? '#3b82f6' : '#ef4444')
            .call(drag(simulation) as any);

        node.append("title")
            .text((d: any) => `Block #${d.id} (${d.group})`);

        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);
        });

        function drag(simulation: any) {
            function dragstarted(event: any) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event: any) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event: any) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        return () => {
            simulation.stop();
        };
    }, [blockCount, dimensions]);

    return (
        <div ref={containerRef} className={clsx("w-full overflow-hidden rounded-lg bg-[#0d1117] border border-white/10", className)}>
            <div className="absolute p-4 text-xs text-slate-500 pointer-events-none">
                DAG Visualization (Blue = Main Chain/Set, Red = Anticone)
            </div>
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} />
        </div>
    );
}
