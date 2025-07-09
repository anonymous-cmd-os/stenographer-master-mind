import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  Zap, 
  Calendar,
  Trophy,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressDashboardProps {
  stats: {
    totalPracticeTime: number;
    averageWpm: number;
    averageAccuracy: number;
    lessonsCompleted: number;
    totalLessons: number;
    streak: number;
    level: number;
    experience: number;
    experienceToNext: number;
    achievements: Achievement[];
    recentSessions: PracticeSession[];
  };
  className?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'speed' | 'accuracy' | 'consistency' | 'milestone';
}

interface PracticeSession {
  id: string;
  date: Date;
  wpm: number;
  accuracy: number;
  duration: number;
  lessonTitle: string;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  stats,
  className
}) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const levelProgress = (stats.experience / stats.experienceToNext) * 100;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Level and Experience */}
      <Card className="p-6 gradient-primary text-primary-foreground">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Level {stats.level}</h2>
            <p className="text-primary-foreground/80">Stenographer</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.experience}</div>
            <div className="text-sm text-primary-foreground/80">XP</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Next Level</span>
            <span>{stats.experienceToNext - stats.experience} XP needed</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-smooth"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">{stats.averageWpm}</div>
          <div className="text-sm text-muted-foreground">Avg WPM</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-5 w-5 text-accent" />
          </div>
          <div className="text-2xl font-bold text-accent">{stats.averageAccuracy}%</div>
          <div className="text-sm text-muted-foreground">Accuracy</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-5 w-5 text-secondary" />
          </div>
          <div className="text-2xl font-bold text-secondary">{formatTime(stats.totalPracticeTime)}</div>
          <div className="text-sm text-muted-foreground">Practice Time</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="h-5 w-5 text-warning" />
          </div>
          <div className="text-2xl font-bold text-warning">{stats.streak}</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </Card>
      </div>

      {/* Course Progress */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Course Progress</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Lessons Completed</span>
            <span className="font-medium">{stats.lessonsCompleted} / {stats.totalLessons}</span>
          </div>
          <Progress 
            value={(stats.lessonsCompleted / stats.totalLessons) * 100} 
            className="h-3"
          />
          <div className="text-sm text-muted-foreground text-center">
            {Math.round((stats.lessonsCompleted / stats.totalLessons) * 100)}% Complete
          </div>
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">Recent Achievements</h3>
        </div>
        
        <div className="space-y-3">
          {stats.achievements.slice(0, 3).map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="font-medium">{achievement.title}</div>
                <div className="text-sm text-muted-foreground">{achievement.description}</div>
              </div>
              <Badge variant="outline" className="text-xs">
                {achievement.category}
              </Badge>
            </div>
          ))}
          
          {stats.achievements.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Complete lessons to earn achievements!</p>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Sessions */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-secondary" />
          <h3 className="text-lg font-semibold">Recent Practice</h3>
        </div>
        
        <div className="space-y-3">
          {stats.recentSessions.slice(0, 5).map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <div className="font-medium">{session.lessonTitle}</div>
                <div className="text-sm text-muted-foreground">
                  {session.date.toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-primary font-medium">{session.wpm} WPM</span>
                <span className="text-accent font-medium">{session.accuracy}% ACC</span>
                <span className="text-muted-foreground">{formatTime(session.duration)}</span>
              </div>
            </div>
          ))}
          
          {stats.recentSessions.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No practice sessions yet. Start your first lesson!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};