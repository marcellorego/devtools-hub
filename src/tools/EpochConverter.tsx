import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Clock, Zap, Globe } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { useClipboard } from '../hooks/useClipboard';

export const EpochConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'toDate' | 'toEpoch'>('toDate');
  const [timezone, setTimezone] = useState<'local' | 'utc'>('local');
  const [includeMilliseconds, setIncludeMilliseconds] = useState(false);
  const [error, setError] = useState('');
  const { copyToClipboard, copied } = useClipboard();

  useEffect(() => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'toDate') {
        // Convert epoch to date
        const epoch = parseFloat(input);
        if (isNaN(epoch)) {
          throw new Error('Invalid epoch timestamp');
        }

        const date = new Date(epoch * (includeMilliseconds ? 1 : 1000));

        if (timezone === 'utc') {
          setOutput(format(date, 'yyyy-MM-dd HH:mm:ss.SSS \'UTC\''));
        } else {
          setOutput(format(date, 'yyyy-MM-dd HH:mm:ss.SSS zzz'));
        }
      } else {
        // Convert date to epoch
        let date: Date;

        if (/^\d{4}-\d{2}-\d{2}/.test(input)) {
          // ISO format
          date = parseISO(input);
        } else {
          // Try to parse as date string
          date = new Date(input);
        }

        if (!isValid(date)) {
          throw new Error('Invalid date format');
        }

        const epoch = includeMilliseconds ? date.getTime() : Math.floor(date.getTime() / 1000);
        setOutput(epoch.toString());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
      setOutput('');
    }
  }, [input, mode, timezone, includeMilliseconds]);

  const toggleMode = () => {
    setMode(prev => prev === 'toDate' ? 'toEpoch' : 'toDate');
    setInput(output);
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    const timestamp = includeMilliseconds ? now.getTime() : Math.floor(now.getTime() / 1000);
    setInput(timestamp.toString());
    setMode('toDate');
  };

  const getCurrentDate = () => {
    const now = new Date();
    const dateStr = format(now, 'yyyy-MM-dd HH:mm:ss');
    setInput(dateStr);
    setMode('toEpoch');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 mb-8"
      >
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
          Time Converter
        </h1>
        <p className="text-gray-400">
          Convert between Unix timestamps and human-readable dates with timezone support
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={toggleMode}
          className="group relative px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-full font-medium text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
        >
          <div className="flex items-center gap-2">
            <Clock size={18} className="group-hover:rotate-180 transition-transform duration-300" />
            <span>
              {mode === 'toDate' ? 'Timestamp → Date' : 'Date → Timestamp'}
            </span>
            <Zap size={16} className="animate-pulse" />
          </div>
        </button>

        <div className="flex gap-2">
          <button
            onClick={getCurrentTimestamp}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Now (Epoch)
          </button>
          <button
            onClick={getCurrentDate}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Now (Date)
          </button>
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex flex-wrap gap-4 justify-center"
      >
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Timezone:</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value as 'local' | 'utc')}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm"
          >
            <option value="local">Local</option>
            <option value="utc">UTC</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">
            <input
              type="checkbox"
              checked={includeMilliseconds}
              onChange={(e) => setIncludeMilliseconds(e.target.checked)}
              className="mr-2"
            />
            Milliseconds
          </label>
        </div>
      </motion.div>

      {/* Input/Output Panels */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-6 lg:gap-8">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {mode === 'toDate' ? 'Epoch Timestamp' : 'Date/Time Input'}
            </h3>
            <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {input.length} chars
            </div>
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'toDate'
                ? includeMilliseconds
                  ? "e.g., 1704067200000"
                  : "e.g., 1704067200"
                : "e.g., 2024-01-01 00:00:00"
            }
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
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

          <div className="mt-4 text-xs text-gray-500">
            {mode === 'toDate' && (
              <div>
                Enter Unix timestamp ({includeMilliseconds ? 'milliseconds' : 'seconds'} since 1970-01-01)
              </div>
            )}
            {mode === 'toEpoch' && (
              <div>
                Enter date in format: YYYY-MM-DD HH:mm:ss or ISO format
              </div>
            )}
          </div>
        </motion.div>

        {/* Output Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {mode === 'toDate' ? 'Human Readable Date' : 'Unix Timestamp'}
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(output)}
              disabled={!output}
              className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm rounded-lg hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Copy size={14} />
              {copied ? 'Copied!' : 'Copy'}
            </motion.button>
          </div>

          <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 min-h-[120px] flex items-center">
            <div className="text-orange-400 font-mono text-lg">
              {output || (
                <span className="text-gray-500 italic text-base">
                  Result will appear here...
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex justify-center"
      >
        <div className="flex gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-orange-500" />
            <span>Timezone: {timezone.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-red-500" />
            <span>Precision: {includeMilliseconds ? 'ms' : 's'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            Real-time conversion
          </div>
        </div>
      </motion.div>
    </div>
  );
};
