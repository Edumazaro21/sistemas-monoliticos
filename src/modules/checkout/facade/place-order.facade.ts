import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import PlaceOrderFacadeInterface, {
  GeneratePlaceOrderFacadeInputDto,
  GeneratePlaceOrderFacadeOutputDto
} from "./place-order.facade.interface";

export interface UseCasesProps {
  generateUseCase: UseCaseInterface;
}

export default class PlaceOrderFacade implements PlaceOrderFacadeInterface {
  private _generateUseCase: UseCaseInterface;

  constructor(usecasesProps: UseCasesProps) {
    this._generateUseCase = usecasesProps.generateUseCase;
  }

  generate(input: GeneratePlaceOrderFacadeInputDto): Promise<GeneratePlaceOrderFacadeOutputDto> {
    // caso o dto do caso de uso for != do dto da facade, converter o dto da facade para o dto do caso de uso
    return this._generateUseCase.execute(input);
  }
}
