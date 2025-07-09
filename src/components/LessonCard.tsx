import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Lock, CheckCircle, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number;
    isLocked: boolean;
    isCompleted: boolean;
    progress: number;
    category: string;
    targetWpm?: number;
    minAccuracy?: number;
  };
  onStart: (lessonId: string) => void;
  className?: string;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  onStart,
  className
}) => {
  const difficultyColors = {
    beginner: 'bg-accent text-accent-foreground',
    intermediate: 'bg-warning text-warning-foreground',
    advanced: 'bg-destructive text-destructive-foreground'
  };

  const handleStart = () => {
    if (!lesson.isLocked) {
      onStart(lesson.id);
    }
  };

  return (
    <Card className={cn(
      'group relative overflow-hidden transition-smooth hover:shadow-elevation hover:scale-[1.02]',
      lesson.isLocked && 'opacity-60',
      className
    )}>
      {/* Progress Bar at Top */}
      {lesson.progress > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          <div 
            className="h-full bg-gradient-primary transition-smooth"
            style={{ width: `${lesson.progress}%` }}
          />
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-smooth">
                {lesson.title}
              </h3>
              {lesson.isCompleted && (
                <CheckCircle className="h-5 w-5 text-accent" />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {lesson.description}
            </p>
          </div>
          
          <Badge className={difficultyColors[lesson.difficulty]}>
            {lesson.difficulty}
          </Badge>
        </div>

        {/* Lesson Details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{lesson.estimatedTime} min</span>
          </div>
          
          {lesson.targetWpm && (
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{lesson.targetWpm} WPM target</span>
            </div>
          )}
          
          <Badge variant="outline" className="text-xs">
            {lesson.category}
          </Badge>
        </div>

        {/* Progress Section */}
        {lesson.progress > 0 && !lesson.isCompleted && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(lesson.progress)}%</span>
            </div>
            <Progress value={lesson.progress} className="h-2" />
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleStart}
          disabled={lesson.isLocked}
          className={cn(
            'w-full gap-2 transition-smooth',
            lesson.isCompleted 
              ? 'bg-accent hover:bg-accent/90 text-accent-foreground' 
              : 'gradient-primary hover:shadow-glow'
          )}
        >
          {lesson.isLocked ? (
            <>
              <Lock className="h-4 w-4" />
              Locked
            </>
          ) : lesson.isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Review
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              {lesson.progress > 0 ? 'Continue' : 'Start'}
            </>
          )}
        </Button>

        {/* Requirements for locked lessons */}
        {lesson.isLocked && (
          <div className="text-xs text-muted-foreground text-center">
            Complete previous lessons to unlock
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-primary opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-smooth" />
    </Card>
  );
};