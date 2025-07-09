import React, { useState, useEffect } from 'react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { LessonCard } from '@/components/LessonCard';
import { PracticeArea } from '@/components/PracticeArea';
import { StenoKeyboard } from '@/components/StenoKeyboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  BookOpen, 
  Target, 
  Zap, 
  Star,
  ArrowRight,
  Trophy,
  Clock
} from 'lucide-react';

// Sample data for the stenography learning platform
const SAMPLE_LESSONS = [
  {
    id: '1',
    title: 'Introduction to Stenography',
    description: 'Learn the basics of stenographic theory and fundamental concepts.',
    difficulty: 'beginner' as const,
    estimatedTime: 15,
    isLocked: false,
    isCompleted: false,
    progress: 0,
    category: 'Theory',
    targetWpm: 20,
    minAccuracy: 95
  },
  {
    id: '2',
    title: 'Basic Letter Combinations',
    description: 'Master simple letter combinations and basic chord formations.',
    difficulty: 'beginner' as const,
    estimatedTime: 20,
    isLocked: false,
    isCompleted: true,
    progress: 100,
    category: 'Fundamentals',
    targetWpm: 30,
    minAccuracy: 90
  },
  {
    id: '3',
    title: 'Common Word Outlines',
    description: 'Practice frequently used word outlines and brief forms.',
    difficulty: 'intermediate' as const,
    estimatedTime: 25,
    isLocked: false,
    isCompleted: false,
    progress: 45,
    category: 'Vocabulary',
    targetWpm: 50,
    minAccuracy: 85
  },
  {
    id: '4',
    title: 'Advanced Phrases',
    description: 'Learn complex phrase outlines and professional terminology.',
    difficulty: 'advanced' as const,
    estimatedTime: 30,
    isLocked: true,
    isCompleted: false,
    progress: 0,
    category: 'Advanced',
    targetWpm: 80,
    minAccuracy: 90
  }
];

const PRACTICE_TEXTS = [
  "The quick brown fox jumps over the lazy dog.",
  "Stenography is the practice of writing in shorthand.",
  "Court reporters use stenotype machines to capture speech at high speeds.",
  "Professional stenographers can achieve speeds of over 200 words per minute.",
  "The art of stenography requires dedicated practice and precise finger movements."
];

const SAMPLE_STATS = {
  totalPracticeTime: 240,
  averageWpm: 75,
  averageAccuracy: 92,
  lessonsCompleted: 8,
  totalLessons: 24,
  streak: 12,
  level: 5,
  experience: 2450,
  experienceToNext: 3000,
  achievements: [
    {
      id: '1',
      title: 'Speed Demon',
      description: 'Achieved 100+ WPM in practice',
      icon: '⚡',
      unlockedAt: new Date(),
      category: 'speed' as const
    },
    {
      id: '2',
      title: 'Accuracy Master',
      description: 'Maintained 95%+ accuracy for 10 sessions',
      icon: '🎯',
      unlockedAt: new Date(),
      category: 'accuracy' as const
    }
  ],
  recentSessions: [
    {
      id: '1',
      date: new Date(),
      wpm: 78,
      accuracy: 94,
      duration: 15,
      lessonTitle: 'Common Word Outlines'
    }
  ]
};

const Index = () => {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'lessons' | 'practice' | 'achievements' | 'settings'>('dashboard');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [practiceText, setPracticeText] = useState(PRACTICE_TEXTS[0]);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const userStats = {
    level: SAMPLE_STATS.level,
    wpm: SAMPLE_STATS.averageWpm,
    accuracy: SAMPLE_STATS.averageAccuracy,
    streak: SAMPLE_STATS.streak
  };

  const handleLessonStart = (lessonId: string) => {
    setSelectedLesson(lessonId);
    setCurrentTab('practice');
    toast({
      title: "Lesson Started",
      description: "Good luck with your practice session!",
    });
  };

  const handlePracticeComplete = (stats: any) => {
    toast({
      title: "Practice Complete! 🎉",
      description: `${stats.wpm} WPM • ${stats.accuracy}% accuracy`,
    });
  };

  const handleKeyPress = (key: string) => {
    const newPressedKeys = new Set(pressedKeys);
    if (newPressedKeys.has(key)) {
      newPressedKeys.delete(key);
    } else {
      newPressedKeys.add(key);
    }
    setPressedKeys(newPressedKeys);
  };

  const generateRandomText = () => {
    const randomText = PRACTICE_TEXTS[Math.floor(Math.random() * PRACTICE_TEXTS.length)];
    setPracticeText(randomText);
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Hero Section */}
      <Card className="p-8 gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Welcome back to StenoMaster! 👋
            </h1>
            <p className="text-lg text-primary-foreground/90 mb-6">
              Continue your stenography journey and master the art of professional shorthand writing.
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                onClick={() => setCurrentTab('practice')}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Practice
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setCurrentTab('lessons')}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Browse Lessons
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center hover:shadow-elevation transition-smooth">
          <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-2xl font-bold text-primary mb-1">{userStats.wpm}</div>
          <div className="text-sm text-muted-foreground">Words per Minute</div>
        </Card>

        <Card className="p-6 text-center hover:shadow-elevation transition-smooth">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="h-6 w-6 text-accent-foreground" />
          </div>
          <div className="text-2xl font-bold text-accent mb-1">{userStats.accuracy}%</div>
          <div className="text-sm text-muted-foreground">Accuracy Rate</div>
        </Card>

        <Card className="p-6 text-center hover:shadow-elevation transition-smooth">
          <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center mx-auto mb-3">
            <Zap className="h-6 w-6 text-warning-foreground" />
          </div>
          <div className="text-2xl font-bold text-warning mb-1">{userStats.streak}</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </Card>

        <Card className="p-6 text-center hover:shadow-elevation transition-smooth">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-6 w-6 text-secondary-foreground" />
          </div>
          <div className="text-2xl font-bold text-secondary mb-1">Level {userStats.level}</div>
          <div className="text-sm text-muted-foreground">Current Level</div>
        </Card>
      </div>

      {/* Progress Dashboard */}
      <ProgressDashboard stats={SAMPLE_STATS} />
    </div>
  );

  const renderLessons = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-4">Stenography Lessons</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Master stenography through our comprehensive lesson system. Progress from basic theory to advanced professional techniques.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_LESSONS.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onStart={handleLessonStart}
          />
        ))}
      </div>
    </div>
  );

  const renderPractice = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-4">Practice Session</h2>
        <p className="text-lg text-muted-foreground">
          Improve your stenography skills with interactive practice sessions.
        </p>
      </div>

      <div className="space-y-6">
        {/* Practice Controls */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline">Practice Mode</Badge>
              {selectedLesson && (
                <Badge variant="secondary">
                  Lesson: {SAMPLE_LESSONS.find(l => l.id === selectedLesson)?.title}
                </Badge>
              )}
            </div>
            <Button onClick={generateRandomText} variant="outline" size="sm">
              New Text
            </Button>
          </div>
        </Card>

        {/* Practice Area */}
        <PracticeArea 
          text={practiceText}
          onComplete={handlePracticeComplete}
        />

        {/* Stenography Keyboard */}
        <StenoKeyboard 
          onKeyPress={handleKeyPress}
          pressedKeys={pressedKeys}
        />
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-4">Achievements</h2>
        <p className="text-lg text-muted-foreground">
          Track your progress and unlock achievements as you master stenography.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_STATS.achievements.map((achievement) => (
          <Card key={achievement.id} className="p-6 text-center hover:shadow-elevation transition-smooth">
            <div className="text-4xl mb-3">{achievement.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
            <Badge variant="outline">{achievement.category}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return renderDashboard();
      case 'lessons':
        return renderLessons();
      case 'practice':
        return renderPractice();
      case 'achievements':
        return renderAchievements();
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-muted-foreground">Settings panel coming soon...</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        userStats={userStats}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
