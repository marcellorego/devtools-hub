import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useAppStore } from '../store/appStore';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  toolName?: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Log error to monitoring service (in development, just console)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Could send to error tracking service like Sentry
    // reportError(error, errorInfo, this.props.toolName);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error!} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError
}) => {
  const setActiveTool = useAppStore((state) => state.setActiveTool);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center h-full"
    >
      <div className="bg-gradient-to-br from-red-900/50 to-red-800/50 backdrop-blur-sm border border-red-500/50 rounded-2xl p-8 max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={32} className="text-red-400" />
          <h3 className="text-xl font-semibold text-white">Something went wrong</h3>
        </div>

        <p className="text-red-300 mb-6">
          An error occurred while loading this tool. This might be due to invalid input or a temporary issue.
        </p>

        <div className="bg-red-950/50 rounded-lg p-3 mb-6">
          <p className="text-xs text-red-400 font-mono break-all">
            {error.message}
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetError}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTool('base64')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            <Home size={16} />
            Go Home
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorBoundary;
