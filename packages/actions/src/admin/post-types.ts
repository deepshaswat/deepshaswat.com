export interface PostType {
  title: string;
  featureImage: string;
  content: string;
  postUrl: string;
  publishDate: Date | null;
  excerpt: string;
  featured: boolean;
  tags: string[];
  authorId: string;
  metaData: MetadataType;
}

export interface MetadataType {
  title: string;
  description: string;
  imageUrl: string;
  keywords: string;
  authorName: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export interface PostListType {
  id: string; //ObjectId
  title: string;
  featureImage: string | null;
  content: string;
  postUrl: string;
  publishDate: Date | null;
  excerpt: string;
  featured: boolean;
  tags: TagOnPost[];
  author: Author;
  metadataTitle: string;
  metadataDescription: string;
  metadataImageUrl: string;
  metadataKeywords: string;
  metadataAuthorName: string;
  metadataCanonicalUrl: string;
  metadataOgTitle: string;
  metadataOgDescription: string;
  metadataOgImage: string;
  metadataTwitterCard: string;
  metadataTwitterTitle: string;
  metadataTwitterDescription: string;
  metadataTwitterImage: string;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum PostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  SCHEDULED = "SCHEDULED",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
}

export interface TagOnPost {
  id: string;
  postId: string;
  tagId: string;
}

export interface Tags {
  id: string;
  slug: string;
  description: string;
  imageUrl: string;
  posts: TagOnPost[];
}

export interface Author {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  imageUrl: string;
  role: string;
}