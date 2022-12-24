import express, {Request, Response} from "express";
import ClientAdmFacade from "../../../modules/client-adm/facade/client-adm.facade";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
    try {
        const clientFacade = ClientAdmFacadeFactory.create();
        const inputClient = {
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: {
                street: req.body.address.street,
                number: req.body.address.number,
                complement: req.body.address.complement,
                city: req.body.address.city,
                state: req.body.address.state,
                zipCode: req.body.address.zipCode,
            }
        }

        const output = await clientFacade.add(inputClient);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

clientRoute.get("/", async (req: Request, res: Response) => {
    try {
        const clientFacade = ClientAdmFacadeFactory.create();
        const output = await clientFacade.findAll()
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});
