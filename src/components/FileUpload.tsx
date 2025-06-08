
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  onTextExtracted: (text: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onTextExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Simulate PDF text extraction - replace with actual PDF parsing library
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockText = `John Doe
Software Engineer

SKILLS:
• React, JavaScript, TypeScript
• HTML, CSS, Tailwind CSS
• Frontend Development
• Problem Solving

EXPERIENCE:
Frontend Developer at Tech Company (2021-2024)
- Developed user interfaces using React
- Collaborated with design team
- Optimized application performance

EDUCATION:
Bachelor of Computer Science
University of Technology (2017-2021)

PROJECTS:
• E-commerce Website - Built with React and Node.js
• Portfolio Website - Responsive design with modern UI
• Task Management App - Full-stack application`;
        resolve(mockText);
      }, 1500);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only');
      return;
    }

    setError('');
    setIsProcessing(true);
    setUploadedFile(file);
    onFileSelect(file);

    try {
      const extractedText = await extractTextFromPDF(file);
      onTextExtracted(extractedText);
    } catch (err) {
      setError('Failed to extract text from PDF');
      console.error('PDF extraction error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [onFileSelect, onTextExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleRemoveFile = () => {
    setUploadedFile(null);
    onFileSelect(null);
    onTextExtracted('');
    setError('');
  };

  if (uploadedFile && !isProcessing) {
    return (
      <div className="border-2 border-green-200 border-dashed rounded-lg p-6 bg-green-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium text-green-800">{uploadedFile.name}</p>
              <p className="text-sm text-green-600">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            className="text-green-600 hover:text-green-800 hover:bg-green-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        {isProcessing ? (
          <div className="space-y-3">
            <div className="animate-spin mx-auto">
              <Upload className="h-12 w-12 text-primary" />
            </div>
            <p className="text-primary font-medium">Processing PDF...</p>
            <p className="text-sm text-gray-500">Extracting text content</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
            {isDragActive ? (
              <p className="text-primary font-medium">Drop your PDF here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Drag & drop your CV here
                </p>
                <p className="text-sm text-gray-500">
                  or <span className="text-primary font-medium">click to browse</span>
                </p>
              </div>
            )}
            <p className="text-xs text-gray-400">PDF files only, max 10MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
};
