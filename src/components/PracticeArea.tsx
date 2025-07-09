import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Zap, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PracticeAreaProps {
  text: string;
  onComplete: (stats: PracticeStats) => void;
  className?: string;
}

interface PracticeStats {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  totalStrokes: number;
  correctStrokes: number;
}

export const PracticeArea: React.FC<PracticeAreaProps> = ({
  text,
  onComplete,
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [mistakes, setMistakes] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer effect
  useEffect(() => {
    if (startTime && !isComplete) {
      const interval = setInterval(() => {
        setTimeElapsed(Date.now() - startTime);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [startTime, isComplete]);

  // Handle input changes
  useEffect(() => {
    if (userInput.length > 0 && !startTime) {
      setStartTime(Date.now());
    }

    if (userInput.length >= text.length) {
      handleComplete();
    }
  }, [userInput, text, startTime]);

  const handleInputChange = useCallback((value: string) => {
    if (isComplete) return;

    setUserInput(value);
    
    // Track mistakes
    const newMistakes = new Set(mistakes);
    for (let i = 0; i < value.length; i++) {
      if (i < text.length && value[i] !== text[i]) {
        newMistakes.add(i);
      }
    }
    setMistakes(newMistakes);
    setCurrentIndex(value.length);
  }, [isComplete, mistakes, text]);

  const handleComplete = useCallback(() => {
    if (!startTime || isComplete) return;

    const finalTime = Date.now() - startTime;
    const wordsTyped = text.length / 5; // Standard WPM calculation
    const wpm = Math.round((wordsTyped / (finalTime / 60000)));
    const accuracy = Math.round(((text.length - mistakes.size) / text.length) * 100);

    const stats: PracticeStats = {
      wpm,
      accuracy,
      timeElapsed: finalTime,
      totalStrokes: text.length,
      correctStrokes: text.length - mistakes.size
    };

    setIsComplete(true);
    onComplete(stats);
  }, [startTime, isComplete, text, mistakes, onComplete]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserInput('');
    setMistakes(new Set());
    setStartTime(null);
    setIsComplete(false);
    setTimeElapsed(0);
  };

  const renderCharacter = (char: string, index: number) => {
    let charClass = 'practice-char';
    
    if (index < userInput.length) {
      if (mistakes.has(index)) {
        charClass += ' incorrect';
      } else {
        charClass += ' correct';
      }
    } else if (index === currentIndex) {
      charClass += ' current';
    }

    return (
      <span key={index} className={charClass}>
        {char === ' ' ? '␣' : char}
      </span>
    );
  };

  const progress = (currentIndex / text.length) * 100;
  const currentWpm = startTime ? Math.round(((currentIndex / 5) / (timeElapsed / 60000)) || 0) : 0;
  const currentAccuracy = currentIndex > 0 ? Math.round(((currentIndex - mistakes.size) / currentIndex) * 100) : 100;

  return (
    <Card className={cn('p-6 space-y-6', className)}>
      {/* Stats Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {Math.floor(timeElapsed / 60000)}:{String(Math.floor((timeElapsed % 60000) / 1000)).padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium">{currentWpm} WPM</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">{currentAccuracy}% ACC</span>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestart}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Restart
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Practice Text Display */}
      <div className="relative">
        <div className="practice-text p-4 bg-muted/30 rounded-lg border-2 border-dashed border-border min-h-[120px] leading-relaxed">
          {text.split('').map((char, index) => renderCharacter(char, index))}
        </div>
        
        {/* Invisible Input Overlay */}
        <textarea
          value={userInput}
          onChange={(e) => handleInputChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
          disabled={isComplete}
          placeholder="Start typing..."
          autoFocus
        />
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="animate-scale-in text-center p-4 bg-gradient-primary rounded-lg text-primary-foreground">
          <h3 className="text-lg font-semibold mb-2">Practice Complete! 🎉</h3>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {currentWpm} WPM
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {currentAccuracy}% Accuracy
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {Math.round(timeElapsed / 1000)}s
            </Badge>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!startTime && (
        <div className="text-center text-sm text-muted-foreground">
          <p>Click in the text area above and start typing to begin practice</p>
        </div>
      )}
    </Card>
  );
};