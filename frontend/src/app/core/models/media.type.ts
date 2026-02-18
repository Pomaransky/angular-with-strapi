export interface Media {
  id: number;
  name: string;
  url: string;
  mime: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  formats: {
    thumbnail: {
      url: string;
    };
  };
}
