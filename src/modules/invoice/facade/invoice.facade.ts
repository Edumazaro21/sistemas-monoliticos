import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto
} from "./invoice.facade.interface";
import FindAllInvoiceUsecase from "../usecase/find-all-invoice/find-all-invoice.usecase";

export interface UseCasesProps {
  generateUseCase: UseCaseInterface;
  findUseCase: UseCaseInterface;
  findAllUseCase: FindAllInvoiceUsecase;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateUseCase: UseCaseInterface;
  private _findUseCase: UseCaseInterface;
  private _findAllUseCase: FindAllInvoiceUsecase;

  constructor(usecasesProps: UseCasesProps) {
    this._generateUseCase = usecasesProps.generateUseCase;
    this._findUseCase = usecasesProps.findUseCase;
    this._findAllUseCase = usecasesProps.findAllUseCase;
  }

  generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    // caso o dto do caso de uso for != do dto da facade, converter o dto da facade para o dto do caso de uso
    return this._generateUseCase.execute(input);
  }
  find(
    input: FindInvoiceFacadeInputDto
  ): Promise<FindInvoiceFacadeOutputDto> {
    return this._findUseCase.execute(input);
  }
    findAll(): Promise<FindInvoiceFacadeOutputDto[]> {
        return this._findAllUseCase.execute();
    }
}
