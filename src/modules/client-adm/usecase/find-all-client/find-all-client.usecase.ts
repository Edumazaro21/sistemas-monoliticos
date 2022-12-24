import ClientGateway from "../../gateway/client.gateway";
import {FindAllClientOutputDto} from "./find-all-client.usecase.dto";

export default class FindAllClientUsecase {
    private _clientRepository: ClientGateway;

    constructor(clientRepository: ClientGateway) {
        this._clientRepository = clientRepository;
    }

    async execute(): Promise<FindAllClientOutputDto[]> {
        const clients = await this._clientRepository.findAll();

        return clients.map((client) => ({
            id: client.id.id,
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
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        }));
    }
}
