export interface AddClientFacadeInputDto {
  id?: string;
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
}

export interface AddClientFacadeOutputDto {
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

export interface FindClientFacadeInputDto {
  id: string;
}

export interface FindClientFacadeOutputDto {
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

export interface FindAllClientFacadeOutputDto {
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

export default interface ClientAdmFacadeInterface {
  add(input: AddClientFacadeInputDto): Promise<AddClientFacadeOutputDto>;
  find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto>;
  findAll(): Promise<FindAllClientFacadeOutputDto[]>;
}
