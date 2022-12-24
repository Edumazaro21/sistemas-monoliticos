import Id from "../../../@shared/domain/value-object/id.value-object";
import FindAllInvoiceUsecase from "./find-all-invoice.usecase";
import Invoice from "../../domain/invoice";
import Address from "../../value-object/address";
import Product from "../../domain/product";

const product1 = new Product({
  id: new Id("1"),
  name: "Product 1",
  price: 10
});

const product2 = new Product({
  id: new Id("2"),
  name: "Product 2",
  price: 20
});

const invoice = new Invoice({
  id: new Id("1"),
  name: "invoice test",
  document: "123456789",
  address: new Address("street", 123, "complement", "city", "state", "12345-000"),
  items: [product1,product2],
});

const MockRepository = () => {
  return {
    find: jest.fn(),
    generate: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([invoice]))
  };
};

describe("Find invoice usecase unit test", () => {
  it("should get a invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new FindAllInvoiceUsecase(invoiceRepository);

    const result = await usecase.execute();

    expect(result[0].id).toBe(invoice.id.id);
    expect(result[0].name).toBe(invoice.name);
    expect(result[0].document).toBe(invoice.document);
    expect(result[0].address.street).toBe(invoice.address.street);
    expect(result[0].createdAt).toBeDefined();
    expect(result[0].total).toBe(30);
  });
});
