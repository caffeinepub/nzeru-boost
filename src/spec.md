# Specification

## Summary
**Goal:** Add examination board format support to allow students to specify exam board types (ABMA, Cambridge, IB, IGCSE) when uploading documents and generate board-specific quiz questions.

**Planned changes:**
- Add optional examination board field to document metadata in backend
- Add examination board selector dropdown to document upload form
- Display examination board badges next to documents in the document list
- Tailor quiz question format based on the document's examination board
- Update upload hook to send examination board information to backend

**User-visible outcome:** Students can select an examination board format when uploading study materials, see which board each document is associated with, and receive quiz questions formatted according to that board's style (starting with ABMA EXAMINATION format).
