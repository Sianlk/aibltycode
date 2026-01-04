import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  className?: string;
  minHeight?: string;
}

const JAVA_KEYWORDS = [
  'public', 'private', 'protected', 'static', 'void', 'class', 'interface',
  'extends', 'implements', 'new', 'return', 'if', 'else', 'for', 'while',
  'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally',
  'throw', 'throws', 'import', 'package', 'boolean', 'int', 'double', 'float',
  'long', 'short', 'byte', 'char', 'String', 'true', 'false', 'null', 'this', 'super',
  'final', 'abstract', 'synchronized', 'volatile', 'transient', 'native',
];

function highlightJava(code: string): React.ReactNode[] {
  const lines = code.split('\n');
  
  return lines.map((line, lineIndex) => {
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let position = 0;

    while (remaining.length > 0) {
      // Comments
      if (remaining.startsWith('//')) {
        tokens.push(
          <span key={`${lineIndex}-${position}`} className="text-green-500">
            {remaining}
          </span>
        );
        break;
      }

      // Strings
      const stringMatch = remaining.match(/^"(?:[^"\\]|\\.)*"/);
      if (stringMatch) {
        tokens.push(
          <span key={`${lineIndex}-${position}`} className="text-amber-400">
            {stringMatch[0]}
          </span>
        );
        remaining = remaining.slice(stringMatch[0].length);
        position += stringMatch[0].length;
        continue;
      }

      // Numbers
      const numberMatch = remaining.match(/^\d+\.?\d*/);
      if (numberMatch) {
        tokens.push(
          <span key={`${lineIndex}-${position}`} className="text-purple-400">
            {numberMatch[0]}
          </span>
        );
        remaining = remaining.slice(numberMatch[0].length);
        position += numberMatch[0].length;
        continue;
      }

      // Keywords and identifiers
      const wordMatch = remaining.match(/^[a-zA-Z_]\w*/);
      if (wordMatch) {
        const word = wordMatch[0];
        if (JAVA_KEYWORDS.includes(word)) {
          tokens.push(
            <span key={`${lineIndex}-${position}`} className="text-blue-400 font-medium">
              {word}
            </span>
          );
        } else if (word[0] === word[0].toUpperCase()) {
          // Class names (start with capital)
          tokens.push(
            <span key={`${lineIndex}-${position}`} className="text-cyan-400">
              {word}
            </span>
          );
        } else {
          tokens.push(
            <span key={`${lineIndex}-${position}`} className="text-foreground">
              {word}
            </span>
          );
        }
        remaining = remaining.slice(word.length);
        position += word.length;
        continue;
      }

      // Operators and punctuation
      const charMatch = remaining.match(/^[{}()\[\];,.<>=+\-*/%!&|^~?:]/);
      if (charMatch) {
        tokens.push(
          <span key={`${lineIndex}-${position}`} className="text-gray-400">
            {charMatch[0]}
          </span>
        );
        remaining = remaining.slice(1);
        position += 1;
        continue;
      }

      // Whitespace
      if (remaining[0] === ' ' || remaining[0] === '\t') {
        tokens.push(<span key={`${lineIndex}-${position}`}>{remaining[0]}</span>);
        remaining = remaining.slice(1);
        position += 1;
        continue;
      }

      // Default: single character
      tokens.push(<span key={`${lineIndex}-${position}`}>{remaining[0]}</span>);
      remaining = remaining.slice(1);
      position += 1;
    }

    return tokens;
  });
}

export function CodeEditor({
  value,
  onChange,
  language = 'java',
  readOnly = false,
  className,
  minHeight = '300px',
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorLine, setCursorLine] = useState(0);
  
  const lines = value.split('\n');
  const highlightedLines = language === 'java' ? highlightJava(value) : null;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value: currentValue } = textarea;

    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const before = currentValue.substring(0, selectionStart);
      const after = currentValue.substring(selectionEnd);
      const newValue = before + '    ' + after;
      onChange(newValue);
      
      // Restore cursor
      requestAnimationFrame(() => {
        textarea.selectionStart = selectionStart + 4;
        textarea.selectionEnd = selectionStart + 4;
      });
    }

    // Auto-close brackets
    const pairs: Record<string, string> = { '{': '}', '(': ')', '[': ']', '"': '"', "'": "'" };
    if (pairs[e.key]) {
      e.preventDefault();
      const before = currentValue.substring(0, selectionStart);
      const selected = currentValue.substring(selectionStart, selectionEnd);
      const after = currentValue.substring(selectionEnd);
      const newValue = before + e.key + selected + pairs[e.key] + after;
      onChange(newValue);
      
      requestAnimationFrame(() => {
        textarea.selectionStart = selectionStart + 1;
        textarea.selectionEnd = selectionStart + 1 + selected.length;
      });
    }

    // Enter: auto-indent
    if (e.key === 'Enter') {
      const lineStart = currentValue.lastIndexOf('\n', selectionStart - 1) + 1;
      const currentLine = currentValue.substring(lineStart, selectionStart);
      const indentMatch = currentLine.match(/^(\s*)/);
      let indent = indentMatch ? indentMatch[1] : '';
      
      // Add indent after {
      if (currentLine.trimEnd().endsWith('{')) {
        indent += '    ';
      }
      
      if (indent) {
        e.preventDefault();
        const before = currentValue.substring(0, selectionStart);
        const after = currentValue.substring(selectionEnd);
        const newValue = before + '\n' + indent + after;
        onChange(newValue);
        
        requestAnimationFrame(() => {
          const newPos = selectionStart + 1 + indent.length;
          textarea.selectionStart = newPos;
          textarea.selectionEnd = newPos;
        });
      }
    }
  }, [onChange]);

  const handleCursor = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, value: currentValue } = textarea;
    const beforeCursor = currentValue.substring(0, selectionStart);
    const lineNumber = beforeCursor.split('\n').length - 1;
    setCursorLine(lineNumber);
  }, []);

  return (
    <div className={cn('relative rounded-xl overflow-hidden border border-border bg-[#1e1e2e]', className)}>
      {/* Line numbers */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#181825] border-r border-border/50 pointer-events-none z-10">
        <div className="py-3 font-mono text-xs leading-6">
          {lines.map((_, i) => (
            <div
              key={i}
              className={cn(
                'px-2 text-right',
                i === cursorLine ? 'text-primary bg-primary/10' : 'text-muted-foreground/50'
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Code display (for syntax highlighting) */}
      <div
        className="absolute left-12 top-0 right-0 py-3 px-3 font-mono text-sm leading-6 whitespace-pre overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {highlightedLines ? (
          highlightedLines.map((tokens, i) => (
            <div key={i} className={cn(i === cursorLine && 'bg-primary/5')}>
              {tokens}
            </div>
          ))
        ) : (
          lines.map((line, i) => (
            <div key={i} className={cn(i === cursorLine && 'bg-primary/5')}>
              {line || ' '}
            </div>
          ))
        )}
      </div>

      {/* Actual textarea (invisible but interactive) */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={handleCursor}
        onKeyUp={handleCursor}
        readOnly={readOnly}
        className={cn(
          'w-full bg-transparent text-transparent caret-primary',
          'py-3 pl-[60px] pr-3 font-mono text-sm leading-6',
          'resize-none outline-none',
          'selection:bg-primary/30'
        )}
        style={{ minHeight }}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  );
}
