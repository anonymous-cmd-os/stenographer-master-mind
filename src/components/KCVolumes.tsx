import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  Eye, 
  FileText,
  Lock,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Volume {
  id: string;
  title: string;
  description: string;
  volumeNumber: string | number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pdfUrl: string;
  isAvailable: boolean;
  estimatedTime?: number;
  topics?: string[];
  progress?: number;
}

const KC_VOLUMES: Volume[] = [
  {
    id: 'vol1',
    title: 'KC Volume 1-6 - Foundation Principles',
    description: 'Introduction to stenographic theory, basic strokes, and fundamental principles of shorthand writing.',
    volumeNumber: '1-6',
    difficulty: 'beginner',
    pdfUrl: 'https://drive.google.com/file/d/1scgvnHZHPOzedpvKScmfjuviNndtbp1Z/preview',
    isAvailable: true,
    estimatedTime: 120,
    topics: ['Basic Strokes', 'Alphabet', 'Simple Words'],
    progress: 0
  },
  {
    id: 'vol2',
    title: 'KC Volume 7-12 - Consonant Combinations',
    description: 'Advanced consonant blends, chord formations, and speed development exercises.',
    volumeNumber: '7-12',
    difficulty: 'beginner',
    pdfUrl: 'https://drive.google.com/file/d/1yb_sya6b7XPP_speNs6AQFE8nRIR0ItJ/preview',
    isAvailable: true,
    estimatedTime: 150,
    topics: ['Consonant Blends', 'Chord Formations', 'Speed Drills'],
    progress: 0
  },
  {
    id: 'vol3',
    title: 'KC Volume 13-18 - Vowel Mastery',
    description: 'Complete vowel system, diphthongs, and complex vowel combinations for professional writing.',
    volumeNumber: '13-18',
    difficulty: 'intermediate',
    pdfUrl: 'https://drive.google.com/file/d/1KmttQ9He-AxvMuUwLTaB5j5jI29O1h3m/preview',
    isAvailable: true,
    estimatedTime: 180,
    topics: ['Vowel System', 'Diphthongs', 'Complex Combinations'],
    progress: 0
  },
  {
    id: 'vol4',
    title: 'KC Volume 19-24 - Professional Phrases',
    description: 'Business terminology, legal phrases, and advanced shorthand techniques for professional use.',
    volumeNumber: '19-24',
    difficulty: 'intermediate',
    pdfUrl: 'https://drive.google.com/file/d/1o4r_3wetTuzObMXBpVxpblHpRuIltnsi/preview',
    isAvailable: true,
    estimatedTime: 200,
    topics: ['Business Terms', 'Legal Phrases', 'Professional Techniques'],
    progress: 0
  }
];

interface PDFViewerProps {
  volume: Volume;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ volume, onClose }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold">{volume.title}</h3>
            <p className="text-sm text-muted-foreground">{volume.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(volume.pdfUrl.replace('/preview', '/view'), '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Open in New Tab
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        
        {/* PDF Iframe */}
        <div className="flex-1 p-4">
          <iframe
            src={volume.pdfUrl}
            className="w-full h-full rounded border"
            title={volume.title}
          />
        </div>
      </div>
    </div>
  );
};

export const KCVolumes: React.FC = () => {
  const [selectedVolume, setSelectedVolume] = useState<Volume | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'locked'>('all');

  const filteredVolumes = KC_VOLUMES.filter(volume => {
    if (filter === 'available') return volume.isAvailable;
    if (filter === 'locked') return !volume.isAvailable;
    return true;
  });

  const difficultyColors = {
    beginner: 'bg-accent text-accent-foreground',
    intermediate: 'bg-warning text-warning-foreground',
    advanced: 'bg-destructive text-destructive-foreground'
  };

  const handleVolumeOpen = (volume: Volume) => {
    if (volume.isAvailable) {
      setSelectedVolume(volume);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-4">KC Training Volumes</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive stenographic training materials from KC's proven curriculum. 
          Master professional shorthand writing through structured, progressive volumes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">4</div>
          <div className="text-sm text-muted-foreground">Total Volumes</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent mb-1">4</div>
          <div className="text-sm text-muted-foreground">Available Now</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-warning mb-1">
            {KC_VOLUMES.reduce((acc, vol) => acc + (vol.estimatedTime || 0), 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Hours</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-secondary mb-1">3</div>
          <div className="text-sm text-muted-foreground">Difficulty Levels</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-medium">Filter:</span>
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Volumes
        </Button>
        <Button 
          variant={filter === 'available' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('available')}
        >
          Available
        </Button>
        <Button 
          variant={filter === 'locked' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('locked')}
        >
          Coming Soon
        </Button>
      </div>

      {/* Volumes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVolumes.map((volume) => (
          <Card
            key={volume.id}
            className={cn(
              'group cursor-pointer transition-smooth hover:shadow-elevation hover:scale-[1.02]',
              !volume.isAvailable && 'opacity-60'
            )}
            onClick={() => handleVolumeOpen(volume)}
          >
            {/* Volume Header */}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Vol. {volume.volumeNumber}
                    </Badge>
                    <Badge className={difficultyColors[volume.difficulty]}>
                      {volume.difficulty}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-smooth">
                    {volume.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {volume.description}
                  </p>
                </div>
              </div>

              {/* Topics */}
              {volume.topics && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground">Key Topics:</span>
                  <div className="flex flex-wrap gap-1">
                    {volume.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{volume.estimatedTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>PDF Format</span>
                </div>
              </div>

              {/* Progress */}
              {volume.progress !== undefined && volume.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(volume.progress)}%</span>
                  </div>
                  <Progress value={volume.progress} className="h-2" />
                </div>
              )}

              {/* Action Button */}
              <Button
                className={cn(
                  'w-full gap-2 transition-smooth',
                  volume.isAvailable 
                    ? 'gradient-primary hover:shadow-glow' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
                disabled={!volume.isAvailable}
              >
                {volume.isAvailable ? (
                  <>
                    <Eye className="h-4 w-4" />
                    Open Volume
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Coming Soon
                  </>
                )}
              </Button>

              {/* Coming Soon Message */}
              {!volume.isAvailable && (
                <div className="text-xs text-muted-foreground text-center">
                  Volume will be available soon
                </div>
              )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-primary opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-smooth" />
          </Card>
        ))}
      </div>

      {/* PDF Viewer Modal */}
      {selectedVolume && (
        <PDFViewer 
          volume={selectedVolume} 
          onClose={() => setSelectedVolume(null)} 
        />
      )}
    </div>
  );
};