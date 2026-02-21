import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type DocumentFormat = {
    #pdf;
    #doc;
    #docx;
    #txt;
  };

  type OldDocumentMetadata = {
    id : Text;
    fileName : Text;
    uploadDate : Int;
    associatedStudent : Principal;
    blobId : Text;
    format : DocumentFormat;
  };

  type OldActor = {
    documentMetadataStore : Map.Map<Text, OldDocumentMetadata>;
  };

  type NewDocumentMetadata = {
    id : Text;
    fileName : Text;
    uploadDate : Int;
    associatedStudent : Principal;
    blobId : Text;
    format : DocumentFormat;
    examinationBoard : ?Text;
  };

  type NewActor = {
    documentMetadataStore : Map.Map<Text, NewDocumentMetadata>;
  };

  public func run(old : OldActor) : NewActor {
    let newDocumentMetadataStore = old.documentMetadataStore.map<Text, OldDocumentMetadata, NewDocumentMetadata>(
      func(_id, oldMetadata) {
        {
          oldMetadata with
          examinationBoard = null;
        };
      }
    );
    { documentMetadataStore = newDocumentMetadataStore };
  };
};
