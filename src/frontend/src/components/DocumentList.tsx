import { useStudentDocuments } from '../hooks/useStudentDocuments';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, PlayCircle, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function DocumentList() {
  const { data: documents, isLoading } = useStudentDocuments();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>No documents uploaded yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Upload your first document to get started with AI-generated quizzes!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Documents</CardTitle>
        <CardDescription>
          {documents.length} {documents.length === 1 ? 'document' : 'documents'} uploaded
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1 min-w-0">
                <p className="font-medium truncate">{doc.fileName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Uploaded {format(new Date(Number(doc.uploadDate) / 1000000), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => navigate({ to: '/quiz/$documentId', params: { documentId: doc.id } })}
              className="gap-2 w-full sm:w-auto"
            >
              <PlayCircle className="h-4 w-4" />
              Take Quiz
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
