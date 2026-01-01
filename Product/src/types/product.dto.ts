export interface CreateProductDTO {
  title: string;
  description?: string;
  price: number;
  currency?: "INR" | "USD";
  category?: string;
}
