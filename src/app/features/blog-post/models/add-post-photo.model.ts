export interface PostPhotoDto {
    PhotoId: string; // or Guid
    PostId: string; // Ref
    FileName: string; // N
    FileType: string; 
    IsImage: number; 
    PhotoContent: string; 
  }
  