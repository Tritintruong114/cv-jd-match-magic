
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle, AlertCircle, Lightbulb, Copy, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisData {
  match_percentage: number;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
  strengths: string[];
  jd_keywords_count: number;
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  const { toast } = useToast();

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const handleCopySuggestions = () => {
    const suggestionsText = data.suggestions.join('\n• ');
    navigator.clipboard.writeText(`CV Improvement Suggestions:\n• ${suggestionsText}`);
    toast({
      title: "Copied to clipboard",
      description: "Suggestions have been copied to your clipboard",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Match Percentage Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Match Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Main Match Score */}
            <div className="text-center">
              <div className={`text-6xl font-bold ${getMatchColor(data.match_percentage)} mb-2`}>
                {data.match_percentage}%
              </div>
              <p className="text-lg text-gray-600 mb-4">CV-JD Match Score</p>
              <div className="max-w-md mx-auto">
                <Progress 
                  value={data.match_percentage} 
                  className="h-3"
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {data.matched_keywords.length}
                </div>
                <p className="text-sm text-gray-600">Matched Keywords</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {data.jd_keywords_count}
                </div>
                <p className="text-sm text-gray-600">Total JD Keywords</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {data.missing_keywords.length}
                </div>
                <p className="text-sm text-gray-600">Missing Keywords</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Matched Keywords */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Matched Keywords</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.matched_keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Missing Keywords */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              <span>Missing Keywords</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.missing_keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 border-orange-200"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-600">
            <TrendingUp className="h-5 w-5" />
            <span>Your Strengths</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-purple-600">
              <Lightbulb className="h-5 w-5" />
              <span>Improvement Suggestions</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySuggestions}
              className="flex items-center space-x-1"
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="bg-purple-100 rounded-full p-1 mt-0.5">
                  <Lightbulb className="h-3 w-3 text-purple-600" />
                </div>
                <span className="text-gray-700 flex-1">{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
