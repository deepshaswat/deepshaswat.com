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
