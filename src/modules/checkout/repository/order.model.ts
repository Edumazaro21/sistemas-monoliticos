import {Column, HasMany, HasOne, Model, PrimaryKey, Table} from "sequelize-typescript";

import ProductModel from "./product.model";
import ClientModel from "./client.model";

@Table({
    tableName: "orders",
    timestamps: false,
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column({allowNull: false})
    id: string;

    @Column({allowNull: false})
    status: string;

    @Column({allowNull: true})
    invoiceId: string;

    @HasOne(() => ClientModel)
    declare client: ClientModel;

    @HasMany(() => ProductModel)
    declare products: ProductModel[];
}