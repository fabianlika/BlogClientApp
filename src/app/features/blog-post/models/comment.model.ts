export interface BlogComment {
    CommentId: string;
    Content: string;
    CreatedAt: Date;
    UserId: string;
    PostId: string;
    UserName?: string;
  }
  