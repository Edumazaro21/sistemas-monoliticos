import express, {Request, Response} from "express";
import ClientAdmFacade from "../../../modules/client-adm/facade/client-adm.facade";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import PlaceOrderFacadeFactory from "../../../modules/checkout/factory/facade.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
    try {
        const checkoutFacade = PlaceOrderFacadeFactory.create();
        const input = {
            clientId: req.body.clientId,
            products: req.body.products,
        }

        const output = await checkoutFacade.generate(input);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

