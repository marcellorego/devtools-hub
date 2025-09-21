import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, RefreshCw, Zap, Hash, Clock } from 'lucide-react';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { useClipboard } from '../hooks/useClipboard';

export const UuidGenerator: React.FC = () => {
  const [version, setVersion] = useState<'v4' | 'v5'>('v4');
  const [uuid, setUuid] = useState('');
  const [namespace, setNamespace] = useState('6ba7b810-9dad-11d1-80b4-00c04fd430c8'); // DNS namespace
  const [name, setName] = useState('');
  const [timestamp, setTimestamp] = useState<Date | null>(null);
  const { copyToClipboard, copied } = useClipboard();

  const generateUuid = useCallback(() => {
    const now = new Date();
    setTimestamp(now);

    if (version === 'v4') {
      setUuid(uuidv4());
    } else {
      if (!name.trim()) {
        setName('example.com');
      }
      try {
        setUuid(uuidv5(name || 'example.com', namespace));
      } catch (error) {
        console.error('Invalid namespace UUID:', error);
        setUuid(uuidv4()); // Fallback to v4
        setVersion('v4');
      }
    }
  }, [version, name, namespace]);

  const handleVersionChange = (newVersion: 'v4' | 'v5') => {
    setVersion(newVersion);
    if (newVersion === 'v4') {
      setUuid(uuidv4());
      setTimestamp(new Date());
    } else {
      if (!name.trim()) setName('example.com');
      try {
        setUuid(uuidv5(name || 'example.com', namespace));
        setTimestamp(new Date());
      } catch (error) {
        setUuid(uuidv4()); // Fallback
      }
    }
  };

  // Generate initial UUID
  React.useEffect(() => {
    generateUuid();
  }, [generateUuid]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 mb-8"
      >
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
          UUID Generator
        </h1>
        <p className="text-gray-400">
          Generate RFC 4122 compliant UUIDs with v4 random and v5 name-based options
        </p>
      </motion.div>

      {/* Version Selector */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex justify-center"
      >
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-full p-1 flex gap-1">
          <button
            onClick={() => handleVersionChange('v4')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              version === 'v4'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            UUID v4 (Random)
          </button>
          <button
            onClick={() => handleVersionChange('v5')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              version === 'v5'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            UUID v5 (Name-based)
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-6 lg:gap-8">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Hash size={20} />
            Configuration
          </h3>

          {version === 'v5' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Namespace UUID
                </label>
                <input
                  type="text"
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  placeholder="e.g., 6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  DNS: 6ba7b810-9dad-11d1-80b4-00c04fd430c8<br />
                  URL: 6ba7b811-9dad-11d1-80b4-00c04fd430c8
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., example.com"
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateUuid}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg font-medium shadow-lg hover:shadow-yellow-500/25 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} className="animate-spin" />
            Generate UUID {version.toUpperCase()}
          </motion.button>
        </motion.div>

        {/* Output Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap size={20} />
              Generated UUID
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(uuid)}
              disabled={!uuid}
              className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-sm rounded-lg hover:shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Copy size={14} />
              {copied ? 'Copied!' : 'Copy'}
            </motion.button>
          </div>

          <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 mb-4">
            <pre className="text-yellow-400 font-mono text-lg break-all">
              {uuid || 'UUID will appear here...'}
            </pre>
          </div>

          {timestamp && (
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Clock size={14} />
              Generated at: {timestamp.toLocaleString()}
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
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            RFC 4122 Compliant
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            Cryptographically Secure
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            Version {version.toUpperCase()} Generation
          </div>
        </div>
      </motion.div>
    </div>
  );
};
