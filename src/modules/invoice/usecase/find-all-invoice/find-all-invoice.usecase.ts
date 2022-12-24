import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {FindAllInvoiceOutputDto} from "./find-all-invoice.dto";
import Invoice from "../../domain/invoice";

export default class FindAllInvoiceUsecase implements UseCaseInterface {
    constructor(private invoiceRepository: InvoiceGateway) {
    }

    async execute(): Promise<FindAllInvoiceOutputDto[]> {
        const invoices = await this.invoiceRepository.findAll();

        return invoices.map((invoice: Invoice) => {
            return {
                id: invoice.id.id,
                name: invoice.name,
                document: invoice.document,
                address: {
                    street: invoice.address.street,
                    number: invoice.address.number,
                    complement: invoice.address.complement,
                    city: invoice.address.city,
                    state: invoice.address.state,
                    zipCode: invoice.address.zipCode,
                },
                items: invoice.items.map((item) => {
                    return {
                        id: item.id.id,
                        name: item.name,
                        price: item.price
                    }
                }),
                total: invoice.items.reduce((acc, item) => {
                    return acc + item.price
                }, 0),
                createdAt: invoice.createdAt
            };
        });
    }
}
