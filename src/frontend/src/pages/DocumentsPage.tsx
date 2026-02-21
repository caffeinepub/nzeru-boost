import AuthGuard from '../components/AuthGuard';
import DocumentUpload from '../components/DocumentUpload';
import DocumentList from '../components/DocumentList';

export default function DocumentsPage() {
  return (
    <AuthGuard>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">My Documents</h1>
          <p className="text-muted-foreground mt-2">
            Upload your study materials and generate quizzes to boost your knowledge
          </p>
        </div>

        <DocumentUpload />
        <DocumentList />
      </div>
    </AuthGuard>
  );
}
