import { useState, useCallback } from 'react';
import { useUploadDocument } from '../hooks/useUploadDocument';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DocumentUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadDocument = useUploadDocument();

  const handleFile = async (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setUploadProgress(0);
      await uploadDocument.mutateAsync({ file, onProgress: setUploadProgress });
      setUploadProgress(0);
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
  }, []);

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
      <CardContent>
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
