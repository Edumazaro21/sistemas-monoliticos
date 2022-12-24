import { app, sequelize } from "../express";
import request from "supertest";
import ProductModel from "../../../modules/product-adm/repository/product.model";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/facade.factory";


describe("E2E test for invoice", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should do the invoice", async () => {

    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
      name: "invoice test",
      document: "123456789",
      street: "street",
      number: 123,
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "zipCode",
      items: [
        {
          id: "1",
          name: "product test 1",
          price: 100,
        },
        {
          id: "2",
          name: "product test 2",
          price: 200,
        }
      ]
    };

    await ProductModel.create({
      id: "1",
      name: "product test 1",
      description: "Product 1",
      purchasePrice: 100,
      stock: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductModel.create({
      id: "2",
      name: "product test 2",
      description: "Product 2",
      purchasePrice: 200,
      stock: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    let result = await invoiceFacade.generate(input);

    const response = await request(app).get(`/invoice/${result.id}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
        id: result.id,
        name: input.name,
        document: input.document,
        address: {
          street: input.street,
          number: input.number,
          complement: input.complement,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
        },
        items: [
          {
            id: "1",
            name: "product test 1",
            price: 100,
          },
          {
            id: "2",
            name: "product test 2",
            price: 200,
          }
        ],
        total: 300,
        createdAt: expect.any(String),
    });
  });
});
