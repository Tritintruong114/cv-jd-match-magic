
import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { JobDescriptionInput } from '@/components/JobDescriptionInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { FileText, Target, Zap } from 'lucide-react';

interface AnalysisData {
  match_percentage: number;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
  strengths: string[];
  jd_keywords_count: number;
}

const Index = () => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!cvText || !jobDescription) {
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis - replace with actual OpenAI integration
    setTimeout(() => {
      const mockResults: AnalysisData = {
        match_percentage: 75,
        matched_keywords: ['React', 'JavaScript', 'Frontend', 'CSS', 'HTML'],
        missing_keywords: ['Node.js', 'MongoDB', 'Docker', 'AWS'],
        suggestions: [
          'Add "Node.js" to your skills section to show backend experience',
          'Mention "team leadership" experience in your work history',
          'Include specific project management examples',
          'Add "MongoDB" database experience',
          'Highlight "Docker" containerization skills'
        ],
        strengths: [
          'Strong frontend development background',
          'Relevant React experience',
          'Good CSS and HTML foundation'
        ],
        jd_keywords_count: 9
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  const canAnalyze = cvFile && cvText && jobDescription.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CV-JD Matcher</h1>
              <p className="text-gray-600">Analyze how well your CV matches job requirements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* CV Upload */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Upload CV</h2>
            </div>
            <FileUpload 
              onFileSelect={setCvFile}
              onTextExtracted={setCvText}
            />
            {cvFile && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  ✓ {cvFile.name} uploaded successfully
                </p>
                {cvText && (
                  <p className="text-xs text-green-600 mt-1">
                    {cvText.length} characters extracted
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
            </div>
            <JobDescriptionInput 
              value={jobDescription}
              onChange={setJobDescription}
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            size="lg"
            className="px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Zap className="h-5 w-5 mr-2 animate-spin" />
                Analyzing Match...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Analyze Match
              </>
            )}
          </Button>
          {!canAnalyze && !isAnalyzing && (
            <p className="text-sm text-gray-500 mt-2">
              Please upload a CV and enter a job description to analyze
            </p>
          )}
        </div>

        {/* Loading Spinner */}
        {isAnalyzing && <LoadingSpinner />}

        {/* Results Section */}
        {analysisResults && !isAnalyzing && (
          <AnalysisResults data={analysisResults} />
        )}
      </div>
    </div>
  );
};

export default Index;
