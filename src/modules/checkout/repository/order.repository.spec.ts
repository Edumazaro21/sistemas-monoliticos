import {Sequelize} from "sequelize-typescript";

import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "../domain/order.entity";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";

import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import ClientModel from "./client.model";
import ProductModel from "./product.model";

const mockDate = new Date(2000, 1, 1);

describe("OrderRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        });

        await sequelize.addModels([OrderModel, ClientModel, ProductModel]);
        await sequelize.sync();

        jest.useFakeTimers("modern");
        jest.setSystemTime(mockDate);
    });

    afterEach(async () => {
        await sequelize.close();
        jest.useRealTimers();
    });

    it("should add an order", async () => {
        const product = new Product({
            id: new Id("1"),
            name: "product 1",
            description: "description",
            salesPrice: 100,
            stock: 10,
        });

        const client = new Client({
            id: new Id("1"),
            name: "John Doe",
            email: "john.doe@email.com",
            document: "12345678900",
            street: "Street 1",
            number: "1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12345678",
        });

        const order = new Order({
            client: client,
            products: [product],
        });

        order.approved();

        const orderRepository = new OrderRepository();
        await orderRepository.addOrder(order);

        const result = await OrderModel.findOne({
            where: {id: order.id.id},
            include: [{model: ProductModel}, {model: ClientModel}],
        });

        expect(result.id).toBeDefined();
        expect(result.status).toEqual(order.status);
        expect(result.client.id).toBeDefined();
        expect(result.client.name).toEqual(client.name);
        expect(result.client.email).toEqual(client.email);
        expect(result.client.document).toEqual(client.document);
        expect(result.client.street).toEqual(client.street);
        expect(result.client.number).toEqual(client.number);
        expect(result.client.complement).toEqual(client.complement);
        expect(result.client.city).toEqual(client.city);
        expect(result.client.state).toEqual(client.state);
        expect(result.client.zipCode).toEqual(client.zipCode);
        expect(result.products[0].id).toBeDefined();
        expect(result.products[0].name).toEqual(product.name);
        expect(result.products[0].price).toEqual(product.salesPrice);
        expect(result.products[0].description).toEqual(product.description);
    });

    it("should find an order", async () => {
        const product = new Product({
            id: new Id("1"),
            name: "Product 1",
            description: "Description 1",
            salesPrice: 100,
            stock: 10,
        });

        const client = new Client({
            id: new Id("1"),
            name: "John Doe",
            email: "john.doe@email.com",
            document: "12345678900",
            street: "Street 1",
            number: "1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12345678",
        });

        const order = new Order({
            id: new Id("1"),
            client: client,
            products: [product],
        });

        order.approved();

        const orderRepository = new OrderRepository();
        await orderRepository.addOrder(order);

        const result = await orderRepository.findOrder(order.id.id);

        expect(result.id).toBeDefined();
        expect(result.status).toEqual(order.status);
        expect(result.client.id).toBeDefined();
        expect(result.client.name).toEqual(client.name);
        expect(result.client.email).toEqual(client.email);
        expect(result.client.document).toEqual(client.document);
        expect(result.client.street).toEqual(client.street);
        expect(result.client.number).toEqual(client.number);
        expect(result.client.complement).toEqual(client.complement);
        expect(result.client.city).toEqual(client.city);
        expect(result.client.state).toEqual(client.state);
        expect(result.client.zipCode).toEqual(client.zipCode);
        expect(result.products[0].id).toBeDefined();
        expect(result.products[0].name).toEqual(product.name);
        expect(result.products[0].salesPrice).toEqual(product.salesPrice);
        expect(result.products[0].description).toEqual(product.description);
    });
});