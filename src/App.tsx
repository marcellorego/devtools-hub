import React from 'react';
import { ToolSelector } from './components/ToolSelector';
import { Workspace } from './components/Workspace';
import { useAppStore } from './store/appStore';

function App() {
  const activeTool = useAppStore((state) => state.activeTool);
  const lastUsedTool = useAppStore((state) => state.lastUsedTool);
  const setActiveTool = useAppStore((state) => state.setActiveTool);

  // Initialize with last used tool
  React.useEffect(() => {
    if (lastUsedTool && lastUsedTool !== activeTool) {
      setActiveTool(lastUsedTool);
    }
  }, [lastUsedTool, activeTool, setActiveTool]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden" role="application" aria-label="DevTools Hub - Developer Tools Collection">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-lg z-50 focus:ring-2 focus:ring-purple-300"
      >
        Skip to main content
      </a>
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex h-screen">
        <ToolSelector />
        <Workspace activeTool={activeTool} />
      </div>
    </div>
  );
}

export default App;
