export interface GeneratePlaceOrderFacadeInputDto {
  clientId: string;
  products: {
    productId: string;
  }[];
}

export interface GeneratePlaceOrderFacadeOutputDto {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
    productId: string;
  }[];
}

export default interface PlaceOrderFacadeInterface {
  generate(
      input: GeneratePlaceOrderFacadeInputDto
  ): Promise<GeneratePlaceOrderFacadeOutputDto>;
}
