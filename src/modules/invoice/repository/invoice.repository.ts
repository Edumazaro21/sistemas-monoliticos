import InvoiceGateway from "../gateway/invoice.gateway";
import Invoice from "../domain/invoice";
import InvoiceModel from "./invoice.model";
import Address from "../value-object/address";
import Product from "../domain/product";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductModel from "../../product-adm/repository/product.model";

export default class InvoiceRepository implements InvoiceGateway {
    async generate(input: Invoice): Promise<Invoice> {
        await InvoiceModel.create({
            id: input.id.id,
            name: input.name,
            document: input.document,
            street: input.address.street,
            number: input.address.number,
            complement: input.address.complement,
            city: input.address.city,
            state: input.address.state,
            zipCode: input.address.zipCode,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
        });

        await ProductModel.update(
            {
                invoiceId: input.id.id,
            },
            {
                where: {id: input.items.map((item) => item.id.id)}
            }
        )

        return new Invoice({
            id: input.id,
            name: input.name,
            document: input.document,
            address: new Address(input.address.street, input.address.number, input.address.complement, input.address.city, input.address.state, input.address.zipCode),
            items: input.items.map((item) => {
                return new Product({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                })
            }),
            createdAt: input.createdAt,
            updateAt: input.updatedAt,
        });
    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({ where: { id: id } });
        if (!invoice) {
            throw new Error('Invoice not found');
        }

        const products = await ProductModel.findAll({ where: { invoiceId: id } });

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address(invoice.street, invoice.number, invoice.complement, invoice.city, invoice.state, invoice.zipCode),
            items: products.map((item) => {
                return new Product({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.purchasePrice,
                })
            }),
            createdAt: invoice.createdAt,
            updateAt: invoice.updatedAt,
        });
    }

    async findAll(): Promise<Invoice[]> {
        const invoices = await InvoiceModel.findAll();

        const products = await ProductModel.findAll({ where: { invoiceId: invoices.map((invoice) => invoice.id) } });

        return invoices.map((invoice) => {
            return new Invoice({
                id: new Id(invoice.id),
                name: invoice.name,
                document: invoice.document,
                address: new Address(invoice.street, invoice.number, invoice.complement, invoice.city, invoice.state, invoice.zipCode),
                items: products.map((item) => {
                    return new Product({
                        id: new Id(item.id),
                        name: item.name,
                        price: item.purchasePrice,
                    })
                }),
                createdAt: invoice.createdAt,
                updateAt: invoice.updatedAt,
            })
        });
    }
}
