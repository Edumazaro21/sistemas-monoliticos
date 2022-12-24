import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/facade.factory";
import {FindInvoiceFacadeInputDto} from "../../../modules/invoice/facade/invoice.facade.interface";


export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (request: Request, response: Response) => {
  const facade = InvoiceFacadeFactory.create();

  try {
    const input: FindInvoiceFacadeInputDto = {
      id: request.params.id,
    };

    const invoice = await facade.find(input);

    response.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

invoiceRoute.get("/", async (request: Request, response: Response) => {
  const facade = InvoiceFacadeFactory.create();

  try {
    const invoices = await facade.findAll();

    response.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
