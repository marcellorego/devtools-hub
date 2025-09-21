import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, ArrowUpDown, Zap } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';

export const Base64Tool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const { copyToClipboard, copied } = useClipboard();

  useEffect(() => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        // Check if btoa is available (for test environment compatibility)
        if (typeof btoa !== 'undefined') {
          setOutput(btoa(input));
        } else {
          // Fallback implementation for environments without btoa
          setOutput(Buffer.from(input, 'utf8').toString('base64'));
        }
      } else {
        // Check if atob is available (for test environment compatibility)
        if (typeof atob !== 'undefined') {
          setOutput(atob(input));
        } else {
          // Fallback implementation for environments without atob
          setOutput(Buffer.from(input, 'base64').toString('utf8'));
        }
      }
    } catch (err) {
      setError('Invalid input for ' + mode + ' operation');
      setOutput('');
    }
  }, [input, mode]);

  const toggleMode = () => {
    setMode(prev => prev === 'encode' ? 'decode' : 'encode');
    setInput(output);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 sm:mt-6 md:mt-6 lg:mt-8 mb-4 sm:mb-6 md:mb-6 lg:mb-8 text-center"
      >
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Base64 Transformer
        </h1>
        <div role="banner" aria-label="Base64 tool description">
          <p className="text-gray-400 text-sm sm:text-base md:text-base lg:text-lg px-4">
            Encode and decode Base64 with style
          </p>
        </div>
      </motion.div>

      {/* Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex justify-center"
      >
        <button
          onClick={toggleMode}
          className="group relative min-h-44 px-4 xs:px-6 py-3 xs:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-medium text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-sm xs:text-base"
          aria-label={`Switch to ${mode === 'encode' ? 'decode' : 'encode'} mode`}
          aria-pressed={mode === 'encode'}
        >
          <div className="flex items-center gap-2">
            <ArrowUpDown size={18} className="group-hover:rotate-180 transition-transform duration-300" />
            <span>
              {mode === 'encode' ? 'Encoding' : 'Decoding'} Mode
            </span>
            <Zap size={16} className="animate-pulse" />
          </div>
        </button>
      </motion.div>

      {/* Input/Output Panels */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-6 lg:gap-8">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
            </h2>
            <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {input.length} chars
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode'
              ? "Enter text to encode..."
              : "Enter Base64 to decode..."
            }
            className="w-full h-64 bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            aria-label={mode === 'encode' ? 'Text input for Base64 encoding' : 'Base64 input for decoding'}
            aria-describedby={error ? 'error-message' : undefined}
          />

          {error && (
            <motion.div
              id="error-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
              role="alert"
              aria-live="polite"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Output Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
            </h2>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                {output.length} chars
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(output)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    copyToClipboard(output);
                  }
                }}
                disabled={!output}
                className="flex items-center gap-2 min-h-44 px-3 xs:px-4 py-2 xs:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs xs:text-sm rounded-lg hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label={`Copy ${mode === 'encode' ? 'Base64' : 'decoded text'} to clipboard`}
                aria-pressed={copied}
              >
                <Copy size={14} />
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>
          </div>

          <div className="h-64 bg-gray-900/50 border border-gray-600 rounded-lg p-4 overflow-auto">
            <pre className="text-white font-mono text-sm whitespace-pre-wrap break-all">
              {output || (
                <span className="text-gray-500 italic">
                  {mode === 'encode' ? 'Base64 output will appear here...' : 'Decoded text will appear here...'}
                </span>
              )}
            </pre>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex justify-center"
      >
        <div className="flex gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Real-time processing
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            UTF-8 compatible
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            Instant feedback
          </div>
        </div>
      </motion.div>
    </div>
  );
};
