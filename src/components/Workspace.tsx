import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import ErrorBoundary from './ErrorBoundary';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-full">
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-gray-400">Loading tool...</p>
    </motion.div>
  </div>
);

// Lazy load tools for better performance
const Base64Tool = lazy(() => import('../tools/Base64Tool').then(module => ({ default: module.Base64Tool })));
const JwtDecoder = lazy(() => import('../tools/JwtDecoder').then(module => ({ default: module.JwtDecoder })));
const UrlCoder = lazy(() => import('../tools/UrlCoder').then(module => ({ default: module.UrlCoder })));
const EpochConverter = lazy(() => import('../tools/EpochConverter').then(module => ({ default: module.EpochConverter })));
const UuidGenerator = lazy(() => import('../tools/UuidGenerator').then(module => ({ default: module.UuidGenerator })));
const HashTool = lazy(() => import('../tools/HashTool').then(module => ({ default: module.HashTool })));

interface WorkspaceProps {
  activeTool: string;
  desktopSidebarPinned: boolean;
}

const toolComponents = {
  base64: Base64Tool,
  jwt: JwtDecoder,
  url: UrlCoder,
  epoch: EpochConverter,
  uuid: UuidGenerator,
  hash: HashTool,
};

const toolNames = {
  base64: 'Base64 Tool',
  jwt: 'JWT Decoder',
  url: 'URL Coder',
  epoch: 'Epoch Converter',
  uuid: 'UUID Generator',
  hash: 'Hash Tool',
};

const workspaceVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -50,
    transition: {
      duration: 0.2
    }
  }
};

export const Workspace: React.FC<WorkspaceProps> = ({ activeTool, desktopSidebarPinned }) => {
  const ActiveToolComponent = toolComponents[activeTool as keyof typeof toolComponents];

  return (
    <main 
      id="main-content" 
      className={clsx(
        "flex-1 pt-16 md:pt-18 lg:pt-0 p-4 sm:p-6 md:p-6 lg:p-8 xl:p-12 transition-all duration-300 mobile-scroll-content tablet-scroll-content content-with-fixed-nav",
        // Mobile and tablet - no sidebar interference
        "ml-0 md:ml-0", 
        // Desktop margin - only when sidebar is pinned (always visible) - reduced gap
        desktopSidebarPinned ? "lg:ml-[20rem]" : "lg:ml-0"
      )}
    >
      <div className="max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-7xl mx-auto min-h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            variants={workspaceVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-full"
          >
            {/* Background grid effect */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }}
              />
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>

            {/* Tool content */}
            <div className="relative z-10 min-h-full">
              {ActiveToolComponent ? (
                <ErrorBoundary toolName={toolNames[activeTool as keyof typeof toolNames]}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <ActiveToolComponent />
                  </Suspense>
                </ErrorBoundary>
              ) : (
                <div className="flex items-center justify-center min-h-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                      Welcome to DevTool Hub
                    </h2>
                    <p className="text-gray-400 text-lg">
                      Select a tool from the control panel to get started
                    </p>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};
