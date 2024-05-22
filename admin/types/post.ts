export type Post = {
  boardId: string;
  postId: string;
  title: string;
  readCount: string; // If readCount is always an integer in practice, consider using 'number' instead of 'string'
  commentCount: string; // Same note as for readCount
  fileCount: string; // Same note as for readCount and commentCount
  createdTime: string;
  modifiedTime: string;
  userId: string;
  userName: string;
  mustReadPeriod: {
    startDate: string | null;
    endDate: string | null;
  };
  isMustRead: boolean;
  resourceLocation: null; // Adjust type if there are cases where this isn't null
  isUnread: boolean;
};

export type PostDetails = {
  boardId: string;
  postId: string;
  title: string;
  readCount: string; // Consider using 'number' if the actual values are numeric
  commentCount: string; // Consider using 'number' if the actual values are numeric
  fileCount: string; // Consider using 'number' if the actual values are numeric
  createdTime: string;
  modifiedTime: string;
  userId: string;
  userName: string;
  mustReadPeriod: {
    startDate: string | null;
    endDate: string | null;
  };
  isMustRead: boolean;
  body: string;
  enableComment: boolean;
};
