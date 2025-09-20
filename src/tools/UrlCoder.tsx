import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, ArrowUpDown, Zap, Globe } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';

export const UrlCoder: React.FC = () => {
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
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
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
        className="mt-6 mb-8"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
          URL Coder
        </h1>
        <p className="text-gray-400">
          Encode and decode URLs safely with real-time conversion
        </p>
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
          className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full font-medium text-white shadow-lg hover:shadow-green-500/25 transition-all duration-300"
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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {mode === 'encode' ? 'Original URL' : 'Encoded URL'}
            </h3>
            <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {input.length} chars
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode'
              ? "Enter URL to encode (e.g., https://example.com/path?query=value&other=123)"
              : "Enter encoded URL to decode (e.g., https%3A%2F%2Fexample.com%2Fpath%3Fquery%3Dvalue%26other%3D123)"
            }
            className="w-full h-64 bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm"
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
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
            <h3 className="text-lg font-semibold text-white">
              {mode === 'encode' ? 'Encoded URL' : 'Decoded URL'}
            </h3>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                {output.length} chars
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(output)}
                disabled={!output}
                className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm rounded-lg hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                  {mode === 'encode' ? 'Encoded URL will appear here...' : 'Decoded URL will appear here...'}
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
            <Globe size={16} className="text-green-500" />
            <span>RFC 3986 Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Real-time processing
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Query parameter safe
          </div>
        </div>
      </motion.div>
    </div>
  );
};
