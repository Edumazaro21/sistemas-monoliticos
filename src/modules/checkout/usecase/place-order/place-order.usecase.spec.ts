import {PlaceOrderInputDto} from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";

describe("PlaceOrderUseCase unit test", () => {

    describe("ValidadeProducts method", () => {
        // @ts-ignore
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw an error if products are not select", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: []
            };

            await expect(
                placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrowError("No products selected");
        });

        it("should throw an error when products is out of stock", async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({productId}: { productId: string }) =>
                    Promise.resolve({
                        productId,
                        stock: productId === "1" ? 0 : 1
                    })
                ),
            };

            // @ts-ignore
            placeOrderUseCase["_productFacade"] = mockProductFacade;

            let input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{productId: "1"}],
            }

            await expect(
                placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrowError("Product 1 is not available in stock");

            input = {
                clientId: "0",
                products: [{productId: "0"}, {productId: "1"}],
            };

            await expect(
                placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrowError("Product 1 is not available in stock");
            expect(mockProductFacade.checkStock).toBeCalledTimes(3);

            input = {
                clientId: "0",
                products: [{productId: "0"}, {productId: "1"}, {productId: "2"}],
            };

            await expect(
                placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrowError("Product 1 is not available in stock");
            expect(mockProductFacade.checkStock).toBeCalledTimes(5);
        });
    });

    const mockDate = new Date(2000, 1, 1);

    describe("GetProduct method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        // @ts-ignore
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw an error if product is not found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
            };

            // @ts-ignore
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(
                placeOrderUseCase["getProduct"]("0")
            ).rejects.toThrowError("Product not found");
        });

        it("should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "0",
                    name: "Product 0",
                    description: "Product 0 description",
                    salesPrice: 10,
                    stock: 10,
                }),
            };

            // @ts-ignore
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(
                placeOrderUseCase["getProduct"]("0")
            ).resolves.toEqual(
                new Product({
                    id: new Id("0"),
                    name: "Product 0",
                    description: "Product 0 description",
                    salesPrice: 10,
                    stock: 10,
                })
            );

            expect(mockCatalogFacade.find).toBeCalledTimes(1);
        });
    });

    describe("execute method", () => {
        it("should throw an error if client is not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
            };
            // @ts-ignore
            const placeOrderUseCase = new PlaceOrderUseCase();
            // @ts-ignore
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {clientId: "1", products: []};
            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError("Client not found");
        });

        it("should throw an error if products are not valid", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue({id: "1", name: "John Doe", email: "email", address: "address"}),
            };
            // @ts-ignore
            const placeOrderUseCase = new PlaceOrderUseCase();

            const mockValidateProducts = jest
                // @ts-ignore
                .spyOn(placeOrderUseCase, "validateProducts")
                // @ts-ignore
                .mockRejectedValue(new Error("Products are not valid"));

            // @ts-ignore
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {clientId: "1", products: []};
            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError("Products are not valid");
            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        });

        describe("place a order", () => {
            const clientProps = {
                id: "1c",
                name: "Client 0",
                document: "0000",
                email: "client@user.com",
                address: {
                    street: "Some address",
                    number: "1",
                    complement: "",
                    city: "Some city",
                    state: "Some state",
                    zipCode: "00000-000",
                },
            }

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(clientProps),
            };

            const mockPaymentFacade = {
                process: jest.fn(),
            };

            const mockCheckoutRepo = {
                addOrder: jest.fn(),
                updateOrder: jest.fn(),
            };

            const mockInvoiceFacade = {
                generate: jest.fn().mockResolvedValue({
                    id: "l1",
                    name: "Invoice 0",
                    document: "0000",
                    street: "Some address",
                    number: 1,
                    complement: "",
                    city: "Some city",
                    state: "Some state",
                    zipCode: "00000-000",
                    items: [
                        {
                            id: "1",
                            name: "Product 1",
                            price: 40,
                        },
                        {
                            id: "2",
                            name: "Product 2",
                            price: 30,
                        }
                    ],
                    total: 70,
                }),
            };

            const placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade as any,
                null,
                null,
                mockCheckoutRepo as any,
                mockInvoiceFacade as any,
                mockPaymentFacade
            );

            const products = {
                "1": new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "some description",
                    salesPrice: 40,
                    stock: 10,
                }),
                "2": new Product({
                    id: new Id("2"),
                    name: "Product 2",
                    description: "some description",
                    salesPrice: 30,
                    stock: 10,
                })
            };

            const mockValidateProducts = jest
                // @ts-ignore
                .spyOn(placeOrderUseCase, "validateProducts")
                // @ts-ignore
                .mockResolvedValue(products);

            const mockGetProducts = jest
                // @ts-ignore
                .spyOn(placeOrderUseCase, "getProduct")
                // @ts-ignore
                .mockImplementation((productId: keyof typeof products) => {
                    return products[productId];
                });

            it("should not be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [{productId: "1"}, {productId: "2"}],
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBeNull();
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    {productId: "1"},
                    {productId: "2"},
                ]);
                expect(mockClientFacade.find).toBeCalledTimes(1);
                expect(mockClientFacade.find).toBeCalledWith({id: "1c"});
                expect(mockValidateProducts).toBeCalledTimes(1);
                expect(mockValidateProducts).toBeCalledWith(input);
                expect(mockGetProducts).toBeCalledTimes(2);
                expect(mockCheckoutRepo.addOrder).toBeCalledTimes(1);
                expect(mockCheckoutRepo.updateOrder).toBeCalledTimes(1);
                expect(mockPaymentFacade.process).toBeCalledTimes(1);
                expect(mockPaymentFacade.process).toBeCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });

                expect(mockInvoiceFacade.generate).toBeCalledTimes(0);
            });

            it("should be approved", async () => {

                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [{productId: "1"}, {productId: "2"}],
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBe("l1");
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    {productId: "1"},
                    {productId: "2"},
                ]);
                expect(mockClientFacade.find).toBeCalledTimes(1);
                expect(mockClientFacade.find).toBeCalledWith({id: "1c"});
                expect(mockValidateProducts).toBeCalledTimes(1);
                expect(mockGetProducts).toBeCalledTimes(2);
                expect(mockCheckoutRepo.addOrder).toBeCalledTimes(1);
                expect(mockCheckoutRepo.updateOrder).toBeCalledTimes(1);
                expect(mockPaymentFacade.process).toBeCalledTimes(1);
                expect(mockPaymentFacade.process).toBeCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });
                expect(mockInvoiceFacade.generate).toBeCalledTimes(1);
                expect(mockInvoiceFacade.generate).toBeCalledWith({
                    name: clientProps.name,
                    document: clientProps.document,
                    street: clientProps.address.street,
                    number: clientProps.address.number,
                    complement: clientProps.address.complement,
                    city: clientProps.address.city,
                    state: clientProps.address.state,
                    zipCode: clientProps.address.zipCode,
                    items: [
                        {
                            id: "1",
                            name: "Product 1",
                            price: 40,
                        },
                        {
                            id: "2",
                            name: "Product 2",
                            price: 30,
                        },
                    ],
                });
            });
        });


    });
});