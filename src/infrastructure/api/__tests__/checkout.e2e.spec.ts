import {app, sequelize} from "../express";
import request from "supertest";
import ProductModel from "../../../modules/product-adm/repository/product.model";
import Client from "../../../modules/client-adm/domain/client.entity";
import ClientModel from "../../../modules/client-adm/repository/client.model";

describe("E2E test for checkout", () => {
    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should on checkout", async () => {

        await ProductModel.create({
            id: "1",
            name: "product test 1",
            description: "Product 1",
            purchasePrice: 200,
            stock: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const client = new Client({
            name: "John Doe",
            email: "user@test.com",
            document: "12345678900",
            street: "Street",
            number: 123,
            complement: "Complement",
            city: "City",
            state: "State",
            zipCode: "12345678",
        });

        await ClientModel.create({
            id: client.id.id,
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        });

        const response = await request(app)
            .post("/checkout")
            .send({
                clientId: client.id.id,
                products: [{productId: "1"}],
            });

        expect(response.body).toEqual({
            id: expect.any(String),
            invoiceId: expect.any(String),
            status: "approved",
            total: 200,
            products: [{productId: "1"}],
        });
    });
});
