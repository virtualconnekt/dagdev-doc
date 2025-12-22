// React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DocsLayout } from './layouts/DocsLayout';
import { LandingPage } from './pages/LandingPage';
import { MDXWrapper } from './components/mdx/MDXProvider';
import Introduction from './content/introduction.mdx';
import WhyBlockDAG from './content/why-blockdag.mdx';
import Architecture from './content/architecture.mdx';
import Installation from './content/installation.mdx';
import ProjectSetup from './content/setup.mdx';
import LocalNode from './content/local-node.mdx';
import GhostDAG from './content/concepts/ghostdag.mdx';
import BlueRed from './content/concepts/blue-red.mdx';
import Ordering from './content/concepts/ordering.mdx';
import CliInit from './content/cli/init.mdx';
import CliRun from './content/cli/run.mdx';

// Placeholder content pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="prose prose-invert">
    <h1>{title}</h1>
    <p>Documentation content coming soon...</p>
  </div>
);

function App() {
  return (
    <MDXWrapper>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Documentation Routes */}
          <Route path="/docs" element={<DocsLayout />}>
            <Route index element={<Navigate to="/docs/intro" replace />} />
            <Route path="intro" element={<Introduction />} />
            <Route path="why-blockdag" element={<WhyBlockDAG />} />
            <Route path="architecture" element={<Architecture />} />
            <Route path="installation" element={<Installation />} />
            <Route path="setup" element={<ProjectSetup />} />
            <Route path="local-node" element={<LocalNode />} />

            <Route path="concepts">
              <Route path="ghostdag" element={<GhostDAG />} />
              <Route path="blue-red" element={<BlueRed />} />
              <Route path="ordering" element={<Ordering />} />
            </Route>

            <Route path="cli">
              <Route path="init" element={<CliInit />} />
              <Route path="run" element={<CliRun />} />
            </Route>

            <Route path="*" element={<Placeholder title="404 - Not Found" />} />
          </Route>

          {/* Catch all for root level (optional, or redirect to landing) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MDXWrapper>
  );
}

export default App;
