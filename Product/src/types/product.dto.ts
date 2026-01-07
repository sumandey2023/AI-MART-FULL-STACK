export interface CreateProductDTO {
  title: string;
  description?: string;
  price: number;
  currency?: "INR" | "USD";
  category?: string;
}

export interface GetProductParams {
  id: string;
}

export interface GetProductsQuery {
  q?: string;
  minprice?: string;
  maxprice?: string;
  skip?: string;
  limit?: string;
}

export interface UpdateProductDTO {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
}
