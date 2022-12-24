import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindAllClientUsecase from "./find-all-client.usecase";

const client = new Client({
    id: new Id("1"),
    name: "Client 1",
    email: "x@x.com",
    document: "123456789",
    street: "Street 1",
    number: 1,
    complement: "Complement 1",
    city: "City 1",
    state: "State 1",
    zipCode: "ZipCode 1",
});

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([client])),
    };
};

describe("Find Client Usecase unit test", () => {
    it("should find a client", async () => {
        const repository = MockRepository();
        const usecase = new FindAllClientUsecase(repository);

        const result = await usecase.execute();

        expect(repository.findAll).toHaveBeenCalled();
        expect(result[0].id).toEqual(client.id.id);
        expect(result[0].name).toEqual(client.name);
        expect(result[0].email).toEqual(client.email);
        expect(result[0].address.street).toEqual(client.street);
        expect(result[0].createdAt).toEqual(client.createdAt);
        expect(result[0].updatedAt).toEqual(client.updatedAt);
    });
});
