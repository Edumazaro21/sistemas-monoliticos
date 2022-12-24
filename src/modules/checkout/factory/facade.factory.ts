import GenerateInvoiceUsecase from "../../invoice/usecase/generate-invoice/generate-invoice.usecase";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import OrderRepository from "../repository/order.repository";
import InvoiceFacadeFactory from "../../invoice/factory/facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import PlaceOrderFacade from "../facade/place-order.facade";

export default class PlaceOrderFacadeFactory {
  static create() {
    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const repository = new OrderRepository();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();
    const generateUseCase = new PlaceOrderUseCase(
        clientFacade,
        productFacade,
        catalogFacade,
        repository,
        invoiceFacade,
        paymentFacade
    );
    const placeOrderFacade = new PlaceOrderFacade({
        generateUseCase: generateUseCase,
    });

    return placeOrderFacade;
  }
}
