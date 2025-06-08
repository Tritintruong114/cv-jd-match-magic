
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange }) => {
  const handleClear = () => {
    onChange('');
  };

  const exampleJD = `We are looking for a Frontend Developer to join our team.

Requirements:
• 3+ years of experience with React and JavaScript
• Strong knowledge of HTML, CSS, and responsive design
• Experience with modern build tools and version control
• Understanding of RESTful APIs and state management
• Team collaboration and communication skills

Responsibilities:
• Develop and maintain user interfaces
• Collaborate with designers and backend developers
• Optimize applications for maximum speed and scalability
• Participate in code reviews and team meetings

Nice to have:
• Experience with TypeScript
• Knowledge of Node.js and databases
• Familiarity with cloud platforms (AWS, Azure)
• Understanding of testing frameworks`;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={exampleJD}
          className="min-h-[300px] resize-none border-gray-200 focus:border-primary focus:ring-primary"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{value.length} characters</span>
        {value.length > 0 && (
          <span className="text-green-600">
            ✓ Job description ready
          </span>
        )}
      </div>
    </div>
  );
};
