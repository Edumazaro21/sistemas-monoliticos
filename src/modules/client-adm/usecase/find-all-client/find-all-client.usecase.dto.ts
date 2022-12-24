export interface FindAllClientOutputDto {
  id: string;
  name: string;
  email: string;
  document: string;
  address: {
    street: string;
    number: number;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
