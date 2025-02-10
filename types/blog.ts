export interface BlogTypes {
  id: string;
  slug: string;
  title: string;
  description: string;
  mainImage: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}
