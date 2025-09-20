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
    icon: <Key size={20} />,
    color: 'from-purple-500 to-pink-500',
    glowColor: 'shadow-purple-500/50'
  },
  {
    id: 'base64',
    name: 'Base64',
    icon: <Code size={20} />,
    color: 'from-blue-500 to-cyan-500',
    glowColor: 'shadow-blue-500/50'
  },
  {
    id: 'url',
    name: 'URL Coder',
    icon: <Link size={20} />,
    color: 'from-green-500 to-emerald-500',
    glowColor: 'shadow-green-500/50'
  },
  {
    id: 'epoch',
    name: 'Time Converter',
    icon: <Clock size={20} />,
    color: 'from-orange-500 to-red-500',
    glowColor: 'shadow-orange-500/50'
  },
  {
    id: 'uuid',
    name: 'UUID Gen',
    icon: <Zap size={20} />,
    color: 'from-yellow-500 to-orange-500',
    glowColor: 'shadow-yellow-500/50'
  },
  {
    id: 'hash',
    name: 'Hash Tool',
    icon: <Hash size={20} />,
    color: 'from-indigo-500 to-purple-500',
    glowColor: 'shadow-indigo-500/50'
  }
];

export const ToolSelector: React.FC = () => {
  const activeTool = useAppStore((state) => state.activeTool);
  const setActiveTool = useAppStore((state) => state.setActiveTool);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debug: Log tools array
  React.useEffect(() => {
    console.log('Tools array:', tools);
    console.log('Active tool:', activeTool);
  }, [activeTool]);

  return (
    <div>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-4 focus:ring-white/50"
          whileTap={{ scale: 0.95 }}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
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
        className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 z-50 lg:hidden"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">DevTool Hub</h2>
          <div className="space-y-3">
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
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
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

      {/* Desktop circular selector */}
      <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-50">
        <div className="relative">
          {/* Central hub glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl pointer-events-none"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Tool buttons in a circle - responsive sizing */}
          <div className="relative w-96 h-96">
            {tools.map((tool, index) => {
              const angle = (index * 360) / tools.length;
              const radius = 140; // Increased radius for better spacing
              const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
              const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

              const isActive = activeTool === tool.id;

              // Debug logging
              console.log(`Tool ${index}: ${tool.name}, angle: ${angle}, x: ${x}, y: ${y}, active: ${isActive}`);

              return (
                <motion.button
                  key={tool.id}
                className={clsx(
                  "absolute w-16 h-16 rounded-full flex items-center justify-center",
                  "bg-gradient-to-r transition-all duration-300",
                  "hover:scale-110 hover:shadow-2xl",
                  "focus:outline-none focus:ring-2 focus:ring-white/50",
                  tool.color,
                  tool.glowColor,
                  isActive && "ring-4 ring-white/70 scale-125 shadow-2xl"
                )}
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
                  }}
                  onClick={() => setActiveTool(tool.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveTool(tool.id);
                    }
                  }}
                  aria-label={`Select ${tool.name} tool`}
                  aria-pressed={isActive}
                  role="button"
                  tabIndex={0}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                >
                  <motion.div
                    animate={isActive ? {
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {tool.icon}
                  </motion.div>

                  {/* Tool label - show for all tools with better positioning */}
                  <motion.div
                    className={clsx(
                      "absolute -bottom-14 left-1/2 -translate-x-1/2",
                      "text-xs font-medium text-white/80 whitespace-nowrap",
                      "bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm",
                      "pointer-events-none",
                      isActive && "bg-purple-600/80 text-white border border-purple-400/50"
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: isActive ? 1 : 0.6,
                      y: isActive ? 0 : 5,
                      scale: isActive ? 1 : 0.9
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {tool.name}
                  </motion.div>
                </motion.button>
              );
            })}

            {/* Center hub */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-purple-500/50 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(147, 51, 234, 0.3)",
                      "0 0 40px rgba(147, 51, 234, 0.6)",
                      "0 0 20px rgba(147, 51, 234, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="text-white" size={24} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
