import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  Settings, 
  User, 
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationHeaderProps {
  currentTab: 'dashboard' | 'lessons' | 'practice' | 'achievements' | 'settings';
  onTabChange: (tab: 'dashboard' | 'lessons' | 'practice' | 'achievements' | 'settings') => void;
  userStats?: {
    level: number;
    wpm: number;
    accuracy: number;
    streak: number;
  };
  className?: string;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentTab,
  onTabChange,
  userStats,
  className
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <header className={cn(
      'sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md',
      className
    )}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">StenoMaster</h1>
              <p className="text-xs text-muted-foreground">Professional Stenography Training</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    'gap-2 transition-smooth',
                    isActive && 'gradient-primary text-primary-foreground shadow-glow'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* User Stats */}
          {userStats && (
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <Badge variant="outline" className="gradient-primary text-primary-foreground border-0">
                  Level {userStats.level}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  <span className="font-medium">{userStats.wpm} WPM</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-accent" />
                  <span className="font-medium">{userStats.accuracy}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-warning" />
                  <span className="font-medium">{userStats.streak}d</span>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'gap-1 flex-shrink-0 transition-smooth',
                  isActive && 'gradient-primary text-primary-foreground'
                )}
              >
                <Icon className="h-3 w-3" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};