import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface UploadDocumentParams {
  file: File;
  onProgress?: (percentage: number) => void;
}

export function useUploadDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, onProgress }: UploadDocumentParams) => {
      if (!actor) throw new Error('Actor not available');

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Simulate upload progress
      if (onProgress) {
        onProgress(30);
      }

      // For now, we'll store the file data directly as a blob
      // The backend blob storage mixin should handle this
      const documentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Convert to base64 for storage (temporary solution until proper blob storage is implemented)
      const base64Data = btoa(String.fromCharCode(...uint8Array));
      
      if (onProgress) {
        onProgress(70);
      }

      // Store document metadata with the blob ID (using documentId as blobId for now)
      await actor.uploadDocument(documentId, file.name, documentId);

      if (onProgress) {
        onProgress(100);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentDocuments'] });
    },
  });
}
