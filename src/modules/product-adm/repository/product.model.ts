import {Column, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import InvoiceModel from "../../invoice/repository/invoice.model";

@Table({
  tableName: "products",
  timestamps: false,
})
export default class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ allowNull: false, field: "price" })
  purchasePrice: number;

  @Column({ allowNull: false })
  stock: number;

  @Column({ allowNull: true })
  createdAt: Date;

  @Column({ allowNull: true })
  updatedAt: Date;

  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: true, field: "invoice_id" })
  // tslint:disable-next-line:variable-name
  invoiceId: string;
}
