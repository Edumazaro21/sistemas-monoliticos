import ClientAdmFacade from "../facade/client-adm.facade";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import FindAllClientUsecase from "../usecase/find-all-client/find-all-client.usecase";

export default class ClientAdmFacadeFactory {
  static create() {
    const repository = new ClientRepository();
    const findUsecase = new FindClientUseCase(repository);
    const addUsecase = new AddClientUseCase(repository);
    const findAllUsecase = new FindAllClientUsecase(repository);
    const facade = new ClientAdmFacade({
      addUsecase: addUsecase,
      findUsecase: findUsecase,
      findAllUsecase: findAllUsecase,
    });

    return facade;
  }
}
