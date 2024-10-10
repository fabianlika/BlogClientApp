export interface CreatePostPhotoDto {
    FileContent: File; // Use the File type to represent the uploaded file
    PostId: string;    // The ID of the post to which this photo belongs
  }
  