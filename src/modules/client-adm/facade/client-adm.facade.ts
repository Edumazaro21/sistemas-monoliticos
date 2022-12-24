import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface, {
  AddClientFacadeInputDto, FindAllClientFacadeOutputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./client-adm.facade.interface";
import FindAllClientUsecase from "../usecase/find-all-client/find-all-client.usecase";

export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  addUsecase: UseCaseInterface;
  findAllUsecase: FindAllClientUsecase;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _findUsecase: UseCaseInterface;
  private _addUsecase: UseCaseInterface;
  private _findAllUsecase: FindAllClientUsecase;

  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._addUsecase = usecaseProps.addUsecase;
    this._findAllUsecase = usecaseProps.findAllUsecase;
  }

  async add(input: AddClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
    return await this._addUsecase.execute(input);
  }
  async find(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    return await this._findUsecase.execute(input);
  }

  async findAll(): Promise<FindAllClientFacadeOutputDto[]> {
    return await this._findAllUsecase.execute();
  }
}
