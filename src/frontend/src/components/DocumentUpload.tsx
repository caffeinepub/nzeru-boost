import { useState, useCallback } from 'react';
import { useUploadDocument } from '../hooks/useUploadDocument';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

const EXAMINATION_BOARDS = [
  { value: 'none', label: 'General / None' },
  { value: 'ABMA', label: 'ABMA EXAMINATION' },
  { value: 'Cambridge', label: 'Cambridge' },
  { value: 'IB', label: 'IB (International Baccalaureate)' },
  { value: 'IGCSE', label: 'IGCSE' },
];

export default function DocumentUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [examinationBoard, setExaminationBoard] = useState<string>('none');
  const uploadDocument = useUploadDocument();

  const handleFile = async (file: File) => {
    // Get file extension (case-insensitive)
    const fileName = file.name.toLowerCase();
    const extension = fileName.split('.').pop();
    
    // Check file extension
    const validExtensions = ['pdf', 'doc', 'docx', 'txt'];
    if (!extension || !validExtensions.includes(extension)) {
      toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    // Check MIME type as additional validation
    const validMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    // Some browsers may not set MIME type correctly, so we prioritize extension check
    if (file.type && !validMimeTypes.includes(file.type)) {
      // Only show error if MIME type is set but doesn't match
      // (some systems don't set MIME type for .doc files)
      if (file.type !== '' && extension !== 'doc') {
        toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
        return;
      }
    }

    // Check file size
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setUploadProgress(0);
      const boardValue = examinationBoard === 'none' ? null : examinationBoard;
      await uploadDocument.mutateAsync({ 
        file, 
        onProgress: setUploadProgress,
        examinationBoard: boardValue 
      });
      setUploadProgress(0);
      setExaminationBoard('none'); // Reset after successful upload
      toast.success('Document uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload document');
      console.error('Upload error:', error);
      setUploadProgress(0);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [examinationBoard]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Study Material
        </CardTitle>
        <CardDescription>
          Upload your textbooks, notes, or study materials (PDF, DOC, DOCX, TXT - Max 10MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Examination Board Selector */}
        <div className="space-y-2">
          <Label htmlFor="examination-board" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Examination Board Format
          </Label>
          <Select 
            value={examinationBoard} 
            onValueChange={setExaminationBoard}
            disabled={uploadDocument.isPending}
          >
            <SelectTrigger id="examination-board" className="w-full">
              <SelectValue placeholder="Select examination board" />
            </SelectTrigger>
            <SelectContent>
              {EXAMINATION_BOARDS.map((board) => (
                <SelectItem key={board.value} value={board.value}>
                  {board.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select the examination board format to tailor quiz questions to that board's style
          </p>
        </div>

        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          } ${uploadDocument.isPending ? 'pointer-events-none opacity-60' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleChange}
            disabled={uploadDocument.isPending}
          />
          
          {uploadDocument.isPending ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploading document...</p>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}%</p>
              </div>
            </div>
          ) : (
            <>
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX, TXT
                </p>
              </div>
              <Button asChild className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
