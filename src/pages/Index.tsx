
import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { JobDescriptionInput } from '@/components/JobDescriptionInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Target, Zap, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [apiKey, setApiKey] = useState<string>('');
  const [cvSummary, setCvSummary] = useState<string>('');
  const { toast } = useToast();

  const summarizeCV = async (cvContent: string) => {
    const prompt = `Please create a structured summary of this CV focusing on key information for job matching. Extract and organize:

1. Skills (technical and soft skills)
2. Experience level and years
3. Education background
4. Key achievements
5. Industry experience
6. Certifications

Keep it concise but comprehensive. Format as structured text.

CV Content:
${cvContent}`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to summarize CV');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('CV Summarization Error:', error);
      throw error;
    }
  };

  const analyzeWithOpenAI = async (cvSummary: string, jdContent: string) => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to analyze",
        variant: "destructive",
      });
      return null;
    }

    const prompt = `Analyze this CV summary against the job description and return a JSON response with the following structure:
{
  "match_percentage": number (0-100),
  "matched_keywords": ["keyword1", "keyword2", ...],
  "missing_keywords": ["keyword3", "keyword4", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "strengths": ["strength1", "strength2", ...],
  "jd_keywords_count": number
}

CV Summary (anonymized and condensed):
${cvSummary}

Job Description:
${jdContent}

Focus on:
- Skills alignment
- Experience relevance
- Education match
- Industry fit
- Provide specific, actionable suggestions for improvement`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 1200
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to analyze with OpenAI');
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse analysis results');
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze CV",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleAnalyze = async () => {
    if (!cvText || !jobDescription || !apiKey) {
      toast({
        title: "Missing Information",
        description: "Please upload CV, enter job description, and provide API key",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Step 1: Summarize CV
      toast({
        title: "Processing CV",
        description: "Creating structured summary of your CV...",
      });
      
      const summary = await summarizeCV(cvText);
      setCvSummary(summary);
      
      // Step 2: Analyze summary against JD
      toast({
        title: "Analyzing Match",
        description: "Comparing CV summary with job requirements...",
      });
      
      const results = await analyzeWithOpenAI(summary, jobDescription);
      if (results) {
        setAnalysisResults(results);
        toast({
          title: "Analysis Complete!",
          description: `CV-JD match analysis completed with ${results.match_percentage}% match score`,
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to complete CV analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = cvFile && cvText && jobDescription.trim().length > 0 && apiKey.trim().length > 0;

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
        {/* OpenAI API Key Input */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Key className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">OpenAI API Key</h2>
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter your OpenAI API key (sk-...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="max-w-md"
            />
            <p className="text-sm text-gray-500">
              Your CV will be summarized first, then only the summary is sent for analysis
            </p>
          </div>
        </div>

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

        {/* CV Summary Display */}
        {cvSummary && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">CV Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{cvSummary}</pre>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This summary will be used for analysis instead of your full CV content
            </p>
          </div>
        )}

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
              Please upload a CV, enter a job description, and provide your OpenAI API key
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
