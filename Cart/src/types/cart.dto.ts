export interface AddItemDTO {
  productId: string;
  quantity: number;
}

export interface UpdateProductParams {
  id: string;
}

export interface UpdateProductQuantityDTO {
  quantity: number;
}