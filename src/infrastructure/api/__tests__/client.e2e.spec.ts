import {app, sequelize} from "../express";
import request from "supertest";
import ClientModel from "../../../modules/client-adm/repository/client.model";
import Client from "../../../modules/client-adm/domain/client.entity";

describe("E2E test for client", () => {
    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a client", async () => {
        const input = {
            name: "John Doe",
            email: "user@test.com",
            document: "12345678900",
            address: {
                street: "Street",
                number: "123",
                complement: "Complement",
                city: "City",
                state: "State",
                zipCode: "12345678",
            }
        }
        const response = await request(app).post("/clients").send(input);

        expect(response.body).toEqual({
            id: expect.any(String),
            name: input.name,
            email: input.email,
            document: input.document,
            address: {
                street: input.address.street,
                number: input.address.number,
                complement: input.address.complement,
                city: input.address.city,
                state: input.address.state,
                zipCode: input.address.zipCode,
            },
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should not create a client", async () => {
        const response = await request(app).post("/clients").send({
            name: "Name",
        });

        expect(response.status).toBe(500);
    });

    it("should find all clients", async () => {
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

        const response = await request(app).get("/clients").send();

        expect(response.body).toEqual([{
            id: expect.any(String),
            name: client.name,
            email: client.email,
            document: client.document,
            address: {
                street: client.street,
                number: client.number,
                complement: client.complement,
                city: client.city,
                state: client.state,
                zipCode: client.zipCode,
            },
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        }]);
    });
});