import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface StenoKeyboardProps {
  onKeyPress: (key: string) => void;
  pressedKeys: Set<string>;
  highlightKeys?: string[];
  className?: string;
}

const STENO_LAYOUT = {
  left: [
    ['S-', 'T-', 'K-', 'P-', 'W-', 'H-'],
    ['S-', 'K-', 'W-', 'R-']
  ],
  vowels: ['A-', 'O-', 'E-', 'U-'],
  right: [
    ['-F', '-R', '-P', '-B', '-L', '-G'],
    ['-T', '-S', '-D', '-Z']
  ],
  numbers: ['#', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
};

export const StenoKeyboard: React.FC<StenoKeyboardProps> = ({
  onKeyPress,
  pressedKeys,
  highlightKeys = [],
  className
}) => {
  const [keyStates, setKeyStates] = useState<Map<string, 'normal' | 'pressed' | 'highlight' | 'correct' | 'incorrect'>>(new Map());

  useEffect(() => {
    const newStates = new Map();
    
    // Set all keys to normal first
    [...STENO_LAYOUT.left.flat(), ...STENO_LAYOUT.vowels, ...STENO_LAYOUT.right.flat(), ...STENO_LAYOUT.numbers].forEach(key => {
      if (pressedKeys.has(key)) {
        newStates.set(key, 'pressed');
      } else if (highlightKeys.includes(key)) {
        newStates.set(key, 'highlight');
      } else {
        newStates.set(key, 'normal');
      }
    });
    
    setKeyStates(newStates);
  }, [pressedKeys, highlightKeys]);

  const handleKeyClick = (key: string) => {
    onKeyPress(key);
  };

  const renderKey = (key: string, extraClasses = '') => {
    const state = keyStates.get(key) || 'normal';
    
    return (
      <button
        key={key}
        onClick={() => handleKeyClick(key)}
        className={cn(
          'steno-key relative px-3 py-2 text-sm font-semibold transition-smooth hover:scale-105 active:scale-95',
          {
            'steno-key active animate-pulse-glow': state === 'pressed',
            'bg-warning text-warning-foreground': state === 'highlight',
            'steno-key correct': state === 'correct',
            'steno-key incorrect': state === 'incorrect',
          },
          extraClasses
        )}
      >
        {key}
      </button>
    );
  };

  return (
    <div className={cn('select-none p-6 bg-card rounded-2xl shadow-card border border-border', className)}>
      {/* Number Row */}
      <div className="flex justify-center gap-1 mb-4">
        {STENO_LAYOUT.numbers.map(key => renderKey(key, 'text-xs'))}
      </div>

      {/* Main Keyboard Layout */}
      <div className="flex justify-center gap-8">
        {/* Left Side */}
        <div className="flex flex-col gap-2">
          {STENO_LAYOUT.left.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map(key => renderKey(key))}
            </div>
          ))}
        </div>

        {/* Vowels */}
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-1">
            {STENO_LAYOUT.vowels.map(key => renderKey(key, 'bg-secondary text-secondary-foreground'))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-2">
          {STENO_LAYOUT.right.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map(key => renderKey(key))}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Click keys or use your steno machine. Press multiple keys to form chords.</p>
      </div>
    </div>
  );
};