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

          {/* Tool buttons in a circle - improved positioning */}
          <div className="relative w-[28rem] h-[28rem]">
            {tools.map((tool, index) => {
              const angle = (index * 360) / tools.length;
              const radius = 160; // Optimized radius for 6 tools
              const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
              const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

              const isActive = activeTool === tool.id;

              return (
                <motion.button
                  key={tool.id}
                className={clsx(
                  "absolute w-20 h-20 rounded-full flex items-center justify-center",
                  "bg-gradient-to-r transition-all duration-300",
                  "hover:scale-110 hover:shadow-2xl",
                  "focus:outline-none focus:ring-2 focus:ring-white/50",
                  "border-2 border-white/20",
                  tool.color,
                  tool.glowColor,
                  isActive && "ring-4 ring-white/70 scale-125 shadow-2xl border-white/50"
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

                  {/* Tool label - improved positioning and visibility */}
                  <motion.div
                    className={clsx(
                      "absolute -bottom-16 left-1/2 -translate-x-1/2",
                      "text-xs font-medium text-white/90 whitespace-nowrap",
                      "bg-black/80 px-3 py-1.5 rounded-lg backdrop-blur-sm",
                      "pointer-events-none shadow-lg",
                      "border border-white/10",
                      isActive && "bg-purple-600/90 text-white border-purple-400/60 shadow-purple-500/50"
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: isActive ? 1 : 0.8,
                      y: isActive ? 0 : 3,
                      scale: isActive ? 1.05 : 0.95
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {tool.name}
                  </motion.div>
                </motion.button>
              );
            })}

            {/* Center hub - proportional to larger circle */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-purple-500/50 flex items-center justify-center shadow-2xl">
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 25px rgba(147, 51, 234, 0.4)",
                      "0 0 50px rgba(147, 51, 234, 0.7)",
                      "0 0 25px rgba(147, 51, 234, 0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="text-white" size={28} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
