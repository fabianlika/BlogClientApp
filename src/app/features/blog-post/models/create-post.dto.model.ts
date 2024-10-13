export interface CreatePostDto {
  Title: string;
  Content: string;
  Url: string;
  Author: string;
  CategoryId: string; 
  UserId: string;
  isApproved?: boolean;
}
