import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as pdfjsLib from 'pdfjs-dist';

// Use a more reliable worker setup for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  onTextExtracted: (text: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onTextExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      return fullText.trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF. Please ensure the PDF is not password protected or corrupted.');
    }
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
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the PDF. The file might be an image-only PDF.');
      }
      onTextExtracted(extractedText);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract text from PDF';
      setError(errorMessage);
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
            <p className="text-sm text-gray-500">Extracting text content from your CV</p>
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
