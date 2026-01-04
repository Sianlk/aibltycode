import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle, XCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationResult {
  success: boolean;
  output?: string;
  errors?: string[];
  hints?: string[];
}

interface OutputConsoleProps {
  result: ValidationResult | null;
  isLoading?: boolean;
  className?: string;
}

export function OutputConsole({ result, isLoading, className }: OutputConsoleProps) {
  return (
    <div className={cn('rounded-xl border border-border overflow-hidden bg-[#1e1e2e]', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#181825] border-b border-border/50">
        <Terminal className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Output</span>
        
        {result && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto"
          >
            {result.success ? (
              <div className="flex items-center gap-1.5 text-green-500">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Passed!</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-500">
                <XCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Error</span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 font-mono text-sm min-h-[120px] max-h-[300px] overflow-auto">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Running code...</span>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {/* Output */}
              {result.output && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Output:</div>
                  <pre className="text-green-400 whitespace-pre-wrap">{result.output}</pre>
                </div>
              )}

              {/* Errors */}
              {result.errors && result.errors.length > 0 && (
                <div className="space-y-2">
                  {result.errors.map((error, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-red-400"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Hints */}
              {result.hints && result.hints.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-2 text-yellow-500 mb-2">
                    <Lightbulb className="h-4 w-4" />
                    <span className="text-xs font-medium">Hints</span>
                  </div>
                  <ul className="space-y-1.5">
                    {result.hints.map((hint, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="text-yellow-200/80 text-xs"
                      >
                        💡 {hint}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success message */}
              {result.success && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">🎉 Great job! Your code works correctly!</span>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground/50"
            >
              Click "Run Code" to see output here...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
