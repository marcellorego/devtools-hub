import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Code, Link, Clock, Hash, Key, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../store/appStore';

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
}

const tools: Tool[] = [
  {
    id: 'jwt',
    name: 'JWT Decoder',
    icon: <Key size={24} />,
    color: 'from-purple-500 to-pink-500',
    glowColor: 'shadow-purple-500/50'
  },
  {
    id: 'base64',
    name: 'Base64',
    icon: <Code size={24} />,
    color: 'from-blue-500 to-cyan-500',
    glowColor: 'shadow-blue-500/50'
  },
  {
    id: 'url',
    name: 'URL Coder',
    icon: <Link size={24} />,
    color: 'from-green-500 to-emerald-500',
    glowColor: 'shadow-green-500/50'
  },
  {
    id: 'epoch',
    name: 'Time Converter',
    icon: <Clock size={24} />,
    color: 'from-orange-500 to-red-500',
    glowColor: 'shadow-orange-500/50'
  },
  {
    id: 'uuid',
    name: 'UUID Gen',
    icon: <Zap size={24} />,
    color: 'from-yellow-500 to-orange-500',
    glowColor: 'shadow-yellow-500/50'
  },
  {
    id: 'hash',
    name: 'Hash Tool',
    icon: <Hash size={24} />,
    color: 'from-indigo-500 to-purple-500',
    glowColor: 'shadow-indigo-500/50'
  }
];

export const ToolSelector: React.FC = () => {
  const activeTool = useAppStore((state) => state.activeTool);
  const setActiveTool = useAppStore((state) => state.setActiveTool);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Remove debug logging for production

  return (
    <div>
      {/* Mobile/Tablet menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden lg:hidden xl:hidden">
        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="min-w-44 min-h-44 w-12 h-12 xs:w-14 xs:h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-200"
          whileTap={{ scale: 0.95 }}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Tablet horizontal toolbar */}
      <div className="hidden md:block lg:hidden fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-2 shadow-2xl">
          <div className="flex items-center gap-2">
            {tools.map((tool, index) => {
              const isActive = activeTool === tool.id;
              return (
                <motion.button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={clsx(
                    "min-w-44 min-h-44 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                    "bg-gradient-to-r border border-white/10",
                    "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                    tool.color,
                    isActive && "ring-2 ring-purple-400/70 scale-110 shadow-xl border-purple-400/50"
                  )}
                  aria-label={`Select ${tool.name} tool`}
                  title={tool.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {tool.icon}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <motion.div
        id="mobile-navigation"
        role="navigation"
        aria-label="Tool navigation menu"
        initial={{ x: -300, opacity: 0 }}
        animate={{
          x: mobileMenuOpen ? 0 : -300,
          opacity: mobileMenuOpen ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-72 xs:w-80 sm:w-96 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 z-50 md:hidden lg:hidden"
      >
        <div className="p-6">
          <h2 className="text-xl xs:text-2xl font-bold text-white mb-6">DevTool Hub</h2>
          <div className="space-y-4">
            {tools.map((tool, index) => {
              const isActive = activeTool === tool.id;
              return (
                <motion.button
                  key={tool.id}
                  onClick={() => {
                    setActiveTool(tool.id);
                    setMobileMenuOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveTool(tool.id);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={clsx(
                    "w-full min-h-44 flex items-center gap-3 px-4 py-4 xs:py-5 rounded-lg transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-purple-500",
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                  aria-label={`Select ${tool.name} tool`}
                  aria-pressed={isActive}
                  role="menuitem"
                  tabIndex={0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {tool.icon}
                  <span className="font-medium">{tool.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Desktop vertical control panel */}
      <div className="hidden lg:block xl:block 2xl:block fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <div className="relative">
          {/* Background glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-purple-600/10 to-pink-600/10 blur-xl rounded-3xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Control panel container */}
          <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-800/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-4 shadow-2xl overflow-visible">
            
            {/* Hub header */}
            <motion.div
              className="mb-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    boxShadow: [
                      "0 0 20px rgba(147, 51, 234, 0.4)",
                      "0 0 40px rgba(147, 51, 234, 0.8)",
                      "0 0 20px rgba(147, 51, 234, 0.4)"
                    ]
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                >
                  <Zap className="text-white" size={24} />
                </motion.div>
              </div>
              <h3 className="text-sm font-bold text-white">DevTools</h3>
              <p className="text-xs text-gray-400">Control Panel</p>
            </motion.div>

            {/* Tool buttons in vertical stack */}
            <div className="space-y-3 overflow-visible">
              {tools.map((tool, index) => {
                const isActive = activeTool === tool.id;

                return (
                  <motion.button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveTool(tool.id);
                      }
                    }}
                    className={clsx(
                      "group relative min-w-44 min-h-44 w-16 h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-xl flex items-center justify-center",
                      "bg-gradient-to-r transition-all duration-300",
                      "hover:scale-110 hover:shadow-xl",
                      "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                      "border border-white/10",
                      "overflow-visible", // Ensure tooltips aren't clipped
                      tool.color,
                      isActive && "ring-2 ring-purple-400/70 scale-110 shadow-xl border-purple-400/50"
                    )}
                    aria-label={`Select ${tool.name} tool`}
                    aria-pressed={isActive}
                    role="button"
                    tabIndex={0}
                    title={tool.name} // Fallback tooltip for accessibility
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                  >
                    <motion.div
                      animate={isActive ? {
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      {tool.icon}
                    </motion.div>

                    {/* Enhanced Tooltip on hover */}
                    <div className="absolute left-20 top-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap z-20 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 scale-95 group-hover:scale-100 transition-all duration-300 ease-out">
                      <div className="bg-gradient-to-r from-gray-900/98 to-gray-800/98 text-white text-sm font-medium px-4 py-3 rounded-xl backdrop-blur-lg border border-gray-600/50 shadow-2xl shadow-black/40">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tool.color} animate-pulse`}></div>
                          {tool.name}
                        </div>
                        {/* Enhanced tooltip arrow */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-transparent border-r-gray-900/98"></div>
                      </div>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute -left-3 top-2 w-1 h-12 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer info */}
            <motion.div
              className="mt-6 pt-4 border-t border-gray-700/50 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>Online</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
