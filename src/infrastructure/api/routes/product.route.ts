import express, {Request, Response} from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    try {
        const productFacade = ProductAdmFacadeFactory.create();
        const inputProductAdm = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock,
        }

        const output = await productFacade.addProduct(inputProductAdm);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

