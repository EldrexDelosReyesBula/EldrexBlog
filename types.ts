export interface BlogPost {
  id: number;
  title: string;
  image?: string; // Original path
  placeholderImage: string; // Picsum path for this demo
  date: string;
  category: string;
  excerpt: string;
  content: string;
}

export type Category = string;
