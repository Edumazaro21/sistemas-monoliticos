import Invoice from "../domain/invoice";

export default interface InvoiceGateway {
  find(id:string): Promise<Invoice>;
  generate(input: Invoice): Promise<Invoice>;
  findAll(): Promise<Invoice[]>;
}
