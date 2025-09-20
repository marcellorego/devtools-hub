import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Hash as HashIcon, Zap, LayoutGrid, LayoutList } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';

export const HashTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [algorithm, setAlgorithm] = useState<'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256');
  const [isProcessing, setIsProcessing] = useState(false);
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [processingTime, setProcessingTime] = useState<number>(0);
  const { copyToClipboard, copied } = useClipboard();

  useEffect(() => {
    if (!input.trim()) {
      setHash('');
      setProcessingTime(0);
      return;
    }

    const generateHash = async () => {
      setIsProcessing(true);
      const startTime = performance.now();

      try {
        // Algorithm mapping for Web Crypto API
        const algorithmMap = {
          'SHA-1': 'SHA-1',
          'SHA-256': 'SHA-256',
          'SHA-384': 'SHA-384',
          'SHA-512': 'SHA-512'
        } as const;

        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest(algorithmMap[algorithm], data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const endTime = performance.now();
        setProcessingTime(endTime - startTime);
        setHash(hashHex);
      } catch (error) {
        console.error('Hash generation failed:', error);
        setHash('Error generating hash');
      } finally {
        setIsProcessing(false);
      }
    };

    generateHash();
  }, [input, algorithm]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 mb-8"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Hash Tool
        </h1>
        <p className="text-gray-400">
          Generate cryptographic hashes with real-time processing and instant feedback
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col sm:flex-row gap-4 justify-center"
      >
        {/* Algorithm Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Algorithm:</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as typeof algorithm)}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm"
          >
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-384">SHA-384</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </div>

        {/* Layout Toggle */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-full p-1 flex gap-1">
          <button
            onClick={() => setLayout('horizontal')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              layout === 'horizontal'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setLayout('vertical')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              layout === 'vertical'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutList size={16} />
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 ${layout === 'horizontal' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'flex flex-col gap-6'}`}>
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: layout === 'horizontal' ? -50 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <HashIcon size={20} />
              Input Text
            </h3>
            <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {input.length} chars
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="w-full h-64 bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
          />

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-indigo-500 animate-pulse' : 'bg-gray-600'}`}></div>
              {isProcessing ? 'Processing...' : 'Ready'}
            </div>
            {processingTime > 0 && (
              <div className="flex items-center gap-2">
                <Zap size={14} />
                {processingTime.toFixed(2)}ms
              </div>
            )}
          </div>
        </motion.div>

        {/* Output Panel */}
        <motion.div
          initial={{ opacity: 0, x: layout === 'horizontal' ? 50 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <HashIcon size={20} />
              {algorithm} Hash (Hex)
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(hash)}
              disabled={!hash || hash === 'Error generating hash'}
              className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-lg hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Copy size={14} />
              {copied ? 'Copied!' : 'Copy'}
            </motion.button>
          </div>

          <div className="h-64 bg-gray-900/50 border border-gray-600 rounded-lg p-4 overflow-auto">
            <pre className="text-indigo-400 font-mono text-sm break-all leading-relaxed">
              {hash && hash !== 'Error generating hash' ? (
                <>
                  {hash.match(/.{1,8}/g)?.map((chunk, index) => (
                    <span key={index} className="inline-block mr-1">
                      {chunk}
                    </span>
                  ))}
                </>
              ) : (
                <span className="text-gray-500 italic">
                  {hash === 'Error generating hash' ? 'Error generating hash' : 'Hash will appear here...'}
                </span>
              )}
            </pre>
          </div>

          {hash && hash !== 'Error generating hash' && (
            <div className="mt-4 text-xs text-gray-500">
              {hash.length}-character hexadecimal string ({hash.length / 2} bytes)
            </div>
          )}
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
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            {algorithm} Algorithm
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            Web Crypto API
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Real-time Processing
          </div>
        </div>
      </motion.div>
    </div>
  );
};
