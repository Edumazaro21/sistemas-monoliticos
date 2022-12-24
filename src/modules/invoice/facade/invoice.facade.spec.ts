import {Sequelize} from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/facade.factory";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product";
import ProductModel from "../../product-adm/repository/product.model";

describe("InvoiceFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        });

        await sequelize.addModels([InvoiceModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a invoice", async () => {

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

        const invoice = await InvoiceModel.findByPk(result.id);
        const products = await ProductModel.findAll({ where: { invoiceId: result.id } });
        expect(result.id).toBe(invoice.id);
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);
        expect(result.street).toBe(invoice.street);
        expect(result.number).toBe(invoice.number);
        expect(result.complement).toBe(invoice.complement);
        expect(result.city).toBe(invoice.city);
        expect(result.state).toBe(invoice.state);
        expect(result.zipCode).toBe(invoice.zipCode);
        expect(result.items[0].id).toBe(products[0].id);
        expect(result.items[0].name).toBe(products[0].name);
        expect(result.items[0].price).toBe(products[0].purchasePrice);
        expect(result.items[1].id).toBe(products[1].id);
        expect(result.items[1].name).toBe(products[1].name);
        expect(result.items[1].price).toBe(products[1].purchasePrice);
        expect(result.total).toBe(300);
    });

    it("should find a invoice", async () => {
        const invoiceFacade = InvoiceFacadeFactory.create();

        const input = {
            id: new Id().id
        };

        const item = new Product({
            id: new Id(),
            name: "product test 1",
            price: 100,
        });

        await InvoiceModel.create({
                id: input.id,
                name: "invoice test",
                document: "123456789",
                street: "street",
                number: 123,
                complement: "complement",
                city: "city",
                state: "state",
                zipCode: "zipCode",
                createdAt: new Date(),
                updatedAt: new Date(),
            });

        await ProductModel.create({
            id: item.id.id,
            name: item.name,
            description: "Product 1",
            purchasePrice: item.price,
            stock: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
            invoiceId: input.id,
        });

        const result = await invoiceFacade.find(input);

        expect(result.id).toBe(input.id);
        expect(result.name).toBe("invoice test");
        expect(result.document).toBe("123456789");
        expect(result.address.street).toBe("street");
        expect(result.address.number).toBe(123);
        expect(result.address.complement).toBe("complement");
        expect(result.address.city).toBe("city");
        expect(result.address.state).toBe("state");
        expect(result.address.zipCode).toBe("zipCode");
        expect(result.items[0].id).toBe(item.id.id);
        expect(result.items[0].name).toBe(item.name);
        expect(result.items[0].price).toBe(item.price);
        expect(result.total).toBe(100);
    });
});
